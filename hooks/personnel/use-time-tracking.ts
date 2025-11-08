/**
 * Hook pour le suivi du temps de travail (time tracking / pointage)
 */

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface TimeEntry {
  id: string;
  userId: string;
  date: Date;
  clockIn: Date;
  clockOut?: Date | null;
  breakDuration: number;
  hoursWorked?: number | null;
  notes?: string | null;
  type: "REGULAR" | "OVERTIME" | "SICK_LEAVE" | "VACATION" | "REMOTE";
  validated: boolean;
  validatedBy?: string | null;
  validatedAt?: Date | null;
  createdAt: Date;
}

export function useTimeTracking() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [clockingIn, setClockingIn] = useState(false);
  const [clockingOut, setClockingOut] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const { toast } = useToast();

  /**
   * Récupérer les entrées de temps pour une période
   */
  const fetchEntries = useCallback(
    async (userId: string, startDate: Date, endDate: Date) => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        const response = await fetch(`/api/personnel/time-tracking?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Erreur lors du chargement");
        }

        const data = await response.json();
        setEntries(data.entries || []);

        // Chercher si il y a une entrée en cours (clockOut = null)
        const ongoing = data.entries.find((e: TimeEntry) => !e.clockOut);
        setCurrentEntry(ongoing || null);
      } catch (error: any) {
        console.error("Error fetching time entries:", error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de charger les pointages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Pointer l'arrivée (clock in)
   */
  const clockIn = async (notes?: string): Promise<boolean> => {
    try {
      setClockingIn(true);

      const response = await fetch("/api/personnel/time-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "clock-in",
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors du pointage");
      }

      const data = await response.json();
      setCurrentEntry(data.entry);

      toast({
        title: "Pointage enregistré",
        description: "Votre arrivée a été enregistrée",
      });

      return true;
    } catch (error: any) {
      console.error("Error clocking in:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer le pointage",
        variant: "destructive",
      });
      return false;
    } finally {
      setClockingIn(false);
    }
  };

  /**
   * Pointer la sortie (clock out)
   */
  const clockOut = async (breakDuration: number = 0): Promise<boolean> => {
    try {
      setClockingOut(true);

      const response = await fetch("/api/personnel/time-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "clock-out",
          breakDuration,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors du pointage");
      }

      const data = await response.json();
      setCurrentEntry(null);

      // Ajouter l'entrée complétée à la liste
      setEntries((prev) => [data.entry, ...prev]);

      toast({
        title: "Pointage enregistré",
        description: `Sortie enregistrée - ${data.entry.hoursWorked || 0}h travaillées`,
      });

      return true;
    } catch (error: any) {
      console.error("Error clocking out:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer le pointage",
        variant: "destructive",
      });
      return false;
    } finally {
      setClockingOut(false);
    }
  };

  /**
   * Créer une entrée manuelle (pour corrections)
   */
  const createManualEntry = async (data: {
    userId?: string;
    date: Date;
    clockIn: Date;
    clockOut: Date;
    breakDuration?: number;
    notes?: string;
    type?: "REGULAR" | "OVERTIME" | "SICK_LEAVE" | "VACATION" | "REMOTE";
  }): Promise<boolean> => {
    try {
      const response = await fetch("/api/personnel/time-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "manual-entry",
          ...data,
          date: data.date.toISOString(),
          clockIn: data.clockIn.toISOString(),
          clockOut: data.clockOut.toISOString(),
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Erreur lors de la création");
      }

      toast({
        title: "Entrée créée",
        description: "L'entrée manuelle a été ajoutée avec succès",
      });

      return true;
    } catch (error: any) {
      console.error("Error creating manual entry:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'entrée",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Calculer le total d'heures travaillées
   */
  const getTotalHours = useCallback((): number => {
    return entries.reduce((total, entry) => {
      return total + (entry.hoursWorked ? Number(entry.hoursWorked) : 0);
    }, 0);
  }, [entries]);

  /**
   * Vérifier si l'utilisateur est actuellement pointé
   */
  const isClockedIn = currentEntry !== null;

  return {
    // Data
    entries,
    currentEntry,
    loading,
    clockingIn,
    clockingOut,
    isClockedIn,

    // Actions
    fetchEntries,
    clockIn,
    clockOut,
    createManualEntry,
    getTotalHours,
  };
}

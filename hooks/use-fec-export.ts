"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format, subMonths, startOfYear, endOfYear } from "date-fns";

interface FECStats {
  periode: {
    debut: string;
    fin: string;
  };
  documents: {
    factures: number;
    avoirs: number;
    total: number;
  };
  paiements: number;
  ecritures: number;
  montants: {
    ventesHT: string;
    tva: string;
    ventesTTC: string;
  };
}

export function useFECExport() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [stats, setStats] = useState<FECStats | null>(null);

  // Dates par défaut: début de l'année au jour actuel
  const today = new Date();
  const [dateDebut, setDateDebut] = useState<Date>(startOfYear(today));
  const [dateFin, setDateFin] = useState<Date>(today);

  /**
   * Charger les statistiques
   */
  const loadStats = async () => {
    try {
      setIsLoadingStats(true);

      const dateDebutStr = format(dateDebut, "yyyy-MM-dd");
      const dateFinStr = format(dateFin, "yyyy-MM-dd");

      const response = await fetch(
        `/api/export/fec?dateDebut=${dateDebutStr}&dateFin=${dateFinStr}&format=stats`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors du chargement des statistiques");
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  /**
   * Exporter le fichier FEC
   */
  const exportFEC = async () => {
    try {
      setIsExporting(true);

      const dateDebutStr = format(dateDebut, "yyyy-MM-dd");
      const dateFinStr = format(dateFin, "yyyy-MM-dd");

      const response = await fetch(
        `/api/export/fec?dateDebut=${dateDebutStr}&dateFin=${dateFinStr}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'export FEC");
      }

      // Télécharger le fichier
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Récupérer le nom du fichier depuis les headers
      const contentDisposition = response.headers.get("content-disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `FEC-${dateFinStr}.txt`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export réussi",
        description: `Le fichier FEC a été téléchargé : ${filename}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur d'export",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Définir une période prédéfinie
   */
  const setPeriodPreset = (preset: string) => {
    const today = new Date();
    switch (preset) {
      case "current-year":
        setDateDebut(startOfYear(today));
        setDateFin(today);
        break;
      case "last-year":
        const lastYear = new Date(today.getFullYear() - 1, 0, 1);
        setDateDebut(startOfYear(lastYear));
        setDateFin(endOfYear(lastYear));
        break;
      case "last-3-months":
        setDateDebut(subMonths(today, 3));
        setDateFin(today);
        break;
      case "last-6-months":
        setDateDebut(subMonths(today, 6));
        setDateFin(today);
        break;
      case "last-12-months":
        setDateDebut(subMonths(today, 12));
        setDateFin(today);
        break;
    }
  };

  return {
    dateDebut,
    dateFin,
    setDateDebut,
    setDateFin,
    setPeriodPreset,
    stats,
    isLoadingStats,
    loadStats,
    isExporting,
    exportFEC,
  };
}

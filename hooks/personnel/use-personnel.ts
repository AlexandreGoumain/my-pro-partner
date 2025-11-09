/**
 * Hook pour la gestion du personnel
 *
 * Gère les opérations CRUD sur les employés
 */

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "EMPLOYEE" | "CASHIER" | "ACCOUNTANT";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "INVITED";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  prenom?: string | null;
  role: UserRole;
  status: UserStatus;
  telephone?: string | null;
  poste?: string | null;
  departement?: string | null;
  dateEmbauche?: Date | null;
  photoUrl?: string | null;
  lastLoginAt?: Date | null;
  permissions?: any;
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  prenom?: string;
  role: UserRole;
  password?: string;
  telephone?: string;
  poste?: string;
  departement?: string;
  dateEmbauche?: string;
  salaireHoraire?: number;
  sendInvitation?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  prenom?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  photoUrl?: string;
  poste?: string;
  departement?: string;
  dateEmbauche?: string;
  dateFinContrat?: string;
  salaireHoraire?: number;
  numeroSecu?: string;
  iban?: string;
}

export interface PersonnelStats {
  total: number;
  active: number;
  invited: number;
  byRole: Array<{ role: UserRole; _count: number }>;
}

export function usePersonnel() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<PersonnelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  // Filtres
  const [filters, setFilters] = useState({
    role: undefined as UserRole | undefined,
    status: undefined as UserStatus | undefined,
    search: "",
  });

  /**
   * Charger la liste des employés
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/personnel?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des employés");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les employés",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  /**
   * Charger les statistiques
   */
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/personnel/stats");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des statistiques");
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  /**
   * Créer un nouvel employé
   */
  const createUser = async (input: CreateUserInput): Promise<boolean> => {
    try {
      setCreating(true);

      const response = await fetch("/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.limitReached) {
          toast({
            title: "Limite atteinte",
            description: data.error,
            variant: "destructive",
          });
          return false;
        }
        throw new Error(data.error || "Erreur lors de la création");
      }

      toast({
        title: "Employé créé",
        description: `${input.name || input.email} a été ajouté avec succès`,
      });

      // Recharger la liste
      await fetchUsers();
      await fetchStats();

      return true;
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'employé",
        variant: "destructive",
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  /**
   * Mettre à jour un employé
   */
  const updateUser = async (
    userId: string,
    input: UpdateUserInput
  ): Promise<boolean> => {
    try {
      setUpdating(true);

      const response = await fetch(`/api/personnel/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast({
        title: "Employé mis à jour",
        description: "Les modifications ont été enregistrées",
      });

      // Recharger la liste
      await fetchUsers();
      await fetchStats();

      return true;
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour l'employé",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Supprimer un employé
   */
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/personnel/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      toast({
        title: "Employé supprimé",
        description: "L'employé a été supprimé avec succès",
      });

      // Recharger la liste
      await fetchUsers();
      await fetchStats();

      return true;
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'employé",
        variant: "destructive",
      });
      return false;
    } finally {
      setDeleting(false);
    }
  };

  /**
   * Changer le statut d'un employé
   */
  const toggleStatus = async (
    userId: string,
    newStatus: UserStatus
  ): Promise<boolean> => {
    return updateUser(userId, { status: newStatus });
  };

  /**
   * Mettre à jour les permissions d'un employé
   */
  const updatePermissions = async (
    userId: string,
    permissions: Record<string, boolean>
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/personnel/${userId}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permissions),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast({
        title: "Permissions mises à jour",
        description: "Les permissions ont été modifiées avec succès",
      });

      return true;
    } catch (error: any) {
      console.error("Error updating permissions:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour les permissions",
        variant: "destructive",
      });
      return false;
    }
  };

  // Charger les données au montage
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  return {
    // Data
    users,
    stats,
    loading,
    creating,
    updating,
    deleting,

    // Filters
    filters,
    setFilters,

    // Actions
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
    updatePermissions,
    refresh: fetchUsers,
  };
}

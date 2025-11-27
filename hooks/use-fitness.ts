"use client";

import type {
    AbonnementFitness,
    CoursCollectif,
    FitnessStats,
    PresenceFitness,
    ReservationCours,
    SalleFitness,
    SeanceCours,
    StatutAbonnementFitness,
    StatutReservationCours,
    StatutSeanceCours,
    TypeAbonnementFitness,
} from "@/lib/types/fitness";
import type {
    AbonnementCreateInput,
    TypeAbonnementCreateInput,
} from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ============================================
// TYPES D'ABONNEMENTS
// ============================================

export function useTypesAbonnements(options?: {
    actif?: boolean;
    enabled?: boolean;
}) {
    return useQuery({
        queryKey: ["fitness", "types-abonnements", options],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (options?.actif !== undefined)
                params.set("actif", String(options.actif));

            const res = await fetch(`/api/fitness/types-abonnements?${params}`);
            if (!res.ok)
                throw new Error(
                    "Erreur lors du chargement des types d'abonnements"
                );
            const data = await res.json();
            return data.data as TypeAbonnementFitness[];
        },
        enabled: options?.enabled !== false,
    });
}

export function useTypeAbonnement(id: string) {
    return useQuery({
        queryKey: ["fitness", "types-abonnements", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/types-abonnements/${id}`);
            if (!res.ok) throw new Error("Type d'abonnement non trouvé");
            return res.json() as Promise<TypeAbonnementFitness>;
        },
        enabled: !!id,
    });
}

export function useCreateTypeAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TypeAbonnementCreateInput) => {
            const res = await fetch("/api/fitness/types-abonnements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "types-abonnements"],
            });
        },
    });
}

export function useUpdateTypeAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<TypeAbonnementFitness>;
        }) => {
            const res = await fetch(`/api/fitness/types-abonnements/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "types-abonnements"],
            });
        },
    });
}

export function useDeleteTypeAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/types-abonnements/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "types-abonnements"],
            });
        },
    });
}

// ============================================
// ABONNEMENTS
// ============================================

interface AbonnementsFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: StatutAbonnementFitness;
    typeAbonnementId?: string;
    clientId?: string;
    enabled?: boolean;
}

export function useAbonnements(filters?: AbonnementsFilters) {
    return useQuery({
        queryKey: ["fitness", "abonnements", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.search) params.set("search", filters.search);
            if (filters?.statut) params.set("statut", filters.statut);
            if (filters?.typeAbonnementId)
                params.set("typeAbonnementId", filters.typeAbonnementId);
            if (filters?.clientId) params.set("clientId", filters.clientId);

            const res = await fetch(`/api/fitness/abonnements?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des abonnements");
            return res.json() as Promise<{
                data: AbonnementFitness[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            }>;
        },
        enabled: filters?.enabled !== false,
    });
}

export function useAbonnement(id: string) {
    return useQuery({
        queryKey: ["fitness", "abonnements", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/abonnements/${id}`);
            if (!res.ok) throw new Error("Abonnement non trouvé");
            return res.json() as Promise<AbonnementFitness>;
        },
        enabled: !!id,
    });
}

export function useCreateAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AbonnementCreateInput) => {
            const res = await fetch("/api/fitness/abonnements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

export function useUpdateAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<AbonnementFitness>;
        }) => {
            const res = await fetch(`/api/fitness/abonnements/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

export function useDeleteAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/abonnements/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

// ============================================
// COURS COLLECTIFS
// ============================================

interface CoursFilters {
    actif?: boolean;
    categorie?: string;
    niveau?: string;
    instructeurId?: string;
    search?: string;
    enabled?: boolean;
}

export function useCours(filters?: CoursFilters) {
    return useQuery({
        queryKey: ["fitness", "cours", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.actif !== undefined)
                params.set("actif", String(filters.actif));
            if (filters?.categorie) params.set("categorie", filters.categorie);
            if (filters?.niveau) params.set("niveau", filters.niveau);
            if (filters?.instructeurId)
                params.set("instructeurId", filters.instructeurId);
            if (filters?.search) params.set("search", filters.search);

            const res = await fetch(`/api/fitness/cours?${params}`);
            if (!res.ok) throw new Error("Erreur lors du chargement des cours");
            const data = await res.json();
            return data.data as CoursCollectif[];
        },
        enabled: filters?.enabled !== false,
    });
}

export function useCoursDetails(id: string) {
    return useQuery({
        queryKey: ["fitness", "cours", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/cours/${id}`);
            if (!res.ok) throw new Error("Cours non trouvé");
            return res.json() as Promise<CoursCollectif>;
        },
        enabled: !!id,
    });
}

export function useCreateCours() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<CoursCollectif>) => {
            const res = await fetch("/api/fitness/cours", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "cours"] });
        },
    });
}

export function useUpdateCours() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<CoursCollectif>;
        }) => {
            const res = await fetch(`/api/fitness/cours/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "cours"] });
        },
    });
}

export function useDeleteCours() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/cours/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "cours"] });
        },
    });
}

// ============================================
// SALLES FITNESS
// ============================================

interface SallesFilters {
    actif?: boolean;
    type?: string;
    premium?: boolean;
    reservable?: boolean;
    enabled?: boolean;
}

export function useSallesFitness(filters?: SallesFilters) {
    return useQuery({
        queryKey: ["fitness", "salles", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.actif !== undefined)
                params.set("actif", String(filters.actif));
            if (filters?.type) params.set("type", filters.type);
            if (filters?.premium !== undefined)
                params.set("premium", String(filters.premium));
            if (filters?.reservable !== undefined)
                params.set("reservable", String(filters.reservable));

            const res = await fetch(`/api/fitness/salles?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des salles");
            const data = await res.json();
            return data.data as SalleFitness[];
        },
        enabled: filters?.enabled !== false,
    });
}

export function useSalleFitness(id: string) {
    return useQuery({
        queryKey: ["fitness", "salles", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/salles/${id}`);
            if (!res.ok) throw new Error("Salle non trouvée");
            return res.json() as Promise<SalleFitness>;
        },
        enabled: !!id,
    });
}

export function useCreateSalleFitness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<SalleFitness>) => {
            const res = await fetch("/api/fitness/salles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "salles"] });
        },
    });
}

export function useUpdateSalleFitness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<SalleFitness>;
        }) => {
            const res = await fetch(`/api/fitness/salles/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "salles"] });
        },
    });
}

export function useDeleteSalleFitness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/salles/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "salles"] });
        },
    });
}

// ============================================
// SEANCES DE COURS
// ============================================

interface SeancesFilters {
    page?: number;
    limit?: number;
    coursId?: string;
    instructeurId?: string;
    salleId?: string;
    statut?: StatutSeanceCours;
    dateDebut?: string;
    dateFin?: string;
    enabled?: boolean;
}

export function useSeances(filters?: SeancesFilters) {
    return useQuery({
        queryKey: ["fitness", "seances", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.coursId) params.set("coursId", filters.coursId);
            if (filters?.instructeurId)
                params.set("instructeurId", filters.instructeurId);
            if (filters?.salleId) params.set("salleId", filters.salleId);
            if (filters?.statut) params.set("statut", filters.statut);
            if (filters?.dateDebut) params.set("dateDebut", filters.dateDebut);
            if (filters?.dateFin) params.set("dateFin", filters.dateFin);

            const res = await fetch(`/api/fitness/seances?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des séances");
            return res.json() as Promise<{
                data: SeanceCours[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            }>;
        },
        enabled: filters?.enabled !== false,
    });
}

export function useSeance(id: string) {
    return useQuery({
        queryKey: ["fitness", "seances", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/seances/${id}`);
            if (!res.ok) throw new Error("Séance non trouvée");
            return res.json() as Promise<SeanceCours>;
        },
        enabled: !!id,
    });
}

export function useCreateSeance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            data: Partial<SeanceCours> & {
                joursSemaine?: number[];
                dateDebut?: string;
                dateFin?: string;
                heureDebut?: string;
            }
        ) => {
            const res = await fetch("/api/fitness/seances", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

export function useUpdateSeance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<SeanceCours>;
        }) => {
            const res = await fetch(`/api/fitness/seances/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}

export function useDeleteSeance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/seances/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

// ============================================
// RESERVATIONS
// ============================================

interface ReservationsFilters {
    page?: number;
    limit?: number;
    seanceId?: string;
    clientId?: string;
    statut?: StatutReservationCours;
    enabled?: boolean;
}

export function useReservations(filters?: ReservationsFilters) {
    return useQuery({
        queryKey: ["fitness", "reservations", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.seanceId) params.set("seanceId", filters.seanceId);
            if (filters?.clientId) params.set("clientId", filters.clientId);
            if (filters?.statut) params.set("statut", filters.statut);

            const res = await fetch(`/api/fitness/reservations?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des réservations");
            return res.json() as Promise<{
                data: ReservationCours[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            }>;
        },
        enabled: filters?.enabled !== false,
    });
}

export function useReservation(id: string) {
    return useQuery({
        queryKey: ["fitness", "reservations", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/reservations/${id}`);
            if (!res.ok) throw new Error("Réservation non trouvée");
            return res.json() as Promise<ReservationCours>;
        },
        enabled: !!id,
    });
}

export function useCreateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            seanceId: string;
            clientId: string;
            notes?: string;
        }) => {
            const res = await fetch("/api/fitness/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "reservations"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}

export function useUpdateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<ReservationCours>;
        }) => {
            const res = await fetch(`/api/fitness/reservations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "reservations"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}

export function useDeleteReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/reservations/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "reservations"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}

// ============================================
// PRESENCES / CHECK-IN
// ============================================

interface PresencesFilters {
    page?: number;
    limit?: number;
    clientId?: string;
    abonnementId?: string;
    salleId?: string;
    typeAcces?: string;
    dateDebut?: string;
    dateFin?: string;
    enabled?: boolean;
}

export function usePresences(filters?: PresencesFilters) {
    return useQuery({
        queryKey: ["fitness", "presences", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.clientId) params.set("clientId", filters.clientId);
            if (filters?.abonnementId)
                params.set("abonnementId", filters.abonnementId);
            if (filters?.salleId) params.set("salleId", filters.salleId);
            if (filters?.typeAcces) params.set("typeAcces", filters.typeAcces);
            if (filters?.dateDebut) params.set("dateDebut", filters.dateDebut);
            if (filters?.dateFin) params.set("dateFin", filters.dateFin);

            const res = await fetch(`/api/fitness/presences?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des présences");
            return res.json() as Promise<{
                data: PresenceFitness[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            }>;
        },
        enabled: filters?.enabled !== false,
    });
}

export function usePresence(id: string) {
    return useQuery({
        queryKey: ["fitness", "presences", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/presences/${id}`);
            if (!res.ok) throw new Error("Présence non trouvée");
            return res.json() as Promise<PresenceFitness>;
        },
        enabled: !!id,
    });
}

export function useCreatePresence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<PresenceFitness>) => {
            const res = await fetch("/api/fitness/presences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "presences"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
        },
    });
}

export function useCheckIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            numeroCarte?: string;
            codeAcces?: string;
            clientId?: string;
            salleId?: string;
            typeAcces?: "ENTREE" | "SORTIE" | "COURS" | "ESPACE_PREMIUM";
        }) => {
            const res = await fetch("/api/fitness/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors du check-in");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "presences"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
        },
    });
}

export function useUpdatePresence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<PresenceFitness>;
        }) => {
            const res = await fetch(`/api/fitness/presences/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "presences"],
            });
        },
    });
}

// ============================================
// STATISTIQUES
// ============================================

export function useFitnessStats(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["fitness", "stats"],
        queryFn: async () => {
            const res = await fetch("/api/fitness/stats");
            if (!res.ok)
                throw new Error("Erreur lors du chargement des statistiques");
            return res.json() as Promise<FitnessStats>;
        },
        enabled: options?.enabled !== false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

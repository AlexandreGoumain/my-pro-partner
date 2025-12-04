import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api/client-api";

export interface ClientRdv {
    id: string;
    date: string;
    heure: string;
    duree: number;
    statut: "EN_ATTENTE" | "CONFIRME" | "EN_COURS" | "TERMINE" | "ANNULE" | "NO_SHOW";
    notes?: string;
    nomClient: string;
    telephone?: string;
    email?: string;
    prestation?: {
        id: string;
        nom: string;
        duree: number;
        prix: number;
        categorie?: string;
        description?: string;
    };
    employe?: {
        id: string;
        nom: string;
        prenom: string;
        couleur?: string;
        bio?: string;
    };
}

interface UseClientRdvOptions {
    status?: string;
    upcoming?: boolean;
    enabled?: boolean;
}

/**
 * Hook to fetch client's appointments
 */
export function useClientRdv(options: UseClientRdvOptions = {}) {
    const { status, upcoming = false, enabled = true } = options;

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (upcoming) params.set("upcoming", "true");

    const queryString = params.toString();
    const endpoint = `/api/client/rdv${queryString ? `?${queryString}` : ""}`;

    return useQuery({
        queryKey: ["client", "rdv", { status, upcoming }],
        queryFn: async () => {
            const data = await clientApiFetch<{ rendezVous: ClientRdv[] }>(endpoint);
            return data.rendezVous;
        },
        enabled,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch a single appointment detail
 */
export function useClientRdvDetail(id: string, enabled = true) {
    return useQuery({
        queryKey: ["client", "rdv", id],
        queryFn: async () => {
            const data = await clientApiFetch<{ rendezVous: ClientRdv }>(`/api/client/rdv/${id}`);
            return data.rendezVous;
        },
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

interface CreateRdvData {
    date: string;
    heure: string;
    prestationId: string;
    employeId?: string;
    notes?: string;
}

/**
 * Hook to create a new appointment
 */
export function useCreateRdv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateRdvData) => {
            const response = await clientApiFetch<{ rendezVous: ClientRdv }>(
                "/api/client/rdv",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );
            return response.rendezVous;
        },
        onSuccess: () => {
            // Invalidate all rdv queries
            queryClient.invalidateQueries({ queryKey: ["client", "rdv"] });
            // Also invalidate dashboard stats
            queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
        },
    });
}

/**
 * Hook to cancel an appointment
 */
export function useCancelRdv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await clientApiFetch<{ message: string; rendezVous: ClientRdv }>(
                `/api/client/rdv/${id}`,
                { method: "DELETE" }
            );
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["client", "rdv"] });
            queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
        },
    });
}

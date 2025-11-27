import { api } from "@/lib/api/fetch-client";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import type {
    DisponibilitesResponse,
    RendezVous,
    RendezVousCreateInput,
    RendezVousPaginationParams,
    RendezVousUpdateInput,
} from "@/lib/types/rendez-vous.types";
import type { PaginatedResponse } from "@/lib/utils/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Re-export types for convenience
export { RENDEZ_VOUS_STATUTS } from "@/lib/types/rendez-vous.types";
export type {
    DisponibilitesResponse,
    RendezVous,
    RendezVousCreateInput,
    RendezVousStatut,
    RendezVousUpdateInput,
    TimeSlot,
} from "@/lib/types/rendez-vous.types";

// Create base hooks using factory
const rdvHooks = createResourceHooks<RendezVous>({
    resourceName: "rdv",
    endpoint: "/api/rdv",
});

// Extend query keys with custom keys
export const rdvKeys = {
    ...rdvHooks.keys,
    list: (params: RendezVousPaginationParams) =>
        ["rdv", "list", params] as const,
    disponibilites: (params: {
        date: string;
        employeId?: string;
        duree?: number;
    }) => ["rdv", "disponibilites", params] as const,
};

// Export base hooks from factory
export const useRendezVous = rdvHooks.useList;
export const useRendezVousDetail = rdvHooks.useDetail;
export const useCreateRendezVous = () =>
    rdvHooks.useCreate<RendezVousCreateInput>();
export const useUpdateRendezVous = () =>
    rdvHooks.useUpdate<RendezVousUpdateInput>();
export const useDeleteRendezVous = rdvHooks.useDelete;

// Custom hook: Server-side pagination with filters
export function useRendezVousPaginated(params?: RendezVousPaginationParams) {
    const {
        page = 1,
        limit = 20,
        search = "",
        statut,
        employeId,
        clientId,
        prestationId,
        dateDebut,
        dateFin,
    } = params || {};

    return useQuery({
        queryKey: rdvKeys.list({
            page,
            limit,
            search,
            statut,
            employeId,
            clientId,
            prestationId,
            dateDebut,
            dateFin,
        }),
        queryFn: async (): Promise<PaginatedResponse<RendezVous>> => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (search) searchParams.set("search", search);
            if (statut) searchParams.set("statut", statut);
            if (employeId) searchParams.set("employeId", employeId);
            if (clientId) searchParams.set("clientId", clientId);
            if (prestationId) searchParams.set("prestationId", prestationId);
            if (dateDebut) searchParams.set("dateDebut", dateDebut);
            if (dateFin) searchParams.set("dateFin", dateFin);

            return api.get<PaginatedResponse<RendezVous>>(
                `/api/rdv?${searchParams.toString()}`
            );
        },
        enabled: !!params,
    });
}

// Hook to get available time slots
export function useDisponibilites(params: {
    date: string;
    employeId?: string;
    duree?: number;
    interval?: number;
}) {
    const { date, employeId, duree = 60, interval = 30 } = params;

    return useQuery({
        queryKey: rdvKeys.disponibilites({ date, employeId, duree }),
        queryFn: async (): Promise<DisponibilitesResponse> => {
            const searchParams = new URLSearchParams();
            searchParams.set("date", date);
            if (employeId) searchParams.set("employeId", employeId);
            searchParams.set("duree", duree.toString());
            searchParams.set("interval", interval.toString());

            return api.get<DisponibilitesResponse>(
                `/api/rdv/disponibilites?${searchParams.toString()}`
            );
        },
        enabled: !!date,
    });
}

// Hook to confirm a rendez-vous
export function useConfirmRendezVous() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return api.post<RendezVous>(`/api/rdv/${id}/confirm`, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rdv"] });
        },
    });
}

// Hook to cancel a rendez-vous
export function useCancelRendezVous() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return api.post<RendezVous>(`/api/rdv/${id}/cancel`, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rdv"] });
        },
    });
}

// Hook to get rendez-vous for a specific date range (calendar view)
export function useRendezVousCalendar(dateDebut: string, dateFin: string) {
    return useQuery({
        queryKey: ["rdv", "calendar", dateDebut, dateFin],
        queryFn: async (): Promise<RendezVous[]> => {
            const searchParams = new URLSearchParams();
            searchParams.set("dateDebut", dateDebut);
            searchParams.set("dateFin", dateFin);
            searchParams.set("limit", "500"); // Get all for calendar view

            const result = await api.get<PaginatedResponse<RendezVous>>(
                `/api/rdv?${searchParams.toString()}`
            );
            return result.data || [];
        },
        enabled: !!dateDebut && !!dateFin,
    });
}

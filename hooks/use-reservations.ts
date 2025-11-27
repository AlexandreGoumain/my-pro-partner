import { api } from "@/lib/api/fetch-client";
import {
    CreateReservationData,
    Reservation,
    ReservationStats,
    ReservationStatut,
    UpdateReservationData,
} from "@/lib/types/reservation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Re-export types and enums for convenience
export { ReservationStatut };
export type {
    CreateReservationData,
    Reservation,
    ReservationStats,
    UpdateReservationData,
};

// Query keys factory
export const reservationKeys = {
    all: ["reservations"] as const,
    lists: () => [...reservationKeys.all, "list"] as const,
    list: (params: ReservationsPaginationParams) =>
        [...reservationKeys.lists(), params] as const,
    details: () => [...reservationKeys.all, "detail"] as const,
    detail: (id: string) => [...reservationKeys.details(), id] as const,
    stats: () => [...reservationKeys.all, "stats"] as const,
};

// Pagination params
export interface ReservationsPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    date?: string; // YYYY-MM-DD
    dateStart?: string; // Range start
    dateEnd?: string; // Range end
    statut?: ReservationStatut | "all";
    tableId?: string;
}

// API response types
interface ReservationsListResponse {
    reservations: Reservation[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface ReservationResponse {
    reservation: Reservation;
}

interface ReservationStatsResponse {
    stats: ReservationStats;
}

// ============================================
// QUERY HOOKS
// ============================================

// Get paginated list of reservations with filters
export function useReservations(params?: ReservationsPaginationParams) {
    const {
        page = 1,
        limit = 50,
        search,
        date,
        dateStart,
        dateEnd,
        statut,
        tableId,
    } = params || {};

    return useQuery({
        queryKey: reservationKeys.list({
            page,
            limit,
            search,
            date,
            dateStart,
            dateEnd,
            statut,
            tableId,
        }),
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (search) searchParams.set("search", search);
            if (date) searchParams.set("date", date);
            if (dateStart) searchParams.set("dateStart", dateStart);
            if (dateEnd) searchParams.set("dateEnd", dateEnd);
            if (statut && statut !== "all") searchParams.set("statut", statut);
            if (tableId && tableId !== "all")
                searchParams.set("tableId", tableId);

            const response = await api.get<ReservationsListResponse>(
                `/api/reservations?${searchParams.toString()}`
            );
            return {
                data: response.reservations,
                pagination: response.pagination,
            };
        },
    });
}

// Get single reservation detail
export function useReservation(id: string) {
    return useQuery({
        queryKey: reservationKeys.detail(id),
        queryFn: async () => {
            const response = await api.get<ReservationResponse>(
                `/api/reservations/${id}`
            );
            return response.reservation;
        },
        enabled: !!id,
    });
}

// Get reservation statistics
export function useReservationsStats() {
    return useQuery({
        queryKey: reservationKeys.stats(),
        queryFn: async () => {
            const response = await api.get<ReservationStatsResponse>(
                "/api/reservations/stats"
            );
            return response.stats;
        },
    });
}

// ============================================
// MUTATION HOOKS
// ============================================

// Create a new reservation
export function useCreateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateReservationData) => {
            const response = await api.post<ReservationResponse>(
                "/api/reservations",
                data
            );
            return response.reservation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
        },
    });
}

// Update a reservation
export function useUpdateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: UpdateReservationData;
        }) => {
            const response = await api.put<ReservationResponse>(
                `/api/reservations/${id}`,
                data
            );
            return response.reservation;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
            queryClient.invalidateQueries({
                queryKey: reservationKeys.detail(variables.id),
            });
        },
    });
}

// Delete a reservation
export function useDeleteReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/api/reservations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
        },
    });
}

// ============================================
// STATUS ACTION HOOKS
// ============================================

// Confirm a reservation (EN_ATTENTE → CONFIRMEE)
export function useConfirmReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post<ReservationResponse>(
                `/api/reservations/${id}/confirm`
            );
            return response.reservation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
        },
    });
}

// Cancel a reservation (→ ANNULEE)
export function useCancelReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post<ReservationResponse>(
                `/api/reservations/${id}/cancel`
            );
            return response.reservation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
        },
    });
}

// Mark client as arrived (EN_ATTENTE/CONFIRMEE → ARRIVEE)
export function useArriveReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post<ReservationResponse>(
                `/api/reservations/${id}/arrive`
            );
            return response.reservation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
            // Also invalidate tables since table status may change
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
    });
}

// Mark reservation as complete (ARRIVEE → TERMINEE)
export function useCompleteReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post<ReservationResponse>(
                `/api/reservations/${id}/complete`
            );
            return response.reservation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
            // Also invalidate tables since table status may change
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
    });
}

// Mark client as no-show (EN_ATTENTE/CONFIRMEE → NO_SHOW)
export function useNoShowReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post<ReservationResponse>(
                `/api/reservations/${id}/no-show`
            );
            return response.reservation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.all });
            // Also invalidate tables since table status may change
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
    });
}

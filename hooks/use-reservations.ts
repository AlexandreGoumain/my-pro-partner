import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reservation, CreateReservationData, ReservationStatut } from "@/lib/types/reservation";

const API_BASE = "/api/reservations";

// ============================================
// MOCK DATA (Temporary - until API is implemented)
// ============================================

const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: 1,
        client: "Dupont Jean",
        date: "2025-11-10",
        heure: "19:00",
        personnes: 4,
        telephone: "06 12 34 56 78",
        statut: ReservationStatut.CONFIRMEE,
    },
    {
        id: 2,
        client: "Martin Sophie",
        date: "2025-11-10",
        heure: "20:00",
        personnes: 2,
        telephone: "06 23 45 67 89",
        statut: ReservationStatut.EN_ATTENTE,
    },
    {
        id: 3,
        client: "Bernard Paul",
        date: "2025-11-10",
        heure: "20:30",
        personnes: 6,
        telephone: "06 34 56 78 90",
        statut: ReservationStatut.CONFIRMEE,
    },
    {
        id: 4,
        client: "Petit Marie",
        date: "2025-11-11",
        heure: "12:30",
        personnes: 3,
        telephone: "06 45 67 89 01",
        statut: ReservationStatut.CONFIRMEE,
    },
    {
        id: 5,
        client: "Dubois Pierre",
        date: "2025-11-11",
        heure: "19:30",
        personnes: 8,
        telephone: "06 56 78 90 12",
        statut: ReservationStatut.EN_ATTENTE,
    },
];

// ============================================
// FETCH FUNCTIONS
// ============================================

async function fetchReservations(): Promise<{ data: Reservation[]; total: number }> {
    // TODO: Replace with actual API call when backend is ready
    // For now, return mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: MOCK_RESERVATIONS,
                total: MOCK_RESERVATIONS.length,
            });
        }, 300); // Simulate network delay
    });

    /* Uncomment when API is ready:
    const response = await fetch(API_BASE);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch reservations");
    }
    return response.json();
    */
}

async function fetchReservation(id: string): Promise<Reservation> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch reservation");
    }
    return response.json();
}

async function createReservation(data: CreateReservationData): Promise<Reservation> {
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create reservation");
    }
    return response.json();
}

async function updateReservation(
    id: string,
    data: Partial<CreateReservationData>
): Promise<Reservation> {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update reservation");
    }
    return response.json();
}

async function deleteReservation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete reservation");
    }
}

async function confirmReservation(id: string): Promise<Reservation> {
    const response = await fetch(`${API_BASE}/${id}/confirm`, {
        method: "POST",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to confirm reservation");
    }
    return response.json();
}

async function cancelReservation(id: string): Promise<Reservation> {
    const response = await fetch(`${API_BASE}/${id}/cancel`, {
        method: "POST",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel reservation");
    }
    return response.json();
}

// ============================================
// HOOKS
// ============================================

export function useReservations() {
    return useQuery({
        queryKey: ["reservations"],
        queryFn: fetchReservations,
    });
}

export function useReservation(id: string) {
    return useQuery({
        queryKey: ["reservations", id],
        queryFn: () => fetchReservation(id),
        enabled: !!id,
    });
}

export function useCreateReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createReservation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
}

export function useUpdateReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateReservationData> }) =>
            updateReservation(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["reservations", variables.id] });
        },
    });
}

export function useDeleteReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReservation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
}

export function useConfirmReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmReservation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
}

export function useCancelReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelReservation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
        },
    });
}

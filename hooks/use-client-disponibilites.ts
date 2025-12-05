import { useQuery } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api/client-api";

export interface TimeSlotEmploye {
    id: string;
    nom: string;
}

export interface TimeSlot {
    heure: string;
    disponible: boolean;
    employes: TimeSlotEmploye[];
}

interface DisponibilitesResponse {
    date: string;
    prestation: {
        id: string;
        nom: string;
        duree: number;
    };
    slots: TimeSlot[];
}

interface UseClientDisponibilitesOptions {
    date: string;
    prestationId: string;
    employeId?: string;
    enabled?: boolean;
}

/**
 * Hook to fetch available time slots for a given date and prestation
 */
export function useClientDisponibilites(options: UseClientDisponibilitesOptions) {
    const { date, prestationId, employeId, enabled = true } = options;

    const params = new URLSearchParams();
    params.set("date", date);
    params.set("prestationId", prestationId);
    if (employeId) params.set("employeId", employeId);

    const endpoint = `/api/client/rdv/disponibilites?${params.toString()}`;

    return useQuery({
        queryKey: ["client", "disponibilites", { date, prestationId, employeId }],
        queryFn: async () => {
            const data = await clientApiFetch<DisponibilitesResponse>(endpoint);
            return data;
        },
        enabled: enabled && !!date && !!prestationId,
        staleTime: 1000 * 60 * 1, // 1 minute (availability changes frequently)
    });
}

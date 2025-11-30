import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { MembreConseilSyndical } from "@/lib/generated/prisma";

// Endpoint (will be added to endpoints.ts)
const ENDPOINT_CONSEIL = "/api/syndic/conseil-syndical";

// Types
export interface MembreConseilWithRelations extends MembreConseilSyndical {
    copropriete?: {
        id: string;
        nom: string;
    };
    membre?: {
        id: string;
        nom: string;
        prenom: string | null;
        telephone: string | null;
        email: string | null;
    };
}

export interface ConseilFilters {
    coproprieteId?: string;
    actif?: boolean;
    role?: string;
}

export interface AddMembreInput {
    coproprieteId: string;
    membreId: string;
    role: string;
    dateDebut: string;
    dateFin?: string;
}

// Query Keys
export const conseilKeys = {
    all: ["conseil-syndical"] as const,
    list: (filters?: ConseilFilters) => ["conseil-syndical", "list", filters] as const,
    byCopropriete: (coproprieteId: string) => ["conseil-syndical", "copropriete", coproprieteId] as const,
};

// Hooks
export function useConseilSyndical(filters?: ConseilFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.coproprieteId) params.set("coproprieteId", filters.coproprieteId);
    if (filters?.actif !== undefined) params.set("actif", String(filters.actif));
    if (filters?.role) params.set("role", filters.role);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINT_CONSEIL}?${queryString}`
        : ENDPOINT_CONSEIL;

    return useQuery({
        queryKey: conseilKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ membres: MembreConseilWithRelations[] }>(url);
            return result.membres;
        },
        enabled: options?.enabled !== false,
    });
}

export function useConseilByCopropriete(coproprieteId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: conseilKeys.byCopropriete(coproprieteId),
        queryFn: async () => {
            const result = await api.get<{ membres: MembreConseilWithRelations[] }>(
                `${ENDPOINT_CONSEIL}?coproprieteId=${coproprieteId}&actif=true`
            );
            return result.membres;
        },
        enabled: !!coproprieteId && options?.enabled !== false,
    });
}

export function useAddMembreConseil() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AddMembreInput) => {
            const result = await api.post<{ membre: MembreConseilWithRelations }>(
                ENDPOINT_CONSEIL,
                data
            );
            return result.membre;
        },
        onSuccess: (membre) => {
            queryClient.invalidateQueries({ queryKey: conseilKeys.all });
            if (membre.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: conseilKeys.byCopropriete(membre.coproprieteId) });
            }
        },
    });
}

export function useUpdateMembreConseil() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<AddMembreInput> & { actif?: boolean } }) => {
            const result = await api.put<{ membre: MembreConseilWithRelations }>(
                `${ENDPOINT_CONSEIL}/${id}`,
                data
            );
            return result.membre;
        },
        onSuccess: (membre) => {
            queryClient.invalidateQueries({ queryKey: conseilKeys.all });
            if (membre.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: conseilKeys.byCopropriete(membre.coproprieteId) });
            }
        },
    });
}

export function useRemoveMembreConseil() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dateFin }: { id: string; dateFin?: string }) => {
            const result = await api.put<{ membre: MembreConseilWithRelations }>(
                `${ENDPOINT_CONSEIL}/${id}`,
                { actif: false, dateFin: dateFin || new Date().toISOString() }
            );
            return result.membre;
        },
        onSuccess: (membre) => {
            queryClient.invalidateQueries({ queryKey: conseilKeys.all });
            if (membre.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: conseilKeys.byCopropriete(membre.coproprieteId) });
            }
        },
    });
}

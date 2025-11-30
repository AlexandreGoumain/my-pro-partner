import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { IncidentLocatif, StatutIncident } from "@/lib/generated/prisma";

// Types
export interface IncidentWithRelations extends IncidentLocatif {
    bail?: {
        id: string;
        reference: string;
        bien: {
            id: string;
            titre: string;
            ville: string;
            adresse: string | null;
        };
        locatairePrincipal: {
            id: string;
            nom: string;
            prenom: string | null;
            telephone: string | null;
        };
        proprietaire: {
            id: string;
            nom: string;
            prenom: string | null;
        };
    };
}

export interface IncidentsFilters {
    bailId?: string;
    statut?: StatutIncident | "ALL";
    categorie?: string;
    urgence?: number;
    search?: string;
}

export interface CreateIncidentInput {
    bailId: string;
    description: string;
    categorie: string;
    urgence?: number;
    photos?: string[];
    notes?: string;
}

export interface UpdateIncidentInput extends Partial<CreateIncidentInput> {
    statut?: StatutIncident;
    dateIntervention?: string;
    prestataire?: string;
    coutEstime?: number;
    coutReel?: number;
    aChargeDe?: "locataire" | "proprietaire";
}

// Query Keys
export const incidentsKeys = {
    all: ["incidents"] as const,
    list: (filters?: IncidentsFilters) => ["incidents", "list", filters] as const,
    detail: (id: string) => ["incidents", "detail", id] as const,
    byBail: (bailId: string) => ["incidents", "bail", bailId] as const,
    enCours: () => ["incidents", "en-cours"] as const,
};

// Hooks
export function useIncidents(filters?: IncidentsFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.bailId) params.set("bailId", filters.bailId);
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.categorie) params.set("categorie", filters.categorie);
    if (filters?.urgence) params.set("urgence", String(filters.urgence));
    if (filters?.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.GESTION_LOCATIVE_INCIDENTS}?${queryString}`
        : ENDPOINTS.GESTION_LOCATIVE_INCIDENTS;

    return useQuery({
        queryKey: incidentsKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ incidents: IncidentWithRelations[] }>(url);
            return result.incidents;
        },
        enabled: options?.enabled !== false,
    });
}

export function useIncident(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: incidentsKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ incident: IncidentWithRelations }>(
                `${ENDPOINTS.GESTION_LOCATIVE_INCIDENTS}/${id}`
            );
            return result.incident;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useIncidentsByBail(bailId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: incidentsKeys.byBail(bailId),
        queryFn: async () => {
            const result = await api.get<{ incidents: IncidentWithRelations[] }>(
                `${ENDPOINTS.GESTION_LOCATIVE_INCIDENTS}?bailId=${bailId}`
            );
            return result.incidents;
        },
        enabled: !!bailId && options?.enabled !== false,
    });
}

export function useIncidentsEnCours(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: incidentsKeys.enCours(),
        queryFn: async () => {
            const result = await api.get<{ incidents: IncidentWithRelations[] }>(
                `${ENDPOINTS.GESTION_LOCATIVE_INCIDENTS}?statut=EN_COURS`
            );
            return result.incidents;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCreateIncident() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateIncidentInput) => {
            const result = await api.post<{ incident: IncidentWithRelations }>(
                ENDPOINTS.GESTION_LOCATIVE_INCIDENTS,
                data
            );
            return result.incident;
        },
        onSuccess: (incident) => {
            queryClient.invalidateQueries({ queryKey: incidentsKeys.all });
            if (incident.bailId) {
                queryClient.invalidateQueries({ queryKey: incidentsKeys.byBail(incident.bailId) });
            }
        },
    });
}

export function useUpdateIncident() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateIncidentInput }) => {
            const result = await api.put<{ incident: IncidentWithRelations }>(
                `${ENDPOINTS.GESTION_LOCATIVE_INCIDENTS}/${id}`,
                data
            );
            return result.incident;
        },
        onSuccess: (incident, { id }) => {
            queryClient.invalidateQueries({ queryKey: incidentsKeys.all });
            queryClient.invalidateQueries({ queryKey: incidentsKeys.detail(id) });
            if (incident.bailId) {
                queryClient.invalidateQueries({ queryKey: incidentsKeys.byBail(incident.bailId) });
            }
        },
    });
}

export function useCloreIncident() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, coutReel, aChargeDe }: { id: string; coutReel?: number; aChargeDe?: "locataire" | "proprietaire" }) => {
            const result = await api.put<{ incident: IncidentWithRelations }>(
                `${ENDPOINTS.GESTION_LOCATIVE_INCIDENTS}/${id}`,
                { statut: "CLOS", coutReel, aChargeDe }
            );
            return result.incident;
        },
        onSuccess: (incident, { id }) => {
            queryClient.invalidateQueries({ queryKey: incidentsKeys.all });
            queryClient.invalidateQueries({ queryKey: incidentsKeys.detail(id) });
            if (incident.bailId) {
                queryClient.invalidateQueries({ queryKey: incidentsKeys.byBail(incident.bailId) });
            }
        },
    });
}

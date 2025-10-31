import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { ClientCreateInput, ClientUpdateInput } from "@/lib/validation";

// Client type definition
export interface Client {
    id: string;
    nom: string;
    prenom?: string | null;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    pays: string;
    notes?: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Query Keys
export const clientKeys = {
    all: ["clients"] as const,
    detail: (id: string) => ["clients", id] as const,
};

// Hook pour récupérer tous les clients
export function useClients() {
    return useQuery({
        queryKey: clientKeys.all,
        queryFn: async (): Promise<Client[]> => {
            const result = await api.get<Client[] | { data: Client[] }>("/api/clients");
            return Array.isArray(result) ? result : result.data || [];
        },
    });
}

// Hook pour récupérer un client par ID
export function useClient(id: string) {
    return useQuery({
        queryKey: clientKeys.detail(id),
        queryFn: async () => api.get<Client>(`/api/clients/${id}`),
        enabled: !!id, // Ne lance la requête que si l'ID existe
    });
}

// Hook pour créer un client
export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ClientCreateInput) =>
            api.post<Client>("/api/clients", data),
        onSuccess: () => {
            // Invalide le cache des clients pour forcer un rechargement
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

// Hook pour mettre à jour un client
export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: ClientUpdateInput;
        }) => api.put<Client>(`/api/clients/${id}`, data),
        onSuccess: (_, variables) => {
            // Invalide le cache des clients et du client spécifique
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
            queryClient.invalidateQueries({
                queryKey: clientKeys.detail(variables.id),
            });
        },
    });
}

// Hook pour supprimer un client
export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/clients/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
        },
    });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { MouvementPointsCreateInput } from "@/lib/validation";
import type { PaginatedResponse } from "@/lib/utils/pagination";
import type { Client } from "./use-clients";
import type { NiveauFidelite } from "./use-loyalty-levels";

// Points movement type definition
export interface MouvementPoints {
    id: string;
    type: "GAIN" | "DEPENSE" | "EXPIRATION" | "AJUSTEMENT";
    points: number;
    description?: string | null;
    reference?: string | null;
    dateExpiration?: Date | null;
    clientId: string;
    client?: Pick<Client, "id" | "nom" | "prenom" | "email">;
    entrepriseId: string;
    createdAt: Date;
}

// Points statistics type definition
export interface PointsStats {
    client?: {
        id: string;
        nom: string;
        prenom?: string | null;
        points_solde: number;
        niveauFidelite?: NiveauFidelite | null;
    };
    mouvements?: Array<{
        type: string;
        _sum: { points: number | null };
        _count: { id: number };
    }>;
    pointsExpiringSoon?: number;
    totalPoints?: number;
    totalClients?: number;
    clientsWithPoints?: number;
    participationRate?: string;
    mouvementsStats?: Array<{
        type: string;
        _sum: { points: number | null };
        _count: { id: number };
    }>;
    niveauxDistribution?: Array<{
        niveau: NiveauFidelite | null;
        count: number;
    }>;
}

// Pagination params
export interface PointsPaginationParams {
    page?: number;
    limit?: number;
    clientId?: string;
    type?: string;
}

// Query Keys
export const loyaltyPointsKeys = {
    all: ["loyaltyPoints"] as const,
    list: (params: PointsPaginationParams) => ["loyaltyPoints", "list", params] as const,
    stats: (clientId?: string) => ["loyaltyPoints", "stats", clientId] as const,
};

// Hook pour récupérer l'historique des mouvements de points avec pagination
export function useLoyaltyPoints(params?: PointsPaginationParams) {
    const { page = 1, limit = 20, clientId, type } = params || {};

    return useQuery({
        queryKey: loyaltyPointsKeys.list({ page, limit, clientId, type }),
        queryFn: async (): Promise<PaginatedResponse<MouvementPoints>> => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (clientId) {
                searchParams.set("clientId", clientId);
            }
            if (type) {
                searchParams.set("type", type);
            }

            return api.get<PaginatedResponse<MouvementPoints>>(
                `/api/loyalty-points?${searchParams.toString()}`
            );
        },
    });
}

// Hook pour récupérer les statistiques de points
export function useLoyaltyPointsStats(clientId?: string) {
    return useQuery({
        queryKey: loyaltyPointsKeys.stats(clientId),
        queryFn: async (): Promise<PointsStats> => {
            const searchParams = new URLSearchParams();
            if (clientId) {
                searchParams.set("clientId", clientId);
            }

            return api.get<PointsStats>(
                `/api/loyalty-points/stats?${searchParams.toString()}`
            );
        },
    });
}

// Hook pour créer un mouvement de points (ajustement manuel)
export function useCreatePointsMovement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: MouvementPointsCreateInput) =>
            api.post<MouvementPoints>("/api/loyalty-points", data),
        onSuccess: (_, variables) => {
            // Invalide le cache des mouvements et des stats
            queryClient.invalidateQueries({ queryKey: loyaltyPointsKeys.all });
            queryClient.invalidateQueries({ queryKey: ["loyaltyPoints", "list"] });
            queryClient.invalidateQueries({
                queryKey: loyaltyPointsKeys.stats(variables.clientId)
            });
            queryClient.invalidateQueries({
                queryKey: loyaltyPointsKeys.stats()
            });
            // Invalide aussi le cache du client car son solde a changé
            queryClient.invalidateQueries({
                queryKey: ["clients", variables.clientId]
            });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

// Hook pour expirer les points
export function useExpirePoints() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () =>
            api.post<{ message: string; expired: number; totalPoints: number }>(
                "/api/loyalty-points/expire",
                {}
            ),
        onSuccess: () => {
            // Invalide tous les caches liés aux points et clients
            queryClient.invalidateQueries({ queryKey: loyaltyPointsKeys.all });
            queryClient.invalidateQueries({ queryKey: ["loyaltyPoints", "list"] });
            queryClient.invalidateQueries({ queryKey: ["loyaltyPoints", "stats"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

import { useLoyaltyPoints, useLoyaltyPointsStats } from "./use-loyalty-points";
import { api } from "@/lib/api/fetch-client";
import { useQuery } from "@tanstack/react-query";

interface NextLevelInfo {
    nextLevel: {
        id: string;
        nom: string;
        seuilPoints: number;
        remise: number;
        couleur: string;
    };
    pointsNeeded: number;
    currentPoints: number;
    progress: number;
}

/**
 * Hook for managing client loyalty dashboard
 * Fetches points history, stats, and next level information
 */
export function useClientLoyalty(clientId: string) {
    // Fetch points movements history (paginated, first 10)
    const {
        data: mouvementsData,
        isLoading: isLoadingMovements,
    } = useLoyaltyPoints({
        clientId,
        limit: 10,
    });

    // Fetch client-specific loyalty stats
    const {
        data: stats,
        isLoading: isLoadingStats,
    } = useLoyaltyPointsStats(clientId);

    // Fetch next level information
    const {
        data: nextLevelData,
        isLoading: isLoadingNextLevel,
    } = useQuery<NextLevelInfo | null>({
        queryKey: ["clientNextLevel", clientId],
        queryFn: async () => {
            try {
                return await api.get<NextLevelInfo>(`/api/clients/${clientId}/next-level`);
            } catch (error) {
                // If endpoint doesn't exist or returns 404, return null
                return null;
            }
        },
        enabled: !!clientId,
    });

    const isLoading = isLoadingMovements || isLoadingStats || isLoadingNextLevel;

    return {
        mouvements: mouvementsData?.data || [],
        stats,
        nextLevel: nextLevelData,
        isLoading,
        currentLevel: stats?.client?.niveauFidelite || null,
        currentPoints: stats?.client?.points_solde || 0,
        pointsExpiringSoon: stats?.pointsExpiringSoon || 0,
    };
}

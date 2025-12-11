"use client";

import type { EnhancedDashboardStats } from "@/lib/types/dashboard";
import {
    DocumentsKpiCard,
    ExpiringPointsCard,
    LoyaltyLevelCard,
    PointsBalanceCard,
} from "./kpi";

export interface EnhancedStatsGridProps {
    stats: EnhancedDashboardStats | null;
    className?: string;
}

/**
 * Enhanced grid of KPI cards with micro-visualizations
 * Displays points, loyalty level, documents count, and expiring points
 */
export function EnhancedStatsGrid({
    stats,
    className,
}: EnhancedStatsGridProps) {
    return (
        <div className={className}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <PointsBalanceCard
                    points={stats?.client.points_solde || 0}
                    trendData={stats?.pointsHistory}
                />

                <LoyaltyLevelCard
                    levelName={stats?.client.niveauFidelite?.nom || null}
                    levelColor={stats?.client.niveauFidelite?.couleur}
                    progressToNext={stats?.progressToNextLevel || 0}
                />

                <DocumentsKpiCard
                    count={stats?.documentsCount || 0}
                    recentCount={stats?.recentDocumentsCount}
                />

                <ExpiringPointsCard
                    points={stats?.pointsExpiringSoon || 0}
                    daysUntilExpiry={stats?.daysUntilNextExpiry}
                />
            </div>
        </div>
    );
}

"use client";

import {
    ClientLoyaltyHistory,
    ClientLoyaltyOverview,
    ClientLoyaltyProgress,
} from "@/components/client-loyalty";
import { ClientTabSkeleton } from "@/components/ui/client-tab-skeleton";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useClientLoyalty } from "@/hooks/use-client-loyalty";

export default function ClientFidelitePage() {
    const { data, isLoading } = useClientLoyalty();

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            fallback={<ClientTabSkeleton variant="loyalty" />}
        >
            {!data ? (
                <EmptyState
                    title="Impossible de charger vos informations de fidélité"
                    variant="inline"
                />
            ) : (
                <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Programme de fidélité"
                description="Gagnez des points et profitez d'avantages exclusifs"
            />

            {/* Overview Cards */}
            <ClientLoyaltyOverview
                points={data.client.points_solde}
                niveau={data.client.niveauFidelite || null}
                pointsExpiringSoon={data.pointsExpiringSoon}
            />

            {/* Progress to Next Level */}
            <ClientLoyaltyProgress
                currentLevel={data.client.niveauFidelite || null}
                nextLevel={data.nextLevel}
                points={data.client.points_solde}
            />

            {/* Points History */}
            <ClientLoyaltyHistory
                mouvements={data.mouvements}
                isLoading={isLoading}
            />
                </div>
            )}
        </ConditionalSkeleton>
    );
}

"use client";

import {
    LoyaltyInfoCard,
    ProfileCompletionBanner,
    QuickActionsCard,
    StatsGrid,
} from "@/components/client/dashboard";
import { FirstTimeGuide } from "@/components/client/first-time-guide";
import { ClientTabSkeleton } from "@/components/ui/client-tab-skeleton";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { useClientDashboardStats } from "@/hooks/use-client-dashboard-stats";
import { useProfileCompletionBanner } from "@/hooks/use-profile-completion-banner";
import { getClientDisplayName } from "@/lib/utils/client-helpers";

export default function ClientDashboardPage() {
    const { stats, isLoading } = useClientDashboardStats();
    const { showBanner, dismissBanner } = useProfileCompletionBanner(
        stats?.client
    );

    const userName = getClientDisplayName(stats?.client);

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            fallback={<ClientTabSkeleton variant="dashboard" />}
        >
            <>
                <FirstTimeGuide userName={userName} />

                <div className="space-y-6">
                    {showBanner && (
                        <ProfileCompletionBanner onDismiss={dismissBanner} />
                    )}

                    <PageHeader
                        title={`Bienvenue, ${userName} !`}
                        description="Voici un aperçu de votre espace client"
                    />

                    <StatsGrid stats={stats} />

                    <QuickActionsCard />

                    {stats?.client.niveauFidelite && (
                        <LoyaltyInfoCard
                            loyaltyLevel={stats.client.niveauFidelite}
                        />
                    )}
                </div>
            </>
        </ConditionalSkeleton>
    );
}

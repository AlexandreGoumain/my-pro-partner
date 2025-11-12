"use client";

import {
    DashboardLoadingSkeleton,
    LoyaltyInfoCard,
    ProfileCompletionBanner,
    QuickActionsCard,
    StatsGrid,
} from "@/components/client/dashboard";
import { FirstTimeGuide } from "@/components/client/first-time-guide";
import { PageHeader } from "@/components/ui/page-header";
import { useClientDashboardStats } from "@/hooks/use-client-dashboard-stats";
import { useProfileCompletionBanner } from "@/hooks/use-profile-completion-banner";
import { getClientDisplayName } from "@/lib/utils/client-helpers";

export default function ClientDashboardPage() {
    const { stats, isLoading } = useClientDashboardStats();
    const { showBanner, dismissBanner } = useProfileCompletionBanner(
        stats?.client
    );

    if (isLoading) {
        return <DashboardLoadingSkeleton />;
    }

    const userName = getClientDisplayName(stats?.client);

    return (
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
    );
}

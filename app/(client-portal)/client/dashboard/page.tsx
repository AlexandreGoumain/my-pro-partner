"use client";

import { useMemo } from "react";
import {
    LoyaltyInfoCard,
    ProfileCompletionBanner,
    QuickActionsCard,
    StatsGrid,
} from "@/components/client/dashboard";
import {
    UpcomingRdvWidget,
    InterventionStatusWidget,
} from "@/components/client/dashboard/widgets";
import { FirstTimeGuide } from "@/components/client/first-time-guide";
import { ClientTabSkeleton } from "@/components/ui/client-tab-skeleton";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { useClientDashboardStats } from "@/hooks/use-client-dashboard-stats";
import { useProfileCompletionBanner } from "@/hooks/use-profile-completion-banner";
import { getClientDisplayName } from "@/lib/utils/client-helpers";
import type { Capability } from "@/lib/types/capability";

function hasCapability(capabilities: Capability[], cap: Capability): boolean {
    return capabilities.includes(cap);
}

function hasAnyCapability(capabilities: Capability[], caps: Capability[]): boolean {
    return caps.some((cap) => capabilities.includes(cap));
}

export default function ClientDashboardPage() {
    const { stats, isLoading } = useClientDashboardStats();
    const { showBanner, dismissBanner } = useProfileCompletionBanner(
        stats?.client
    );

    const userName = getClientDisplayName(stats?.client);
    const capabilities = stats?.capabilities ?? [];

    // Compute which widgets to show based on capabilities
    const showRdvWidget = useMemo(
        () => hasCapability(capabilities, "agenda"),
        [capabilities]
    );
    const showInterventionsWidget = useMemo(
        () => hasAnyCapability(capabilities, ["domicile", "atelier"]),
        [capabilities]
    );

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

                    {/* Capability-based widgets */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {showRdvWidget && (
                            <UpcomingRdvWidget
                                rdvList={stats?.upcomingRdv ?? []}
                            />
                        )}
                        {showInterventionsWidget && (
                            <InterventionStatusWidget
                                interventions={stats?.activeInterventions ?? []}
                            />
                        )}
                    </div>

                    <QuickActionsCard capabilities={capabilities} />

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

"use client";

import {
    EnhancedStatsGrid,
    LoyaltyProgressWidget,
    ProfileCompletionBanner,
    QuickActionsWidget,
    WelcomeHero,
} from "@/components/client/dashboard";
import {
    ActivityTimelineWidget,
    InterventionStatusWidget,
    UpcomingRdvWidget,
} from "@/components/client/dashboard/widgets";
import { FirstTimeGuide } from "@/components/client/first-time-guide";
import { ClientTabSkeleton } from "@/components/ui/client-tab-skeleton";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { useClientDashboardStats } from "@/hooks/use-client-dashboard-stats";
import { useProfileCompletionBanner } from "@/hooks/use-profile-completion-banner";
import type { Capability } from "@/lib/types/capability";
import type { EnhancedDashboardStats } from "@/lib/types/dashboard";
import { getClientDisplayName } from "@/lib/utils/client-helpers";
import { useMemo } from "react";

function hasCapability(capabilities: Capability[], cap: Capability): boolean {
    return capabilities.includes(cap);
}

function hasAnyCapability(
    capabilities: Capability[],
    caps: Capability[]
): boolean {
    return caps.some((cap) => capabilities.includes(cap));
}

export default function ClientDashboardPage() {
    const { stats, isLoading } = useClientDashboardStats();
    const { showBanner, dismissBanner } = useProfileCompletionBanner(
        stats?.client
    );

    const userName = getClientDisplayName(stats?.client);
    const capabilities = stats?.capabilities ?? [];

    // Cast stats to enhanced type
    const enhancedStats = stats as EnhancedDashboardStats | null;

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
                    {/* Profile completion banner */}
                    {showBanner && (
                        <ProfileCompletionBanner onDismiss={dismissBanner} />
                    )}

                    {/* Welcome hero with personalized greeting */}
                    <WelcomeHero
                        userName={userName}
                        lastUpdated={
                            enhancedStats?.lastUpdated
                                ? new Date(enhancedStats.lastUpdated as string)
                                : undefined
                        }
                    />

                    {/* Enhanced KPI cards with micro-visualizations */}
                    <EnhancedStatsGrid stats={enhancedStats} />

                    {/* Main content grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left column - Capability widgets + Activity */}
                        <div className="space-y-6">
                            {/* Capability-based widgets */}
                            {showRdvWidget && (
                                <UpcomingRdvWidget
                                    rdvList={enhancedStats?.upcomingRdv ?? []}
                                />
                            )}
                            {showInterventionsWidget && (
                                <InterventionStatusWidget
                                    interventions={
                                        enhancedStats?.activeInterventions ?? []
                                    }
                                />
                            )}

                            {/* Activity timeline */}
                            <ActivityTimelineWidget
                                activities={
                                    enhancedStats?.recentActivities ?? []
                                }
                            />
                        </div>

                        {/* Right column - Loyalty + Quick actions */}
                        <div className="space-y-6">
                            {/* Loyalty progress widget */}
                            <LoyaltyProgressWidget
                                currentLevel={
                                    enhancedStats?.client.niveauFidelite
                                        ? {
                                              nom: enhancedStats.client
                                                  .niveauFidelite.nom,
                                              couleur:
                                                  enhancedStats.client
                                                      .niveauFidelite.couleur,
                                              seuilPoints: 0,
                                          }
                                        : null
                                }
                                nextLevel={enhancedStats?.nextLevel || null}
                                currentPoints={
                                    enhancedStats?.client.points_solde || 0
                                }
                            />

                            {/* Quick actions grid */}
                            <QuickActionsWidget capabilities={capabilities} />
                        </div>
                    </div>
                </div>
            </>
        </ConditionalSkeleton>
    );
}

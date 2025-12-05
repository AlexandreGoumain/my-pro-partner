"use client";

import { useState } from "react";
import { ActivityTimelineCard } from "@/components/dashboard/activity-timeline-card";
import { BusinessHealthScore } from "@/components/dashboard/business-health-score";
import { ConsultingDashboardSection } from "@/components/dashboard/consulting-dashboard-section";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DocumentPipelineCard } from "@/components/dashboard/document-pipeline-card";
import { GoalProgressCard } from "@/components/dashboard/goal-progress-card";
import { GoalEditDialog } from "@/components/dashboard/goals";
import { ImmobilierDashboardSection } from "@/components/dashboard/immobilier";
import { MetricComparisonCard } from "@/components/dashboard/metric-comparison-card";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RevenueOverviewCard } from "@/components/dashboard/revenue-overview-card";
import { SalesFunnelCard } from "@/components/dashboard/sales-funnel-card";
import { SmartInsightsCard } from "@/components/dashboard/smart-insights-card";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { TopPerformersCard } from "@/components/dashboard/top-performers-card";
import { Button } from "@/components/ui/button";
import { useDashboardPage } from "@/hooks/use-dashboard-page";
import { useEnabledGoals } from "@/hooks/use-goals";
import { CreditCard, FileText, Package, Users } from "lucide-react";

export default function Dashboard() {
    const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false);

    const {
        selectedPeriod,
        handlePeriodChange,
        isServiceIntellectuel,
        isImmobilier,
        greeting,
        userName,
        dateLabel,
        todayTasks,
        quickActions,
        data,
        isLoading,
        error,
        handleRefresh,
    } = useDashboardPage();

    // Fetch user's configured goals
    const { data: userGoals = [] } = useEnabledGoals();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <DashboardHeader
                    greeting={greeting}
                    userName={userName}
                    dateLabel={dateLabel}
                />

                <div className="flex items-center gap-3">
                    <PeriodSelector
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={handlePeriodChange}
                    />
                </div>
            </div>

            {/* Consulting Section - For SERVICE_INTELLECTUEL businesses */}
            {isServiceIntellectuel && (
                <ConsultingDashboardSection period={selectedPeriod} />
            )}

            {/* Immobilier Section - For IMMOBILIER businesses */}
            {isImmobilier && (
                <ImmobilierDashboardSection period={selectedPeriod} />
            )}

            {/* Loading State */}
            {isLoading && !data && <DashboardSkeleton />}

            {/* Error State */}
            {error && (
                <div className="p-6 rounded-lg bg-white border border-black/10 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/5">
                            <span className="text-[20px]">⚠️</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-black/80 mb-1">
                                Erreur lors du chargement des données
                            </p>
                            <p className="text-[13px] text-black/50">
                                {error.message}
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                className="mt-3 h-9 px-4 border-black/10 hover:bg-black/5 text-[13px]"
                            >
                                Réessayer
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard Content */}
            {data && (
                <>
                    {/* ===== SECTION 1: HERO ===== */}
                    <div className="grid gap-5 lg:grid-cols-3">
                        <BusinessHealthScore health={data.health} />
                        <RevenueOverviewCard revenue={data.revenue} />
                        <GoalProgressCard
                            goals={userGoals}
                            onConfigureClick={() => setIsGoalsDialogOpen(true)}
                        />
                    </div>

                    {/* ===== SECTION 2: KPIs GRID ===== */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricComparisonCard
                            title="Nouveaux Clients"
                            description="Ce mois"
                            value={data.clients.new}
                            comparison={data.clients.newComparison}
                            icon={Users}
                            isEmpty={data.isEmpty}
                        />

                        <MetricComparisonCard
                            title="Taux de Conversion"
                            description="Devis → Factures"
                            value={`${data.sales.conversionRate}%`}
                            comparison={data.sales.conversionRateComparison}
                            icon={FileText}
                            isEmpty={data.isEmpty}
                        />

                        <MetricComparisonCard
                            title="Panier Moyen"
                            description="Par transaction"
                            value={`${data.sales.averageTicket.toFixed(0)}€`}
                            comparison={data.sales.averageTicketComparison}
                            icon={CreditCard}
                            isEmpty={data.isEmpty}
                        />

                        <MetricComparisonCard
                            title="Stock Total"
                            description="Articles actifs"
                            value={data.stock.totalArticles}
                            comparison={data.stock.totalArticlesComparison}
                            icon={Package}
                            isEmpty={data.isEmpty}
                        />
                    </div>

                    {/* ===== SECTION 3: ANALYTICS ===== */}
                    <div className="grid gap-5 lg:grid-cols-2">
                        <SalesFunnelCard sales={data.sales} />
                        <DocumentPipelineCard pipeline={data.pipeline} />
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                        <TopPerformersCard topPerformers={data.topPerformers} />
                        <SmartInsightsCard insights={data.insights} />
                    </div>

                    {/* ===== SECTION 4: TASKS & ACTIONS ===== */}
                    <div className="grid gap-5 lg:grid-cols-2">
                        <TodayTasksCard tasks={todayTasks} />
                        <QuickActionsCard actions={quickActions} />
                    </div>

                    {/* ===== SECTION 5: ACTIVITY ===== */}
                    <ActivityTimelineCard activities={data.activities} />
                </>
            )}

            {/* Goals Configuration Dialog */}
            <GoalEditDialog
                open={isGoalsDialogOpen}
                onOpenChange={setIsGoalsDialogOpen}
            />
        </div>
    );
}

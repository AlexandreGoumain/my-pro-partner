"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { RecentClientsCard } from "@/components/dashboard/recent-clients-card";
import { StatsNavigationTabs } from "@/components/dashboard/stats-navigation-tabs";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { StatCard } from "@/components/ui/stat-card";
import { TrendBadge } from "@/components/ui/trend-badge";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { FileText, Package, TrendingUp, Users } from "lucide-react";

export default function Dashboard() {
    const {
        greeting,
        userName,
        dateLabel,
        notificationCount,
        stats,
        todayTasks,
        quickActions,
        recentClients,
        recentActivity,
        navigateToClients,
        navigateToArticles,
        navigateToClientsStatistics,
        navigateToArticlesStock,
    } = useDashboardData();

    return (
        <div className="space-y-6">
            {/* Header avec message personnalisé */}
            <DashboardHeader
                greeting={greeting}
                userName={userName}
                dateLabel={dateLabel}
                notificationCount={notificationCount}
            />

            {/* Layout principal en colonnes */}
            <div className="grid gap-5 lg:grid-cols-3">
                {/* Colonne Gauche - Activité du jour */}
                <div className="lg:col-span-1 space-y-5">
                    <TodayTasksCard tasks={todayTasks} />
                    <QuickActionsCard actions={quickActions} />
                </div>

                {/* Colonne Centrale - KPIs */}
                <div className="lg:col-span-1 space-y-5">
                    <StatCard
                        icon={Users}
                        label="Clients"
                        value={stats.clients.total}
                        description={`+${stats.clients.new} ce mois`}
                        badge={{
                            text: <TrendBadge trend={stats.clients.trend} />,
                        }}
                        isClickable
                        onClick={navigateToClients}
                    />

                    <StatCard
                        icon={Package}
                        label="Articles"
                        value={stats.articles.total}
                        description={`+${stats.articles.new} ce mois`}
                        badge={{
                            text: <TrendBadge trend={stats.articles.trend} />,
                        }}
                        isClickable
                        onClick={navigateToArticles}
                    />

                    <StatCard
                        icon={FileText}
                        label="Documents"
                        value={0}
                        description="À venir"
                    />

                    <StatCard
                        icon={TrendingUp}
                        label="Chiffre d'affaires"
                        value="0€"
                        description="Ce mois"
                    />
                </div>

                {/* Colonne Droite - Activité récente */}
                <div className="lg:col-span-1 space-y-5">
                    <RecentClientsCard
                        clients={recentClients}
                        onViewAll={navigateToClients}
                    />
                    <RecentActivityCard activities={recentActivity} />
                </div>
            </div>

            {/* Statistiques détaillées */}
            <StatsNavigationTabs
                onNavigateToClients={navigateToClientsStatistics}
                onNavigateToStock={navigateToArticlesStock}
            />
        </div>
    );
}

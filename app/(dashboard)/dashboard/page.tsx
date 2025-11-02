"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { RecentClientsCard } from "@/components/dashboard/recent-clients-card";
import { StatsNavigationTabs } from "@/components/dashboard/stats-navigation-tabs";
import { TodayTasksCard } from "@/components/dashboard/today-tasks-card";
import { StatCard } from "@/components/ui/stat-card";
import { useArticles } from "@/hooks/use-articles";
import { useClients } from "@/hooks/use-clients";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import {
    getClientFullName,
    getClientInitials,
} from "@/lib/utils/client-formatting";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import {
    FileText,
    Package,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

// Constants
const MAX_RECENT_CLIENTS = 5;
const MAX_RECENT_ACTIVITIES = 10;

export default function Dashboard() {
    const router = useRouter();
    const { data: session } = useSession();
    const { data: clients = [] } = useClients();
    const { data: articles = [] } = useArticles();

    // Message de bienvenue personnalisé
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bonjour";
        if (hour < 18) return "Bon après-midi";
        return "Bonsoir";
    }, []);

    // Statistiques avec tendances
    const stats = useDashboardStats(clients, articles);

    // Tâches et rappels du jour (simulé pour l'instant)
    const todayTasks = useMemo(() => {
        const tasks: Array<{
            id: string;
            title: string;
            time?: string;
            priority: "urgent" | "high" | "medium" | "low";
            onClick?: () => void;
        }> = [];

        // Rappels clients inactifs
        if (stats.clients.inactive > 0) {
            tasks.push({
                id: "1",
                priority: "high" as const,
                title: `Relancer ${stats.clients.inactive} clients inactifs`,
                time: "10:00",
                onClick: () => router.push("/dashboard/clients/segments"),
            });
        }

        // Alertes stock
        if (stats.articles.rupture > 0) {
            tasks.push({
                id: "2",
                priority: "urgent" as const,
                title: `${stats.articles.rupture} articles en rupture de stock`,
                onClick: () => router.push("/dashboard/articles/stock"),
            });
        }

        if (stats.articles.stockFaible > 0) {
            tasks.push({
                id: "3",
                priority: "medium" as const,
                title: `${stats.articles.stockFaible} articles à réapprovisionner`,
                onClick: () => router.push("/dashboard/articles/stock"),
            });
        }

        return tasks;
    }, [stats, router]);

    // Derniers clients
    const recentClients = useMemo(() => {
        return [...clients]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
            .slice(0, MAX_RECENT_CLIENTS);
    }, [clients]);

    // Activité récente (simulé)
    const recentActivity = useMemo(() => {
        const activities: Array<{
            icon: typeof Users | typeof Package;
            title: string;
            description: string;
            timeLabel: string;
        }> = [];

        // Nouveaux clients
        recentClients.slice(0, 3).forEach((client) => {
            const createdDate = new Date(client.createdAt);
            activities.push({
                icon: Users,
                title: "Nouveau client",
                description: getClientFullName(client.nom, client.prenom),
                timeLabel: isToday(createdDate)
                    ? `Aujourd'hui à ${format(createdDate, "HH:mm", {
                          locale: fr,
                      })}`
                    : format(createdDate, "d MMM à HH:mm", { locale: fr }),
            });
        });

        return activities.slice(0, MAX_RECENT_ACTIVITIES);
    }, [recentClients]);

    // Clients pour la card
    const recentClientsForCard = useMemo(() => {
        return recentClients.map((client) => {
            const createdDate = new Date(client.createdAt);
            return {
                initials: getClientInitials(client.nom, client.prenom),
                fullName: getClientFullName(client.nom, client.prenom),
                timeLabel: format(
                    createdDate,
                    isToday(createdDate) ? "HH:mm" : "d MMM",
                    { locale: fr }
                ),
                onClick: () => router.push(`/dashboard/clients/${client.id}`),
            };
        });
    }, [recentClients, router]);

    // Quick actions
    const quickActions = useMemo(
        () => [
            {
                label: "Nouveau client",
                onClick: () => router.push("/dashboard/clients"),
            },
            {
                label: "Nouvel article",
                onClick: () => router.push("/dashboard/articles"),
            },
            {
                label: "Nouveau devis",
                onClick: () => {},
            },
        ],
        [router]
    );

    return (
        <div className="space-y-6">
            {/* Header avec message personnalisé */}
            <DashboardHeader
                greeting={greeting}
                userName={session?.user?.name || undefined}
                dateLabel={format(new Date(), "EEEE d MMMM yyyy", {
                    locale: fr,
                })}
                notificationCount={todayTasks.length}
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
                            text: (
                                <>
                                    {stats.clients.trend >= 0 ? (
                                        <TrendingUp
                                            className="h-3 w-3 mr-1 inline"
                                            strokeWidth={2}
                                        />
                                    ) : (
                                        <TrendingDown
                                            className="h-3 w-3 mr-1 inline"
                                            strokeWidth={2}
                                        />
                                    )}
                                    {Math.abs(stats.clients.trend).toFixed(0)}%
                                </>
                            ),
                        }}
                        isClickable
                        onClick={() => router.push("/dashboard/clients")}
                    />

                    <StatCard
                        icon={Package}
                        label="Articles"
                        value={stats.articles.total}
                        description={`+${stats.articles.new} ce mois`}
                        badge={{
                            text: (
                                <>
                                    {stats.articles.trend >= 0 ? (
                                        <TrendingUp
                                            className="h-3 w-3 mr-1 inline"
                                            strokeWidth={2}
                                        />
                                    ) : (
                                        <TrendingDown
                                            className="h-3 w-3 mr-1 inline"
                                            strokeWidth={2}
                                        />
                                    )}
                                    {Math.abs(stats.articles.trend).toFixed(0)}%
                                </>
                            ),
                        }}
                        isClickable
                        onClick={() => router.push("/dashboard/articles")}
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
                        clients={recentClientsForCard}
                        onViewAll={() => router.push("/dashboard/clients")}
                    />
                    <RecentActivityCard activities={recentActivity} />
                </div>
            </div>

            {/* Statistiques détaillées */}
            <StatsNavigationTabs
                onNavigateToClients={() =>
                    router.push("/dashboard/clients/statistiques")
                }
                onNavigateToStock={() =>
                    router.push("/dashboard/articles/stock")
                }
            />
        </div>
    );
}

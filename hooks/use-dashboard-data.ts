import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useClients } from "@/hooks/use-clients";
import { useArticles } from "@/hooks/use-articles";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import {
    getClientFullName,
    getClientInitials,
} from "@/lib/utils/client-formatting";
import type { TaskItemProps } from "@/components/dashboard/task-item";
import type { QuickActionButtonProps } from "@/components/dashboard/quick-action-button";
import type { ClientListItemProps } from "@/components/dashboard/client-list-item";
import type { ActivityItemProps } from "@/components/dashboard/activity-item";

// Constants
const MAX_RECENT_CLIENTS = 5;
const MAX_RECENT_ACTIVITIES = 10;

interface UseDashboardDataReturn {
    // User data
    greeting: string;
    userName: string | undefined;
    dateLabel: string;
    notificationCount: number;

    // Stats
    stats: ReturnType<typeof useDashboardStats>;

    // Tasks
    todayTasks: TaskItemProps[];

    // Quick actions
    quickActions: QuickActionButtonProps[];

    // Recent clients
    recentClients: ClientListItemProps[];

    // Recent activity
    recentActivity: ActivityItemProps[];

    // Navigation
    navigateToClients: () => void;
    navigateToArticles: () => void;
    navigateToClientsSegments: () => void;
    navigateToArticlesStock: () => void;
    navigateToClientsStatistics: () => void;
}

export function useDashboardData(): UseDashboardDataReturn {
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

    // Date label
    const dateLabel = useMemo(
        () => format(new Date(), "EEEE d MMMM yyyy", { locale: fr }),
        []
    );

    // Statistiques avec tendances
    const stats = useDashboardStats(clients, articles);

    // Tâches et rappels du jour
    const todayTasks = useMemo((): TaskItemProps[] => {
        const tasks: TaskItemProps[] = [];

        // Rappels clients inactifs
        if (stats.clients.inactive > 0) {
            tasks.push({
                id: "inactive-clients",
                priority: "high",
                title: `Relancer ${stats.clients.inactive} clients inactifs`,
                time: "10:00",
                onClick: () => router.push("/dashboard/clients/segments"),
            });
        }

        // Alertes stock
        if (stats.articles.rupture > 0) {
            tasks.push({
                id: "out-of-stock",
                priority: "urgent",
                title: `${stats.articles.rupture} articles en rupture de stock`,
                onClick: () => router.push("/dashboard/articles/stock"),
            });
        }

        if (stats.articles.stockFaible > 0) {
            tasks.push({
                id: "low-stock",
                priority: "medium",
                title: `${stats.articles.stockFaible} articles à réapprovisionner`,
                onClick: () => router.push("/dashboard/articles/stock"),
            });
        }

        return tasks;
    }, [stats, router]);

    // Derniers clients
    const sortedRecentClients = useMemo(() => {
        return [...clients]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
            .slice(0, MAX_RECENT_CLIENTS);
    }, [clients]);

    // Clients pour la card
    const recentClients = useMemo((): ClientListItemProps[] => {
        return sortedRecentClients.map((client) => {
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
    }, [sortedRecentClients, router]);

    // Activité récente
    const recentActivity = useMemo((): ActivityItemProps[] => {
        const activities: ActivityItemProps[] = [];

        // Nouveaux clients
        sortedRecentClients.slice(0, 3).forEach((client) => {
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
    }, [sortedRecentClients]);

    // Quick actions
    const quickActions = useMemo(
        (): QuickActionButtonProps[] => [
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

    // Navigation helpers
    const navigateToClients = () => router.push("/dashboard/clients");
    const navigateToArticles = () => router.push("/dashboard/articles");
    const navigateToClientsSegments = () =>
        router.push("/dashboard/clients/segments");
    const navigateToArticlesStock = () =>
        router.push("/dashboard/articles/stock");
    const navigateToClientsStatistics = () =>
        router.push("/dashboard/clients/statistiques");

    return {
        greeting,
        userName: session?.user?.name || undefined,
        dateLabel,
        notificationCount: todayTasks.length,
        stats,
        todayTasks,
        quickActions,
        recentClients,
        recentActivity,
        navigateToClients,
        navigateToArticles,
        navigateToClientsSegments,
        navigateToArticlesStock,
        navigateToClientsStatistics,
    };
}

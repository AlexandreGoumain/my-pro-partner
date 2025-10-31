"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    ArrowUpRight,
    FileText,
    Package,
    Plus,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    AlertCircle,
    CheckCircle2,
    Bell,
    Calendar,
    ArrowRight,
} from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { useArticles } from "@/hooks/use-articles";
import { useMemo } from "react";
import { differenceInDays, format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Constants
const DAYS_IN_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30;
const SIXTY_DAYS = 60;
const NINETY_DAYS = 90;
const LOW_STOCK_THRESHOLD = 10;
const MAX_RECENT_CLIENTS = 5;
const MAX_RECENT_ACTIVITIES = 10;

// Helper functions
const getDateDaysAgo = (days: number) => new Date(Date.now() - days * DAYS_IN_MS);

const calculateTrend = (current: number, previous: number): number => {
    if (previous > 0) return ((current - previous) / previous) * 100;
    return current > 0 ? 100 : 0;
};

const getClientFullName = (nom: string, prenom?: string | null) =>
    prenom ? `${nom} ${prenom}` : nom;

const getClientInitials = (nom: string, prenom?: string | null) =>
    prenom ? `${nom.charAt(0)}${prenom.charAt(0)}` : nom.substring(0, 2);

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
    const stats = useMemo(() => {
        const now = new Date();
        const thirtyDaysAgo = getDateDaysAgo(THIRTY_DAYS);
        const sixtyDaysAgo = getDateDaysAgo(SIXTY_DAYS);

        // Clients
        const currentMonthClients = clients.filter(
            (c) => new Date(c.createdAt) >= thirtyDaysAgo
        ).length;
        const lastMonthClients = clients.filter((c) => {
            const date = new Date(c.createdAt);
            return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        }).length;
        const clientTrend = calculateTrend(currentMonthClients, lastMonthClients);

        // Articles
        const currentMonthArticles = articles.filter(
            (a) => new Date(a.createdAt) >= thirtyDaysAgo
        ).length;
        const lastMonthArticles = articles.filter((a) => {
            const date = new Date(a.createdAt);
            return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        }).length;
        const articleTrend = calculateTrend(currentMonthArticles, lastMonthArticles);

        // Clients inactifs
        const inactive = clients.filter(
            (c) => differenceInDays(now, new Date(c.updatedAt)) > NINETY_DAYS
        ).length;

        // Stock
        const stockFaible = articles.filter(
            (a) => a.stock > 0 && a.stock <= LOW_STOCK_THRESHOLD
        ).length;
        const rupture = articles.filter((a) => a.stock === 0).length;

        return {
            clients: {
                total: clients.length,
                new: currentMonthClients,
                trend: clientTrend,
                inactive,
            },
            articles: {
                total: articles.length,
                new: currentMonthArticles,
                trend: articleTrend,
                stockFaible,
                rupture,
            },
        };
    }, [clients, articles]);

    // Tâches et rappels du jour (simulé pour l'instant)
    const todayTasks = useMemo(() => {
        const tasks = [];

        // Rappels clients inactifs
        if (stats.clients.inactive > 0) {
            tasks.push({
                id: "1",
                type: "reminder",
                priority: "high",
                title: `Relancer ${stats.clients.inactive} clients inactifs`,
                time: "10:00",
                action: () => router.push("/dashboard/clients/segments"),
            });
        }

        // Alertes stock
        if (stats.articles.rupture > 0) {
            tasks.push({
                id: "2",
                type: "alert",
                priority: "urgent",
                title: `${stats.articles.rupture} articles en rupture de stock`,
                action: () => router.push("/dashboard/articles/stock"),
            });
        }

        if (stats.articles.stockFaible > 0) {
            tasks.push({
                id: "3",
                type: "warning",
                priority: "medium",
                title: `${stats.articles.stockFaible} articles à réapprovisionner`,
                action: () => router.push("/dashboard/articles/stock"),
            });
        }

        return tasks;
    }, [stats, router]);

    // Derniers clients
    const recentClients = useMemo(() => {
        return [...clients]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, MAX_RECENT_CLIENTS);
    }, [clients]);

    // Activité récente (simulé)
    const recentActivity = useMemo(() => {
        const activities: Array<{
            id: string;
            type: string;
            icon: typeof Users | typeof Package;
            title: string;
            description: string;
            time: string;
            date: Date;
        }> = [];

        // Nouveaux clients
        recentClients.slice(0, 3).forEach((client) => {
            activities.push({
                id: client.id,
                type: "client",
                icon: Users,
                title: "Nouveau client",
                description: getClientFullName(client.nom, client.prenom),
                time: format(new Date(client.createdAt), "HH:mm", { locale: fr }),
                date: new Date(client.createdAt),
            });
        });

        // Nouveaux articles - Commenté car createdAt manque dans ArticleDisplay
        // [...articles]
        //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        //     .slice(0, 2)
        //     .forEach((article) => {
        //         activities.push({
        //             id: article.id,
        //             type: "article",
        //             icon: Package,
        //             title: "Nouvel article",
        //             description: article.nom,
        //             time: format(new Date(article.createdAt), "HH:mm", { locale: fr }),
        //             date: new Date(article.createdAt),
        //         });
        //     });

        return activities
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, MAX_RECENT_ACTIVITIES);
    }, [recentClients]);

    return (
        <div className="space-y-6">
            {/* Header avec message personnalisé */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {greeting} {session?.user?.name || ""}
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative h-10 w-10 border-black/10 hover:bg-black/5"
                >
                    <Bell className="h-5 w-5 text-black/60" strokeWidth={2} />
                    {todayTasks.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-[11px] font-medium flex items-center justify-center">
                            {todayTasks.length}
                        </span>
                    )}
                </Button>
            </div>

            {/* Layout principal en colonnes */}
            <div className="grid gap-5 lg:grid-cols-3">
                {/* Colonne Gauche - Activité du jour */}
                <div className="lg:col-span-1 space-y-5">
                    {/* Aujourd'hui */}
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-black/5 flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-black/60" strokeWidth={2} />
                                    </div>
                                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                        Aujourd'hui
                                    </h3>
                                </div>
                                {todayTasks.length > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-black/5 text-black/60 border-0 text-[12px] h-5 px-2"
                                    >
                                        {todayTasks.length}
                                    </Badge>
                                )}
                            </div>

                            {todayTasks.length > 0 ? (
                                <div className="space-y-2.5">
                                    {todayTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-3.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                task.priority === "urgent"
                                                    ? "border-black/20 bg-black/5 hover:bg-black/8"
                                                    : task.priority === "high"
                                                    ? "border-black/15 bg-black/[0.03] hover:bg-black/5"
                                                    : "border-black/8 hover:bg-black/5"
                                            }`}
                                            onClick={task.action}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5">
                                                    {task.priority === "urgent" ? (
                                                        <AlertCircle className="h-4 w-4 text-black/80" strokeWidth={2} />
                                                    ) : task.priority === "high" ? (
                                                        <Bell className="h-4 w-4 text-black/60" strokeWidth={2} />
                                                    ) : (
                                                        <Clock className="h-4 w-4 text-black/60" strokeWidth={2} />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {task.time && (
                                                        <p className="text-[12px] text-black/40 mb-1">
                                                            {task.time}
                                                        </p>
                                                    )}
                                                    <p className="text-[14px] font-medium tracking-[-0.01em] text-black">
                                                        {task.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle2 className="h-6 w-6 text-black/40" strokeWidth={2} />
                                    </div>
                                    <p className="text-[14px] font-medium text-black/60">
                                        Aucune action requise
                                    </p>
                                    <p className="text-[13px] text-black/40 mt-1">
                                        Tout est à jour
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Actions rapides */}
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-5">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                                Actions rapides
                            </h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                                    onClick={() => router.push("/dashboard/clients")}
                                >
                                    <Plus className="h-4 w-4 mr-2.5 text-black/60" strokeWidth={2} />
                                    <span className="text-black/80">Nouveau client</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                                    onClick={() => router.push("/dashboard/articles")}
                                >
                                    <Plus className="h-4 w-4 mr-2.5 text-black/60" strokeWidth={2} />
                                    <span className="text-black/80">Nouvel article</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                                >
                                    <Plus className="h-4 w-4 mr-2.5 text-black/60" strokeWidth={2} />
                                    <span className="text-black/80">Nouveau devis</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Colonne Centrale - KPIs */}
                <div className="lg:col-span-1 space-y-5">
                    {/* KPIs avec tendances */}
                    <Card
                        className="border-black/8 shadow-sm cursor-pointer hover:border-black/20 transition-all duration-200"
                        onClick={() => router.push("/dashboard/clients")}
                    >
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-black/60" strokeWidth={2} />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`border-0 text-[12px] h-6 px-2 ${
                                        stats.clients.trend >= 0
                                            ? "bg-black/5 text-black/60"
                                            : "bg-black/10 text-black/60"
                                    }`}
                                >
                                    {stats.clients.trend >= 0 ? (
                                        <TrendingUp className="h-3 w-3 mr-1" strokeWidth={2} />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1" strokeWidth={2} />
                                    )}
                                    {Math.abs(stats.clients.trend).toFixed(0)}%
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                    {stats.clients.total}
                                </p>
                                <p className="text-[14px] text-black/60">Clients</p>
                                <p className="text-[13px] text-black/40 mt-1.5">
                                    +{stats.clients.new} ce mois
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className="border-black/8 shadow-sm cursor-pointer hover:border-black/20 transition-all duration-200"
                        onClick={() => router.push("/dashboard/articles")}
                    >
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-black/60" strokeWidth={2} />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={`border-0 text-[12px] h-6 px-2 ${
                                        stats.articles.trend >= 0
                                            ? "bg-black/5 text-black/60"
                                            : "bg-black/10 text-black/60"
                                    }`}
                                >
                                    {stats.articles.trend >= 0 ? (
                                        <TrendingUp className="h-3 w-3 mr-1" strokeWidth={2} />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1" strokeWidth={2} />
                                    )}
                                    {Math.abs(stats.articles.trend).toFixed(0)}%
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                    {stats.articles.total}
                                </p>
                                <p className="text-[14px] text-black/60">Articles</p>
                                <p className="text-[13px] text-black/40 mt-1.5">
                                    +{stats.articles.new} ce mois
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-black/8 shadow-sm">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-black/60" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                    0
                                </p>
                                <p className="text-[14px] text-black/60">Documents</p>
                                <p className="text-[13px] text-black/40 mt-1.5">À venir</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-black/8 shadow-sm">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-black/60" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                    0€
                                </p>
                                <p className="text-[14px] text-black/60">Chiffre d'affaires</p>
                                <p className="text-[13px] text-black/40 mt-1.5">Ce mois</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Colonne Droite - Activité récente */}
                <div className="lg:col-span-1 space-y-5">
                    {/* Derniers clients */}
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    Derniers clients
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-[13px] text-black/60 hover:text-black hover:bg-black/5"
                                    onClick={() => router.push("/dashboard/clients")}
                                >
                                    Voir tout
                                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" strokeWidth={2} />
                                </Button>
                            </div>

                            {recentClients.length > 0 ? (
                                <div className="space-y-2">
                                    {recentClients.map((client) => {
                                        const initiales = getClientInitials(client.nom, client.prenom);
                                        const nomComplet = getClientFullName(client.nom, client.prenom);
                                        const createdDate = new Date(client.createdAt);

                                        return (
                                            <div
                                                key={client.id}
                                                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-black/5 cursor-pointer transition-all duration-200"
                                                onClick={() =>
                                                    router.push(`/dashboard/clients/${client.id}`)
                                                }
                                            >
                                                <Avatar className="h-10 w-10 border border-black/10">
                                                    <AvatarFallback className="bg-black text-white text-[13px] font-medium">
                                                        {initiales.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-medium text-black truncate">
                                                        {nomComplet}
                                                    </p>
                                                    <p className="text-[12px] text-black/40">
                                                        {format(
                                                            createdDate,
                                                            isToday(createdDate) ? "HH:mm" : "d MMM",
                                                            { locale: fr }
                                                        )}
                                                    </p>
                                                </div>
                                                <ArrowUpRight className="h-4 w-4 text-black/40" strokeWidth={2} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-[14px] text-black/40 text-center py-8">
                                    Aucun client
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Activité récente */}
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-5">
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                                Activité récente
                            </h3>

                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                                                <activity.icon
                                                    className="h-4 w-4 text-black/60"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-medium text-black">
                                                    {activity.title}
                                                </p>
                                                <p className="text-[13px] text-black/60 truncate mt-0.5">
                                                    {activity.description}
                                                </p>
                                                <p className="text-[12px] text-black/40 mt-1">
                                                    {isToday(activity.date)
                                                        ? `Aujourd'hui à ${activity.time}`
                                                        : format(activity.date, "d MMM à HH:mm", {
                                                              locale: fr,
                                                          })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[14px] text-black/40 text-center py-8">
                                    Aucune activité récente
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Statistiques détaillées (Tabs existants) */}
            <Tabs defaultValue="clients" className="space-y-5">
                <TabsList className="bg-black/5 border-black/10">
                    <TabsTrigger
                        value="clients"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                    >
                        Statistiques Clients
                    </TabsTrigger>
                    <TabsTrigger
                        value="articles"
                        className="data-[state=active]:bg-white data-[state=active]:text-black text-[14px] data-[state=active]:shadow-sm"
                    >
                        Statistiques Articles
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="clients">
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-4">
                            <Button
                                variant="outline"
                                className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                                onClick={() => router.push("/dashboard/clients/statistiques")}
                            >
                                <span className="text-black/80">Voir les statistiques clients détaillées</span>
                                <ArrowUpRight className="h-4 w-4 text-black/40" strokeWidth={2} />
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="articles">
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-4">
                            <Button
                                variant="outline"
                                className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                                onClick={() => router.push("/dashboard/articles/stock")}
                            >
                                <span className="text-black/80">Voir la gestion du stock</span>
                                <ArrowUpRight className="h-4 w-4 text-black/40" strokeWidth={2} />
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    MapPin,
    Mail,
    Phone,
    TrendingUp,
    Calendar,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClientStatisticsPage() {
    const { data: clients = [], isLoading } = useClients();

    // Calcul des statistiques
    const stats = useMemo(() => {
        const now = new Date();
        const lastMonth = subMonths(now, 1);

        // Clients du mois en cours
        const currentMonthStart = startOfMonth(now);
        const currentMonthClients = clients.filter(
            (c) => new Date(c.createdAt) >= currentMonthStart
        );

        // Clients du mois dernier
        const lastMonthStart = startOfMonth(lastMonth);
        const lastMonthEnd = endOfMonth(lastMonth);
        const lastMonthClients = clients.filter((c) => {
            const date = new Date(c.createdAt);
            return date >= lastMonthStart && date <= lastMonthEnd;
        });

        // Calcul du taux de croissance
        const growth =
            lastMonthClients.length > 0
                ? ((currentMonthClients.length - lastMonthClients.length) /
                      lastMonthClients.length) *
                  100
                : currentMonthClients.length > 0
                ? 100
                : 0;

        // Répartition par ville
        const citiesMap = new Map<string, number>();
        clients.forEach((c) => {
            if (c.ville) {
                citiesMap.set(c.ville, (citiesMap.get(c.ville) || 0) + 1);
            }
        });
        const topCities = Array.from(citiesMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Évolution sur 6 mois
        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const month = subMonths(now, i);
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            const count = clients.filter((c) => {
                const date = new Date(c.createdAt);
                return date >= monthStart && date <= monthEnd;
            }).length;
            monthlyData.push({
                month: format(month, "MMM", { locale: fr }),
                count,
            });
        }

        const maxMonthlyCount = Math.max(...monthlyData.map((d) => d.count), 1);

        return {
            total: clients.length,
            currentMonth: currentMonthClients.length,
            lastMonth: lastMonthClients.length,
            growth,
            withEmail: clients.filter((c) => c.email).length,
            withPhone: clients.filter((c) => c.telephone).length,
            withBoth: clients.filter((c) => c.email && c.telephone).length,
            withLocation: clients.filter((c) => c.ville).length,
            topCities,
            monthlyData,
            maxMonthlyCount,
        };
    }, [clients]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Statistiques clients</h2>
                    <p className="text-muted-foreground">
                        Analysez l'évolution et la composition de votre base clients
                    </p>
                </div>
            </div>

            {/* KPIs principaux */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Badge variant="secondary">Total</Badge>
                        </div>
                        <div>
                            <p className="text-2xl font-bold mb-1">
                                {stats.total}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Clients enregistrés
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Badge
                                variant={stats.growth >= 0 ? "default" : "destructive"}
                                className="text-xs"
                            >
                                {stats.growth >= 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1 inline" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 mr-1 inline" />
                                )}
                                {Math.abs(stats.growth).toFixed(0)}%
                            </Badge>
                        </div>
                        <div>
                            <p className="text-2xl font-bold mb-1">
                                {stats.currentMonth}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Ce mois-ci
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Badge variant="secondary">
                                {stats.total > 0
                                    ? `${((stats.withEmail / stats.total) * 100).toFixed(0)}%`
                                    : "0%"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-2xl font-bold mb-1">
                                {stats.withEmail}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Avec email
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Badge variant="secondary">
                                {stats.total > 0
                                    ? `${((stats.withPhone / stats.total) * 100).toFixed(0)}%`
                                    : "0%"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-2xl font-bold mb-1">
                                {stats.withPhone}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Avec téléphone
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Évolution sur 6 mois */}
            <Card>
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">
                            Évolution sur 6 mois
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Nombre de nouveaux clients par mois
                        </p>
                    </div>

                    <div className="space-y-4">
                        {stats.monthlyData.map((data, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium capitalize">
                                        {data.month}
                                    </span>
                                    <span className="font-semibold">
                                        {data.count} {data.count > 1 ? "clients" : "client"}
                                    </span>
                                </div>
                                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500 flex items-center justify-end pr-3"
                                        style={{
                                            width: `${(data.count / stats.maxMonthlyCount) * 100}%`,
                                            minWidth: data.count > 0 ? "30px" : "0",
                                        }}
                                    >
                                        {data.count > 0 && (
                                            <span className="text-xs font-bold text-primary-foreground">
                                                {data.count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Répartition géographique et qualité des données */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Top villes */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Top 5 villes
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Répartition géographique
                                </p>
                            </div>
                        </div>

                        {stats.topCities.length > 0 ? (
                            <div className="space-y-4">
                                {stats.topCities.map(([city, count], index) => (
                                    <div key={city} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs w-6 h-6 flex items-center justify-center p-0">
                                                    {index + 1}
                                                </Badge>
                                                <span className="font-medium">
                                                    {city}
                                                </span>
                                            </div>
                                            <span className="font-semibold">
                                                {count}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500"
                                                style={{
                                                    width: `${(count / stats.total) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                Aucune donnée de localisation disponible
                            </div>
                        )}
                    </div>
                </Card>

                {/* Qualité des données */}
                <Card>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Qualité des données
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Complétude des informations
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                        Email renseigné
                                    </span>
                                    <span className="font-semibold">
                                        {stats.total > 0
                                            ? `${((stats.withEmail / stats.total) * 100).toFixed(1)}%`
                                            : "0%"}
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{
                                            width:
                                                stats.total > 0
                                                    ? `${(stats.withEmail / stats.total) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                        Téléphone renseigné
                                    </span>
                                    <span className="font-semibold">
                                        {stats.total > 0
                                            ? `${((stats.withPhone / stats.total) * 100).toFixed(1)}%`
                                            : "0%"}
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{
                                            width:
                                                stats.total > 0
                                                    ? `${(stats.withPhone / stats.total) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                        Localisation renseignée
                                    </span>
                                    <span className="font-semibold">
                                        {stats.total > 0
                                            ? `${((stats.withLocation / stats.total) * 100).toFixed(1)}%`
                                            : "0%"}
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{
                                            width:
                                                stats.total > 0
                                                    ? `${(stats.withLocation / stats.total) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">
                                        Email ET téléphone
                                    </span>
                                    <span className="font-semibold">
                                        {stats.total > 0
                                            ? `${((stats.withBoth / stats.total) * 100).toFixed(1)}%`
                                            : "0%"}
                                    </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{
                                            width:
                                                stats.total > 0
                                                    ? `${(stats.withBoth / stats.total) * 100}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

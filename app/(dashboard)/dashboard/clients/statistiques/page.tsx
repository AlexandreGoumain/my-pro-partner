"use client";

import { DataQualityCard } from "@/components/ui/data-quality-card";
import { MonthlyEvolutionCard } from "@/components/ui/monthly-evolution-card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { TopCitiesCard } from "@/components/ui/top-cities-card";
import { useClientsStats } from "@/hooks/use-clients";
import { calculatePercentage } from "@/lib/utils/statistics";
import { ArrowDown, ArrowUp, Calendar, Mail, Phone, Users } from "lucide-react";
import { useMemo } from "react";

export default function ClientStatisticsPage() {
    const { data: statsData } = useClientsStats();

    // Process statistics data from API
    const stats = useMemo(() => {
        if (!statsData) {
            return {
                total: 0,
                currentMonth: 0,
                growth: 0,
                withEmail: 0,
                withPhone: 0,
                withBoth: 0,
                withLocation: 0,
                topCities: [],
                monthlyData: [],
            };
        }

        return {
            total: statsData.total,
            currentMonth: statsData.currentMonth,
            growth: statsData.growth,
            withEmail: statsData.dataQuality.withEmail,
            withPhone: statsData.dataQuality.withPhone,
            withBoth: statsData.dataQuality.withBoth,
            withLocation: statsData.dataQuality.withLocation,
            topCities: statsData.topCities,
            monthlyData: statsData.monthlyEvolution || [],
        };
    }, [statsData]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Statistiques clients"
                description="Analysez l'évolution et la composition de votre base clients"
            />

            {/* KPIs principaux */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Users}
                    label="Clients enregistrés"
                    value={stats.total}
                    badge={{ text: "Total" }}
                />

                <StatCard
                    icon={Calendar}
                    label="Ce mois-ci"
                    value={stats.currentMonth}
                    badge={{
                        text: (
                            <>
                                {stats.growth >= 0 ? (
                                    <ArrowUp className="h-3 w-3 mr-1 inline" />
                                ) : (
                                    <ArrowDown className="h-3 w-3 mr-1 inline" />
                                )}
                                {Math.abs(stats.growth).toFixed(0)}%
                            </>
                        ),
                        variant: stats.growth >= 0 ? "default" : "destructive",
                        className: "text-xs",
                    }}
                />

                <StatCard
                    icon={Mail}
                    label="Avec email"
                    value={stats.withEmail}
                    badge={{
                        text: calculatePercentage(stats.withEmail, stats.total),
                    }}
                />

                <StatCard
                    icon={Phone}
                    label="Avec téléphone"
                    value={stats.withPhone}
                    badge={{
                        text: calculatePercentage(stats.withPhone, stats.total),
                    }}
                />
            </div>

            {/* Évolution sur 6 mois */}
            <MonthlyEvolutionCard
                data={stats.monthlyData}
                className="border-black/8 shadow-sm"
            />

            {/* Répartition géographique et qualité des données */}
            <div className="grid gap-4 md:grid-cols-2">
                <TopCitiesCard
                    cities={stats.topCities}
                    total={stats.total}
                    className="border-black/8 shadow-sm"
                />

                <DataQualityCard
                    metrics={{
                        withEmail: stats.withEmail,
                        withPhone: stats.withPhone,
                        withLocation: stats.withLocation,
                        withBoth: stats.withBoth,
                    }}
                    total={stats.total}
                    className="border-black/8 shadow-sm"
                />
            </div>
        </div>
    );
}

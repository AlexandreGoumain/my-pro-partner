"use client";

import {
    AnalyticsChartCard,
    AnalyticsDataQuality,
    AnalyticsStatCard,
} from "@/components/segment-analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSegmentAnalyticsPage } from "@/hooks/use-segment-analytics-page";
import { CHART_CONFIG } from "@/lib/constants/chart-colors";
import {
    ArrowLeft,
    Calendar,
    Mail,
    MapPin,
    Phone,
    Star,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import { use } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const COLORS = ["#000000", "#404040", "#737373", "#a3a3a3", "#d4d4d4"];

export default function SegmentAnalyticsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const handlers = useSegmentAnalyticsPage(id);

    if (handlers.isLoading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-6 animate-pulse border-black/8">
                        <div className="h-32 bg-black/5 rounded" />
                    </Card>
                ))}
            </div>
        );
    }

    if (!handlers.analytics) {
        return (
            <Card className="p-12 border-black/8">
                <div className="text-center">
                    <h3 className="text-[17px] font-semibold text-black mb-2">
                        Segment non trouvé
                    </h3>
                    <p className="text-[14px] text-black/60 mb-4">
                        Ce segment n&apos;existe pas ou a été supprimé
                    </p>
                    <Button
                        onClick={handlers.handleBackToSegments}
                        variant="outline"
                        className="border-black/10 hover:bg-black/5"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                        Retour aux segments
                    </Button>
                </div>
            </Card>
        );
    }

    const { analytics } = handlers;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    onClick={handlers.handleBack}
                    variant="ghost"
                    className="mb-4 h-9 px-3 text-[13px] hover:bg-black/5"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                    Retour
                </Button>
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Analytics : {analytics.segment.nom}
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        {analytics.segment.description ||
                            "Analyse détaillée du segment"}
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <AnalyticsStatCard
                    icon={Users}
                    badge="Total"
                    value={analytics.summary.totalClients}
                    label={`${analytics.summary.percentageOfBase.toFixed(
                        1
                    )}% de la base`}
                />

                <AnalyticsStatCard
                    icon={
                        analytics.summary.growth >= 0
                            ? TrendingUp
                            : TrendingDown
                    }
                    badge={`${
                        analytics.summary.growth >= 0 ? "+" : ""
                    }${analytics.summary.growth.toFixed(1)}%`}
                    badgeClassName={
                        analytics.summary.growth >= 0
                            ? "bg-black/10 text-black/80"
                            : "bg-black/5 text-black/60"
                    }
                    value={analytics.summary.newLast30Days}
                    label="Nouveaux (30j)"
                />

                <AnalyticsStatCard
                    icon={Mail}
                    badge={
                        analytics.summary.totalClients > 0
                            ? `${(
                                  (analytics.demographics.withEmail /
                                      analytics.summary.totalClients) *
                                  100
                              ).toFixed(0)}%`
                            : "0%"
                    }
                    value={analytics.demographics.withEmail}
                    label="Avec email"
                />

                <AnalyticsStatCard
                    icon={Phone}
                    badge={
                        analytics.summary.totalClients > 0
                            ? `${(
                                  (analytics.demographics.withPhone /
                                      analytics.summary.totalClients) *
                                  100
                              ).toFixed(0)}%`
                            : "0%"
                    }
                    value={analytics.demographics.withPhone}
                    label="Avec téléphone"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-5 lg:grid-cols-2">
                <AnalyticsChartCard
                    title="Évolution mensuelle"
                    description="Nouveaux clients par mois"
                    icon={Calendar}
                >
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={analytics.timeline.monthly}>
                            <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                            <XAxis dataKey="month" {...CHART_CONFIG.axis} />
                            <YAxis {...CHART_CONFIG.axis} />
                            <Tooltip {...CHART_CONFIG.tooltip} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                {...CHART_CONFIG.line}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </AnalyticsChartCard>

                <AnalyticsChartCard
                    title="Croissance cumulative"
                    description="Total au fil du temps"
                    icon={TrendingUp}
                >
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={analytics.timeline.cumulative}>
                            <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                            <XAxis dataKey="month" {...CHART_CONFIG.axis} />
                            <YAxis {...CHART_CONFIG.axis} />
                            <Tooltip {...CHART_CONFIG.tooltip} />
                            <Line
                                type="monotone"
                                dataKey="total"
                                {...CHART_CONFIG.line}
                                fill="#f3f4f6"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </AnalyticsChartCard>

                <AnalyticsChartCard
                    title="Principales villes"
                    description="Top 10 localisations"
                    icon={MapPin}
                >
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.distribution.topCities}>
                            <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                            <XAxis
                                dataKey="city"
                                tick={{ fill: "#737373", fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis {...CHART_CONFIG.axis} />
                            <Tooltip {...CHART_CONFIG.tooltip} />
                            <Bar dataKey="count" {...CHART_CONFIG.bar} />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalyticsChartCard>

                <AnalyticsChartCard
                    title="Points de fidélité"
                    description="Distribution par tranche"
                    icon={Star}
                >
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={analytics.distribution.loyaltyBuckets}
                                dataKey="count"
                                nameKey="range"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {analytics.distribution.loyaltyBuckets.map(
                                    (_: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    )
                                )}
                            </Pie>
                            <Tooltip {...CHART_CONFIG.tooltip} />
                            <Legend
                                wrapperStyle={{ fontSize: "13px" }}
                                iconType="circle"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalyticsChartCard>
            </div>

            {/* Data Quality */}
            <AnalyticsDataQuality metrics={handlers.dataQualityMetrics} />
        </div>
    );
}

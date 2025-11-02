"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSegmentAnalytics } from "@/hooks/use-segments";
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
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const { id } = use(params);
    const { data: analytics, isLoading } = useSegmentAnalytics(id);

    if (isLoading) {
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

    if (!analytics) {
        return (
            <Card className="p-12 border-black/8">
                <div className="text-center">
                    <h3 className="text-[17px] font-semibold text-black mb-2">
                        Segment non trouvé
                    </h3>
                    <p className="text-[14px] text-black/60 mb-4">
                        Ce segment n'existe pas ou a été supprimé
                    </p>
                    <Button
                        onClick={() =>
                            router.push("/dashboard/clients/segments")
                        }
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Button
                    onClick={() => router.back()}
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
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Users
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/5 text-black/60 border-0 text-[12px]"
                            >
                                Total
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {analytics.summary.totalClients}
                            </p>
                            <p className="text-[14px] text-black/60">
                                {analytics.summary.percentageOfBase.toFixed(1)}%
                                de la base
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                {analytics.summary.growth >= 0 ? (
                                    <TrendingUp
                                        className="h-5 w-5 text-black/60"
                                        strokeWidth={2}
                                    />
                                ) : (
                                    <TrendingDown
                                        className="h-5 w-5 text-black/60"
                                        strokeWidth={2}
                                    />
                                )}
                            </div>
                            <Badge
                                variant="secondary"
                                className={`border-0 text-[12px] ${
                                    analytics.summary.growth >= 0
                                        ? "bg-black/10 text-black/80"
                                        : "bg-black/5 text-black/60"
                                }`}
                            >
                                {analytics.summary.growth >= 0 ? "+" : ""}
                                {analytics.summary.growth.toFixed(1)}%
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {analytics.summary.newLast30Days}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Nouveaux (30j)
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Mail
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/5 text-black/60 border-0 text-[12px]"
                            >
                                {analytics.summary.totalClients > 0
                                    ? `${(
                                          (analytics.demographics.withEmail /
                                              analytics.summary.totalClients) *
                                          100
                                      ).toFixed(0)}%`
                                    : "0%"}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {analytics.demographics.withEmail}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Avec email
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Phone
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/5 text-black/60 border-0 text-[12px]"
                            >
                                {analytics.summary.totalClients > 0
                                    ? `${(
                                          (analytics.demographics.withPhone /
                                              analytics.summary.totalClients) *
                                          100
                                      ).toFixed(0)}%`
                                    : "0%"}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {analytics.demographics.withPhone}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Avec téléphone
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-5 lg:grid-cols-2">
                {/* Timeline Chart */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    Évolution mensuelle
                                </h3>
                                <p className="text-[13px] text-black/40 mt-1">
                                    Nouveaux clients par mois
                                </p>
                            </div>
                            <Calendar
                                className="h-5 w-5 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.timeline.monthly}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e5e5"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: "#737373", fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: "#737373", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#000000"
                                    strokeWidth={2}
                                    dot={{ fill: "#000000" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Cumulative Growth */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    Croissance cumulative
                                </h3>
                                <p className="text-[13px] text-black/40 mt-1">
                                    Total au fil du temps
                                </p>
                            </div>
                            <TrendingUp
                                className="h-5 w-5 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.timeline.cumulative}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e5e5"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: "#737373", fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: "#737373", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#000000"
                                    strokeWidth={2}
                                    dot={{ fill: "#000000" }}
                                    fill="#f3f4f6"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Cities */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    Principales villes
                                </h3>
                                <p className="text-[13px] text-black/40 mt-1">
                                    Top 10 localisations
                                </p>
                            </div>
                            <MapPin
                                className="h-5 w-5 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.distribution.topCities}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e5e5"
                                />
                                <XAxis
                                    dataKey="city"
                                    tick={{ fill: "#737373", fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    tick={{ fill: "#737373", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                    }}
                                />
                                <Bar dataKey="count" fill="#000000" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Loyalty Distribution */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    Points de fidélité
                                </h3>
                                <p className="text-[13px] text-black/40 mt-1">
                                    Distribution par tranche
                                </p>
                            </div>
                            <Star
                                className="h-5 w-5 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
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
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: "13px" }}
                                    iconType="circle"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Data Quality */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                        Qualité des données
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[13px] text-black/60">
                                    Avec email
                                </p>
                                <p className="text-[13px] font-medium text-black">
                                    {analytics.summary.totalClients > 0
                                        ? `${(
                                              (analytics.demographics
                                                  .withEmail /
                                                  analytics.summary
                                                      .totalClients) *
                                              100
                                          ).toFixed(0)}%`
                                        : "0%"}
                                </p>
                            </div>
                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black"
                                    style={{
                                        width: `${
                                            analytics.summary.totalClients > 0
                                                ? (analytics.demographics
                                                      .withEmail /
                                                      analytics.summary
                                                          .totalClients) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[13px] text-black/60">
                                    Avec téléphone
                                </p>
                                <p className="text-[13px] font-medium text-black">
                                    {analytics.summary.totalClients > 0
                                        ? `${(
                                              (analytics.demographics
                                                  .withPhone /
                                                  analytics.summary
                                                      .totalClients) *
                                              100
                                          ).toFixed(0)}%`
                                        : "0%"}
                                </p>
                            </div>
                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black"
                                    style={{
                                        width: `${
                                            analytics.summary.totalClients > 0
                                                ? (analytics.demographics
                                                      .withPhone /
                                                      analytics.summary
                                                          .totalClients) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[13px] text-black/60">
                                    Avec adresse
                                </p>
                                <p className="text-[13px] font-medium text-black">
                                    {analytics.summary.totalClients > 0
                                        ? `${(
                                              (analytics.demographics
                                                  .withAddress /
                                                  analytics.summary
                                                      .totalClients) *
                                              100
                                          ).toFixed(0)}%`
                                        : "0%"}
                                </p>
                            </div>
                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black"
                                    style={{
                                        width: `${
                                            analytics.summary.totalClients > 0
                                                ? (analytics.demographics
                                                      .withAddress /
                                                      analytics.summary
                                                          .totalClients) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[13px] text-black/60">
                                    Complet
                                </p>
                                <p className="text-[13px] font-medium text-black">
                                    {analytics.demographics.completionRate.toFixed(
                                        0
                                    )}
                                    %
                                </p>
                            </div>
                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black"
                                    style={{
                                        width: `${analytics.demographics.completionRate}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingCard } from "@/components/ui/loading-card";
import { AnalyticsKPICard } from "@/components/analytics/analytics-kpi-card";
import { DebtorCard, Debtor } from "@/components/analytics/debtor-card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Euro, Shield, Users } from "lucide-react";
import { toast } from "sonner";

interface DebtorsResponse {
    debtors: Debtor[];
    summary: {
        totalClients: number;
        totalDebtAmount: number;
        highRiskCount: number;
        mediumRiskCount: number;
        lowRiskCount: number;
    };
}

export default function DebtorsPage() {
    const [limit, setLimit] = useState("10");

    const { data, isLoading, error } = useQuery<DebtorsResponse>({
        queryKey: ["top-debtors", limit],
        queryFn: async () => {
            const params = new URLSearchParams({ limit });

            const response = await fetch(
                `/api/analytics/top-debtors?${params}`
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }

            return response.json();
        },
    });

    const handleSendReminder = async (clientId: string) => {
        // TODO: Implement email reminder functionality
        toast.success("Rappel envoyé avec succès au client");
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Clients débiteurs"
                    description="Analyse des clients avec des factures impayées"
                />
                <LoadingCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Clients débiteurs"
                    description="Analyse des clients avec des factures impayées"
                />
                <div className="p-6 border border-black/8 rounded-lg bg-black/2">
                    <p className="text-[14px] text-black/60">
                        Une erreur est survenue lors du chargement des données.
                    </p>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Clients débiteurs"
                description="Analyse et gestion des clients avec des factures impayées"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKPICard
                    title="Total des créances"
                    value={formatCurrency(data.summary.totalDebtAmount)}
                    subtitle={`${data.summary.totalClients} client${data.summary.totalClients > 1 ? "s" : ""} concerné${data.summary.totalClients > 1 ? "s" : ""}`}
                    icon={Euro}
                />
                <AnalyticsKPICard
                    title="Risque élevé"
                    value={data.summary.highRiskCount}
                    subtitle="Clients à surveiller de près"
                    icon={AlertCircle}
                />
                <AnalyticsKPICard
                    title="Risque modéré"
                    value={data.summary.mediumRiskCount}
                    subtitle="Surveillance recommandée"
                    icon={Shield}
                />
                <AnalyticsKPICard
                    title="Risque faible"
                    value={data.summary.lowRiskCount}
                    subtitle="Situation sous contrôle"
                    icon={Users}
                />
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between p-4 border border-black/8 rounded-lg bg-white">
                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-black/60 font-medium">
                        Nombre de clients affichés:
                    </span>
                    <Select value={limit} onValueChange={setLimit}>
                        <SelectTrigger className="w-[120px] h-9 border-black/10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">Top 5</SelectItem>
                            <SelectItem value="10">Top 10</SelectItem>
                            <SelectItem value="20">Top 20</SelectItem>
                            <SelectItem value="50">Top 50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-[13px] text-black/60">
                    Triés par montant impayé décroissant
                </div>
            </div>

            {/* Debtors Grid */}
            {data.debtors.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {data.debtors.map((debtor) => (
                        <DebtorCard
                            key={debtor.client.id}
                            debtor={debtor}
                            onSendReminder={handleSendReminder}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-black/8 rounded-lg bg-black/2">
                    <div className="text-center">
                        <div className="text-[16px] font-medium text-black/70 mb-2">
                            ✓ Aucun client débiteur
                        </div>
                        <p className="text-[14px] text-black/40">
                            Tous vos clients ont réglé leurs factures
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { AnalyticsKPIGrid } from "@/components/analytics/analytics-kpi-grid";
import { DebtorCard } from "@/components/analytics/debtor-card";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { SectionTitle } from "@/components/ui/section-title";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebtorsAnalytics } from "@/hooks/use-debtors-analytics";
import { AlertCircle, Euro, Shield, Users } from "lucide-react";

export default function DebtorsPage() {
    const {
        limit,
        setLimit,
        debtors,
        summary,
        isLoading,
        error,
        handleSendReminder,
        formatAmount,
    } = useDebtorsAnalytics();

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            skeletonProps={{
                layout: "stats-grid",
                statsCount: 4,
                itemCount: 5,
                statsHeight: "h-28",
                itemHeight: "h-40",
            }}
        >
            {error ? (
                <div className="space-y-6">
                    <PageHeader
                        title="Clients débiteurs"
                        description="Analyse des clients avec des factures impayées"
                    />
                    <div className="flex items-center justify-center p-12 border border-black/8 rounded-lg bg-white">
                        <p className="text-[14px] text-red-600">
                            {error.message || "Une erreur est survenue"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <PageHeader
                        title="Clients débiteurs"
                        description="Analyse des clients avec des factures impayées"
                    />

                    {summary && (
                        <AnalyticsKPIGrid
                            kpis={[
                                {
                                    title: "Clients débiteurs",
                                    value: summary.totalClients,
                                    icon: Users,
                                },
                                {
                                    title: "Montant total impayé",
                                    value: formatAmount(
                                        summary.totalDebtAmount
                                    ),
                                    icon: Euro,
                                },
                                {
                                    title: "Risque élevé",
                                    value: summary.highRiskCount,
                                    icon: AlertCircle,
                                },
                                {
                                    title: "Risque moyen",
                                    value: summary.mediumRiskCount,
                                    icon: Shield,
                                },
                            ]}
                            className="gap-6"
                        />
                    )}

                    <SectionTitle
                        title="Top débiteurs"
                        action={
                            <Select value={limit} onValueChange={setLimit}>
                                <SelectTrigger className="w-[180px] h-10 border-black/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">Top 10</SelectItem>
                                    <SelectItem value="20">Top 20</SelectItem>
                                    <SelectItem value="50">Top 50</SelectItem>
                                    <SelectItem value="100">Top 100</SelectItem>
                                </SelectContent>
                            </Select>
                        }
                    />

                    <div className="grid grid-cols-1 gap-4">
                        {debtors.map((debtor) => (
                            <DebtorCard
                                key={debtor.client.id}
                                debtor={debtor}
                                onSendReminder={handleSendReminder}
                            />
                        ))}

                        {debtors.length === 0 && (
                            <div className="flex items-center justify-center p-12 border border-black/8 rounded-lg bg-white">
                                <p className="text-[14px] text-black/40">
                                    Aucun client débiteur trouvé
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ConditionalSkeleton>
    );
}

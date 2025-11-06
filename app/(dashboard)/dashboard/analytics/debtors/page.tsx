"use client";

import { PageHeader } from "@/components/ui/page-header";
import { LoadingCard } from "@/components/ui/loading-card";
import { AnalyticsKPICard } from "@/components/analytics/analytics-kpi-card";
import { DebtorCard } from "@/components/analytics/debtor-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Euro, Shield, Users } from "lucide-react";
import { useDebtorsAnalytics } from "@/hooks/use-debtors-analytics";

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
        <div className="flex items-center justify-center p-12 border border-black/8 rounded-lg bg-white">
          <p className="text-[14px] text-red-600">
            {error.message || "Une erreur est survenue"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients débiteurs"
        description="Analyse des clients avec des factures impayées"
      />

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsKPICard
            title="Clients débiteurs"
            value={summary.totalClients}
            icon={Users}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <AnalyticsKPICard
            title="Montant total impayé"
            value={formatAmount(summary.totalDebtAmount)}
            icon={Euro}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <AnalyticsKPICard
            title="Risque élevé"
            value={summary.highRiskCount}
            icon={AlertCircle}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
          <AnalyticsKPICard
            title="Risque moyen"
            value={summary.mediumRiskCount}
            icon={Shield}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
          Top débiteurs
        </h2>
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
      </div>

      <div className="grid grid-cols-1 gap-4">
        {debtors.map((debtor) => (
          <DebtorCard
            key={debtor.id}
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
  );
}

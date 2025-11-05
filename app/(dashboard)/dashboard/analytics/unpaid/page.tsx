"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingCard } from "@/components/ui/loading-card";
import { AnalyticsKPICard } from "@/components/analytics/analytics-kpi-card";
import {
    UnpaidInvoiceTable,
    UnpaidInvoice,
} from "@/components/analytics/unpaid-invoice-table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Clock, Euro, FileText } from "lucide-react";
import { toast } from "sonner";

interface UnpaidInvoicesResponse {
    invoices: UnpaidInvoice[];
    summary: {
        totalInvoices: number;
        totalUnpaid: number;
        overdueCount: number;
        totalOverdue: number;
        averageOverdueDays: number;
    };
}

export default function UnpaidInvoicesPage() {
    const [sortBy, setSortBy] = useState("dateEcheance");
    const [sortOrder, setSortOrder] = useState("asc");
    const [overdueOnly, setOverdueOnly] = useState(false);

    const { data, isLoading, error } = useQuery<UnpaidInvoicesResponse>({
        queryKey: ["unpaid-invoices", sortBy, sortOrder, overdueOnly],
        queryFn: async () => {
            const params = new URLSearchParams({
                sortBy,
                sortOrder,
                overdueOnly: overdueOnly.toString(),
            });

            const response = await fetch(
                `/api/analytics/unpaid-invoices?${params}`
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }

            return response.json();
        },
    });

    const handleSendReminder = async (invoiceId: string) => {
        try {
            // Find the invoice to get the client ID
            const invoice = data?.invoices.find((inv) => inv.id === invoiceId);
            if (!invoice) {
                toast.error("Facture non trouvée");
                return;
            }

            const response = await fetch(
                `/api/clients/${invoice.clientId}/send-reminder`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'envoi du rappel");
            }

            toast.success(
                result.message ||
                    `Rappel envoyé avec succès (${result.invoiceCount} facture${result.invoiceCount > 1 ? "s" : ""})`
            );
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Erreur lors de l'envoi du rappel";
            toast.error(errorMessage);
        }
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
                    title="Factures impayées"
                    description="Suivi des factures en attente de paiement"
                />
                <LoadingCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Factures impayées"
                    description="Suivi des factures en attente de paiement"
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
                title="Factures impayées"
                description="Suivi et gestion des factures en attente de paiement"
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKPICard
                    title="Total impayé"
                    value={formatCurrency(data.summary.totalUnpaid)}
                    subtitle={`${data.summary.totalInvoices} facture${data.summary.totalInvoices > 1 ? "s" : ""}`}
                    icon={Euro}
                />
                <AnalyticsKPICard
                    title="Factures en retard"
                    value={data.summary.overdueCount}
                    subtitle={formatCurrency(data.summary.totalOverdue)}
                    icon={AlertCircle}
                />
                <AnalyticsKPICard
                    title="Retard moyen"
                    value={`${data.summary.averageOverdueDays} j`}
                    subtitle={
                        data.summary.overdueCount > 0
                            ? "Pour les factures en retard"
                            : "Aucune facture en retard"
                    }
                    icon={Clock}
                />
                <AnalyticsKPICard
                    title="En attente"
                    value={
                        data.summary.totalInvoices - data.summary.overdueCount
                    }
                    subtitle={formatCurrency(
                        data.summary.totalUnpaid - data.summary.totalOverdue
                    )}
                    icon={FileText}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 p-4 border border-black/8 rounded-lg bg-white">
                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-black/60 font-medium">
                        Trier par:
                    </span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px] h-9 border-black/10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dateEcheance">
                                Date d&apos;échéance
                            </SelectItem>
                            <SelectItem value="dateEmission">
                                Date d&apos;émission
                            </SelectItem>
                            <SelectItem value="reste_a_payer">
                                Montant
                            </SelectItem>
                            <SelectItem value="numero">
                                N° de facture
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-black/60 font-medium">
                        Ordre:
                    </span>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[140px] h-9 border-black/10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Croissant</SelectItem>
                            <SelectItem value="desc">Décroissant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant={overdueOnly ? "default" : "outline"}
                        size="sm"
                        className={
                            overdueOnly
                                ? "bg-black hover:bg-black/90 text-white h-9 px-4 text-[13px] font-medium"
                                : "border-black/10 hover:bg-black/5 h-9 px-4 text-[13px] font-medium"
                        }
                        onClick={() => setOverdueOnly(!overdueOnly)}
                    >
                        {overdueOnly ? "Toutes" : "En retard uniquement"}
                    </Button>
                </div>
            </div>

            {/* Invoice Table */}
            <UnpaidInvoiceTable
                invoices={data.invoices}
                onSendReminder={handleSendReminder}
            />
        </div>
    );
}

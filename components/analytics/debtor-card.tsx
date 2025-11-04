"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, FileText, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export interface Debtor {
    client: {
        id: string;
        nom: string;
        prenom: string | null;
        email: string | null;
        telephone: string | null;
        ville: string | null;
    };
    totalUnpaid: number;
    unpaidInvoiceCount: number;
    invoices: Array<{
        id: string;
        numero: string;
        dateEmission: Date;
        dateEcheance: Date | null;
        resteAPayer: number;
        daysOverdue: number;
    }>;
    oldestUnpaidDate: Date;
    averageOverdueDays: number;
    averagePaymentDelay: number;
    riskLevel: "low" | "medium" | "high";
}

export interface DebtorCardProps {
    debtor: Debtor;
    onSendReminder?: (clientId: string) => void;
    className?: string;
}

export function DebtorCard({
    debtor,
    onSendReminder,
    className = "",
}: DebtorCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const getClientName = () => {
        if (debtor.client.prenom) {
            return `${debtor.client.prenom} ${debtor.client.nom}`;
        }
        return debtor.client.nom;
    };

    const getRiskColor = () => {
        switch (debtor.riskLevel) {
            case "high":
                return "bg-black text-white";
            case "medium":
                return "bg-black/10 text-black";
            case "low":
                return "bg-black/5 text-black/60";
        }
    };

    const getRiskLabel = () => {
        switch (debtor.riskLevel) {
            case "high":
                return "Risque élevé";
            case "medium":
                return "Risque modéré";
            case "low":
                return "Risque faible";
        }
    };

    return (
        <Card
            className={`p-6 border-black/8 shadow-sm hover:shadow-md transition-shadow ${className}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black mb-1">
                        {getClientName()}
                    </h3>
                    <div className="flex flex-col gap-1 text-[13px] text-black/60">
                        {debtor.client.email && (
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                                {debtor.client.email}
                            </div>
                        )}
                        {debtor.client.telephone && (
                            <div className="flex items-center gap-1.5">
                                <Phone
                                    className="h-3.5 w-3.5"
                                    strokeWidth={2}
                                />
                                {debtor.client.telephone}
                            </div>
                        )}
                        {debtor.client.ville && (
                            <div className="flex items-center gap-1.5">
                                <MapPin
                                    className="h-3.5 w-3.5"
                                    strokeWidth={2}
                                />
                                {debtor.client.ville}
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={`px-3 py-1 rounded text-[12px] font-medium ${getRiskColor()}`}
                >
                    {getRiskLabel()}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-black/2 rounded-lg">
                <div>
                    <div className="text-[13px] text-black/60 mb-1">
                        Total impayé
                    </div>
                    <div className="text-[20px] font-bold tracking-[-0.02em] text-black">
                        {formatCurrency(debtor.totalUnpaid)}
                    </div>
                </div>
                <div>
                    <div className="text-[13px] text-black/60 mb-1">
                        Factures en attente
                    </div>
                    <div className="text-[20px] font-bold tracking-[-0.02em] text-black">
                        {debtor.unpaidInvoiceCount}
                    </div>
                </div>
                <div>
                    <div className="text-[13px] text-black/60 mb-1">
                        Retard moyen
                    </div>
                    <div className="text-[16px] font-semibold text-black">
                        {debtor.averageOverdueDays} jours
                    </div>
                </div>
                <div>
                    <div className="text-[13px] text-black/60 mb-1">
                        Délai paiement moyen
                    </div>
                    <div className="text-[16px] font-semibold text-black">
                        {debtor.averagePaymentDelay > 0 ? "+" : ""}
                        {debtor.averagePaymentDelay} jours
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <FileText
                        className="h-4 w-4 text-black/60"
                        strokeWidth={2}
                    />
                    <h4 className="text-[14px] font-semibold text-black">
                        Factures impayées
                    </h4>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {debtor.invoices.slice(0, 5).map((invoice) => (
                        <Link
                            key={invoice.id}
                            href={`/dashboard/documents/${invoice.id}`}
                            className="flex items-center justify-between p-3 bg-white border border-black/8 rounded-lg hover:bg-black/2 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-[14px] font-medium text-black">
                                    {invoice.numero}
                                </span>
                                {invoice.daysOverdue > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-black text-white">
                                        <Clock
                                            className="h-3 w-3"
                                            strokeWidth={2}
                                        />
                                        {invoice.daysOverdue}j
                                    </span>
                                )}
                            </div>
                            <span className="text-[14px] font-semibold text-black">
                                {formatCurrency(invoice.resteAPayer)}
                            </span>
                        </Link>
                    ))}
                    {debtor.invoices.length > 5 && (
                        <p className="text-[12px] text-black/40 text-center pt-1">
                            +{debtor.invoices.length - 5} autre
                            {debtor.invoices.length - 5 > 1 ? "s" : ""}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-black/10 hover:bg-black/5 h-9 text-[13px]"
                    onClick={() => onSendReminder?.(debtor.client.id)}
                    disabled={!debtor.client.email}
                >
                    <Mail className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                    Envoyer rappel
                </Button>
                <Link
                    href={`/dashboard/clients/${debtor.client.id}`}
                    className="flex-1"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-black/10 hover:bg-black/5 h-9 text-[13px]"
                    >
                        Voir fiche client
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

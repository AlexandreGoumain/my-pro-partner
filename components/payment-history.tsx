"use client";

import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, Banknote, Building2, Smartphone } from "lucide-react";

interface Paiement {
    id: string;
    date_paiement: Date;
    montant: number;
    moyen_paiement: string;
    reference?: string | null;
    notes?: string | null;
}

interface PaymentHistoryProps {
    payments: Paiement[];
    resteAPayer: number;
    totalTTC: number;
}

const PAYMENT_ICONS = {
    ESPECES: Banknote,
    CHEQUE: CreditCard,
    VIREMENT: Building2,
    CARTE: CreditCard,
    PRELEVEMENT: Building2,
};

const PAYMENT_LABELS = {
    ESPECES: "Espèces",
    CHEQUE: "Chèque",
    VIREMENT: "Virement",
    CARTE: "Carte bancaire",
    PRELEVEMENT: "Prélèvement",
};

export function PaymentHistory({ payments, resteAPayer, totalTTC }: PaymentHistoryProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const totalPaye = totalTTC - resteAPayer;
    const progressPercent = (totalPaye / totalTTC) * 100;

    return (
        <Card className="p-6 border-black/8 shadow-sm">
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                Paiements
            </h3>

            {/* Payment progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-[13px] mb-2">
                    <span className="text-black/60">Payé</span>
                    <span className="font-medium">
                        {formatCurrency(totalPaye)} / {formatCurrency(totalTTC)}
                    </span>
                </div>
                <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {resteAPayer > 0 && (
                    <div className="flex items-center justify-between text-[13px] mt-2">
                        <span className="text-black/60">Reste à payer</span>
                        <span className="font-semibold text-black">
                            {formatCurrency(resteAPayer)}
                        </span>
                    </div>
                )}
            </div>

            {/* Payment list */}
            {payments.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-[14px] text-black/40">
                        Aucun paiement enregistré
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {payments.map((payment) => {
                        const Icon = PAYMENT_ICONS[payment.moyen_paiement as keyof typeof PAYMENT_ICONS] || CreditCard;
                        const label = PAYMENT_LABELS[payment.moyen_paiement as keyof typeof PAYMENT_LABELS] || payment.moyen_paiement;

                        return (
                            <div
                                key={payment.id}
                                className="flex items-start gap-3 p-3 rounded-md border border-black/5 bg-black/2"
                            >
                                <div className="mt-0.5">
                                    <Icon className="w-4 h-4 text-black/40" strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[13px] font-medium text-black">
                                            {label}
                                        </span>
                                        <span className="text-[14px] font-semibold text-black">
                                            {formatCurrency(Number(payment.montant))}
                                        </span>
                                    </div>
                                    <div className="text-[12px] text-black/60">
                                        {format(new Date(payment.date_paiement), "dd MMMM yyyy", { locale: fr })}
                                    </div>
                                    {payment.reference && (
                                        <div className="text-[12px] text-black/40 mt-1">
                                            Réf: {payment.reference}
                                        </div>
                                    )}
                                    {payment.notes && (
                                        <div className="text-[12px] text-black/60 mt-1">
                                            {payment.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}

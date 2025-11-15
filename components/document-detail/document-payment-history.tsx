"use client";

import { PaymentHistory } from "@/components/payment-history";
import { usePayments } from "@/hooks/use-payments";
import { Card } from "@/components/ui/card";
import { GridSkeleton } from "@/components/ui/grid-skeleton";

export interface DocumentPaymentHistoryProps {
    documentId: string;
    resteAPayer: number;
    totalTTC: number;
}

/**
 * Wrapper component for PaymentHistory that fetches payment data
 * Handles loading and error states automatically
 */
export function DocumentPaymentHistory({
    documentId,
    resteAPayer,
    totalTTC,
}: DocumentPaymentHistoryProps) {
    const { data: payments = [], isLoading } = usePayments(documentId);

    if (isLoading) {
        return (
            <Card className="p-6 border-black/8 shadow-sm">
                <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                    Paiements
                </h3>
                <GridSkeleton
                    itemCount={3}
                    gridColumns={{ default: 1 }}
                    gap={3}
                    itemHeight="h-20"
                />
            </Card>
        );
    }

    return (
        <PaymentHistory
            payments={payments}
            resteAPayer={resteAPayer}
            totalTTC={totalTTC}
        />
    );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BankTransaction } from "@/lib/types/bank-reconciliation";
import { TRANSACTION_STATUS_CONFIG } from "@/lib/types/bank-reconciliation";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertCircle, Ban, CheckCircle, XCircle } from "lucide-react";

export interface TransactionCardProps {
    transaction: BankTransaction;
    onMatch: (transaction: BankTransaction) => void;
    onAnomaly: (transaction: BankTransaction) => void;
    onIgnore: (transactionId: string) => void;
    className?: string;
}

export function TransactionCard({
    transaction,
    onMatch,
    onAnomaly,
    onIgnore,
    className,
}: TransactionCardProps) {
    const statusConfig = TRANSACTION_STATUS_CONFIG[transaction.statut];
    const StatusIcon = {
        PENDING: AlertCircle,
        MATCHED: CheckCircle,
        MANUAL: CheckCircle,
        IGNORED: Ban,
        ANOMALY: XCircle,
    }[transaction.statut];

    return (
        <Card
            className={cn(
                "p-4 border-black/8 hover:border-black/12 transition-colors",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-[100px]">
                        <div className="text-[13px] font-medium text-black">
                            {format(new Date(transaction.date), "dd MMM yyyy", {
                                locale: fr,
                            })}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-black truncate">
                            {transaction.libelle}
                        </div>
                        {transaction.reference && (
                            <div className="text-[12px] text-black/60 font-mono">
                                Réf: {transaction.reference}
                            </div>
                        )}
                        {transaction.document && (
                            <div className="text-[12px] text-black/60">
                                → {transaction.document.numero} (
                                {transaction.document.client.nom})
                            </div>
                        )}
                        {transaction.notes && (
                            <div className="text-[12px] text-red-600 mt-1">
                                {transaction.notes}
                            </div>
                        )}
                    </div>

                    <div className="w-[120px] text-right">
                        <div
                            className={cn(
                                "text-[16px] font-semibold",
                                Number(transaction.montant) >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            )}
                        >
                            {Number(transaction.montant) >= 0 ? "+" : ""}
                            {Number(transaction.montant).toFixed(2)}€
                        </div>
                    </div>

                    <div className="w-[160px]">
                        <Badge className={statusConfig.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                        </Badge>
                    </div>
                </div>

                {transaction.statut === "PENDING" && (
                    <div className="flex gap-2 ml-4">
                        <Button
                            onClick={() => onMatch(transaction)}
                            size="sm"
                            variant="outline"
                            className="border-black/10 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                        >
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Rapprocher
                        </Button>
                        <Button
                            onClick={() => onAnomaly(transaction)}
                            size="sm"
                            variant="outline"
                            className="border-black/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                            <AlertCircle className="h-3 w-3 mr-2" />
                            Anomalie
                        </Button>
                        <Button
                            onClick={() => onIgnore(transaction.id)}
                            size="sm"
                            variant="outline"
                            className="border-black/10 hover:bg-black/5"
                        >
                            <Ban className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}

import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { pluralize } from "@/lib/utils/format";

export interface OverdueInvoicesCardProps {
    overdueInvoices: number;
}

export function OverdueInvoicesCard({
    overdueInvoices,
}: OverdueInvoicesCardProps) {
    return (
        <Card className="p-6 border-black/8 shadow-sm">
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                Factures en retard
            </h3>
            {overdueInvoices > 0 ? (
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                        <Clock
                            className="h-5 w-5 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="text-[20px] font-bold text-black">
                            {overdueInvoices}
                        </div>
                        <div className="text-[13px] text-black/60 mt-1">
                            {pluralize(overdueInvoices, "facture")} {pluralize(overdueInvoices, "nécessite", "nécessitent")} un suivi
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-24">
                    <div className="text-center">
                        <div className="text-[16px] font-medium text-black/70">
                            ✓ Aucune facture en retard
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}

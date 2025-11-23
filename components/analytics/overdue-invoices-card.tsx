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
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Factures en retard
                        </h3>
                    </div>
                </div>
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
            </div>
        </Card>
    );
}

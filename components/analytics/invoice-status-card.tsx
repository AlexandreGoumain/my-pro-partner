import { Card } from "@/components/ui/card";

export interface InvoiceStatusCardProps {
    paidInvoices: number;
    unpaidInvoices: number;
    overdueInvoices: number;
}

export function InvoiceStatusCard({
    paidInvoices,
    unpaidInvoices,
    overdueInvoices,
}: InvoiceStatusCardProps) {
    return (
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            État des factures
                        </h3>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-black/60">
                            Payées
                        </span>
                        <span className="text-[14px] font-medium text-black">
                            {paidInvoices}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-black/60">
                            En attente
                        </span>
                        <span className="text-[14px] font-medium text-black">
                            {unpaidInvoices}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-black/60">
                            En retard
                        </span>
                        <span className="text-[14px] font-medium text-black">
                            {overdueInvoices}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}

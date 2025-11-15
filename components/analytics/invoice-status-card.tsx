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
        <Card className="p-6 border-black/8 shadow-sm">
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                État des factures
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[14px] text-black/60">Payées</span>
                    <span className="text-[14px] font-medium text-black">
                        {paidInvoices}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[14px] text-black/60">En attente</span>
                    <span className="text-[14px] font-medium text-black">
                        {unpaidInvoices}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[14px] text-black/60">En retard</span>
                    <span className="text-[14px] font-medium text-black">
                        {overdueInvoices}
                    </span>
                </div>
            </div>
        </Card>
    );
}

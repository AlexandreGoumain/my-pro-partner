import { cn } from "@/lib/utils";

export interface PaymentLinkAmountProps {
    montant: number;
    quantitePaye?: number;
    quantiteMax?: number | null;
    className?: string;
}

/**
 * Display payment link amount with optional quantity stats
 */
export function PaymentLinkAmount({
    montant,
    quantitePaye,
    quantiteMax,
    className,
}: PaymentLinkAmountProps) {
    return (
        <div className={cn("space-y-6", className)}>
            {/* Montant */}
            <div className="bg-black/2 rounded-lg p-6">
                <div className="text-center">
                    <p className="text-[14px] text-black/60 mb-2">
                        Montant à payer
                    </p>
                    <p className="text-[48px] font-semibold tracking-[-0.02em] text-black">
                        {Number(montant).toFixed(2)}€
                    </p>
                </div>
            </div>

            {/* Stats */}
            {quantiteMax && (
                <div className="text-center text-[13px] text-black/60">
                    {quantitePaye} / {quantiteMax} paiements effectués
                </div>
            )}
        </div>
    );
}

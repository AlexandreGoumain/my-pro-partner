import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaymentLinkActionsProps {
    montant: number;
    paying: boolean;
    showQR: boolean;
    onPay: () => void;
    onToggleQR: () => void;
    className?: string;
}

/**
 * Payment link action buttons (Pay and QR Code)
 */
export function PaymentLinkActions({
    montant,
    paying,
    showQR,
    onPay,
    onToggleQR,
    className,
}: PaymentLinkActionsProps) {
    return (
        <div className={cn("space-y-4", className)}>
            {/* Bouton de paiement */}
            <Button
                onClick={onPay}
                disabled={paying}
                className="w-full h-12 bg-black hover:bg-black/90 text-white text-[15px] font-medium rounded-md shadow-sm"
            >
                {paying ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirection...
                    </>
                ) : (
                    <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Payer {Number(montant).toFixed(2)}€
                    </>
                )}
            </Button>

            {/* Bouton QR Code */}
            <Button
                onClick={onToggleQR}
                variant="outline"
                className="w-full h-11 border-black/10 hover:bg-black/5 text-[14px] font-medium rounded-md"
            >
                <QrCode className="mr-2 h-4 w-4" />
                {showQR ? "Masquer" : "Afficher"} le QR Code
            </Button>
        </div>
    );
}

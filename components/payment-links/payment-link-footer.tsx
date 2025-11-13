import { cn } from "@/lib/utils";

export interface PaymentLinkFooterProps {
    entrepriseName: string;
    className?: string;
}

/**
 * Payment link footer with security information
 */
export function PaymentLinkFooter({ entrepriseName, className }: PaymentLinkFooterProps) {
    return (
        <div className={cn("space-y-6", className)}>
            {/* Info entreprise */}
            <div className="text-center">
                <p className="text-[13px] text-black/40">
                    Paiement sécurisé par {entrepriseName}
                </p>
                <p className="text-[12px] text-black/30 mt-1">
                    Propulsé par Stripe
                </p>
            </div>

            {/* Sécurité badge */}
            <div className="text-center">
                <p className="text-[12px] text-black/40">
                    🔒 Paiement 100% sécurisé avec chiffrement SSL
                </p>
            </div>
        </div>
    );
}

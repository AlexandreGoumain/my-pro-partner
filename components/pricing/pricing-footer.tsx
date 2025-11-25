import { Mail, Shield, CreditCard } from "lucide-react";

export function PricingFooter() {
    return (
        <div className="mt-16 mb-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-[13px] text-black/50">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" strokeWidth={2} />
                        <span>Essai gratuit de 14 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" strokeWidth={2} />
                        <span>Aucune carte requise</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" strokeWidth={2} />
                        <a
                            href="mailto:support@mypropartner.com"
                            className="text-black/60 hover:text-black transition-colors"
                        >
                            support@mypropartner.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

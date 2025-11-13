import { Sparkles } from "lucide-react";

export function PricingPageHeader() {
    return (
        <div className="text-center mb-16 pt-8">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-6">
                <Sparkles
                    className="w-4 h-4 text-black/60 mr-2"
                    strokeWidth={2}
                />
                <span className="text-[13px] font-medium text-black/70">
                    Choisissez le plan parfait pour vous
                </span>
            </div>

            <h1 className="text-[48px] font-bold tracking-[-0.04em] text-black mb-4">
                Plans & Tarifs
            </h1>

            <p className="text-[18px] text-black/60 max-w-2xl mx-auto leading-relaxed">
                Des tarifs simples et transparents pour accompagner votre
                croissance. Changez de plan à tout moment.
            </p>
        </div>
    );
}

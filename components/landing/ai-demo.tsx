import { Sparkles } from "lucide-react";

export function AIDemo() {
    const examples = [
        "Quel client me doit le plus d'argent ?",
        "Génère une facture pour le devis #1234",
        "Quels sont mes produits les plus vendus ce mois ?",
        "Rappelle-moi mes rendez-vous de demain",
    ];

    return (
        <section
            id="ai-assistant"
            className="px-6 bg-black/[0.01] border-y border-black/[0.06] scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top-large)',
                paddingBottom: 'var(--section-padding-bottom-large)'
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 items-center" style={{ gap: 'var(--spacing-3xl)' }}>
                    {/* Left: Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06] mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-black/60" strokeWidth={2} />
                            <span className="text-[13px] text-black/60 font-medium tracking-wide-premium">
                                Intelligence Artificielle
                            </span>
                        </div>

                        <h2 className="text-[48px] font-semibold tracking-tight-premium text-black mb-4">
                            Votre assistant IA
                        </h2>
                        <p className="text-[18px] text-black/50 leading-relaxed tracking-wide-premium" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            Posez vos questions en français. Réponses instantanées.
                        </p>

                        <div className="space-y-3">
                            {examples.map((example, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 rounded-lg bg-white border border-black/[0.06] shadow-sm transition-all ease-premium hover:border-black/[0.12]"
                                    style={{ transitionDuration: '0.3s' }}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                                    <span className="text-[14px] text-black/60 tracking-wide-premium">
                                        "{example}"
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent rounded-2xl blur-3xl" />
                        <div className="relative bg-white border border-black/[0.08] rounded-2xl p-8 shadow-stripe">
                            <div className="space-y-4">
                                {/* User message */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                                        <span className="text-[12px] font-semibold text-black/60 tracking-wide-premium">U</span>
                                    </div>
                                    <div className="flex-1 p-3 rounded-lg bg-black/[0.04]">
                                        <p className="text-[14px] text-black/80 tracking-wide-premium">
                                            Quel est mon CA du mois ?
                                        </p>
                                    </div>
                                </div>

                                {/* AI response */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1 p-4 rounded-lg bg-white border border-black/[0.08] shadow-sm">
                                        <p className="text-[14px] text-black/80 mb-3 tracking-wide-premium">
                                            Votre chiffre d'affaires pour novembre 2025 :
                                        </p>
                                        <div className="text-[24px] font-semibold text-black tracking-tight-premium">
                                            42 850 €
                                        </div>
                                        <p className="text-[13px] text-black/40 mt-2 tracking-wide-premium">
                                            +18% vs octobre
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

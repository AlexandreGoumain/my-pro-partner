import { Shield, Lock, Server, Zap } from "lucide-react";

export function TrustSignals() {
    const signals = [
        {
            icon: Shield,
            title: "Conforme RGPD",
            description: "Données hébergées en France",
        },
        {
            icon: Lock,
            title: "Sécurité bancaire",
            description: "Chiffrement SSL 256-bit",
        },
        {
            icon: Server,
            title: "Disponibilité 99.9%",
            description: "Infrastructure redondante",
        },
        {
            icon: Zap,
            title: "Migration gratuite",
            description: "Assistance complète sous 48h",
        },
    ];

    return (
        <section
            className="px-6 border-y border-black/[0.06] bg-black/[0.01] scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top)',
                paddingBottom: 'var(--section-padding-bottom)'
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4" style={{ gap: 'var(--spacing-lg)' }}>
                    {signals.map((signal, index) => {
                        const Icon = signal.icon;
                        return (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-black/[0.04] flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-black/60" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-semibold text-black mb-0.5 tracking-wide-premium">
                                        {signal.title}
                                    </h3>
                                    <p className="text-[13px] text-black/50 tracking-wide-premium">
                                        {signal.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

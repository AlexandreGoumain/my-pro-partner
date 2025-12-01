"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, RotateCcw, Truck, Headphones, Clock, Lock } from "lucide-react";

const guarantees = [
    {
        icon: RotateCcw,
        title: "30 jours satisfait ou remboursé",
        description: "Testez sans risque. Pas convaincu ? Remboursement intégral, sans justification.",
    },
    {
        icon: Clock,
        title: "Sans engagement",
        description: "Résiliez quand vous voulez depuis votre tableau de bord. Aucuns frais cachés.",
    },
    {
        icon: Truck,
        title: "Migration gratuite",
        description: "On récupère vos données depuis votre ancien logiciel. Zéro perte, zéro stress.",
    },
    {
        icon: Headphones,
        title: "Support français 7j/7",
        description: "Une vraie équipe basée en France, disponible par chat, email ou téléphone.",
    },
    {
        icon: Lock,
        title: "Données 100% sécurisées",
        description: "Chiffrement bancaire, serveurs en France, conformité RGPD totale.",
    },
    {
        icon: Shield,
        title: "Propriété de vos données",
        description: "Vos données vous appartiennent. Export complet à tout moment, sans restriction.",
    },
];

export function Guarantees() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="py-24 px-6 sm:px-8 bg-neutral-50 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full" />
            </div>

            <div className="max-w-[1100px] mx-auto relative">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-16 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                        Zéro risque
                    </p>
                    <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] text-black leading-[1.1]">
                        Nos garanties
                    </h2>
                    <p className="text-[17px] text-black/50 max-w-[500px] mx-auto">
                        On assume notre promesse. Si vous n&apos;êtes pas satisfait, on vous rembourse.
                    </p>
                </div>

                {/* Guarantees Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {guarantees.map((guarantee, i) => {
                        const Icon = guarantee.icon;
                        return (
                            <div
                                key={i}
                                className={`p-6 rounded-2xl bg-white border border-black/[0.06] hover:border-black/[0.12] transition-all duration-500 group ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                                style={{ transitionDelay: `${i * 80}ms` }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-black/[0.04] flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                    <Icon className="w-5 h-5 text-black/60 group-hover:text-white transition-colors duration-300" strokeWidth={2} />
                                </div>
                                <h3 className="text-[16px] font-semibold text-black mb-2">
                                    {guarantee.title}
                                </h3>
                                <p className="text-[14px] text-black/50 leading-relaxed">
                                    {guarantee.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Trust */}
                <div
                    className={`mt-12 text-center transition-all duration-700 delay-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-black text-white">
                        <Shield className="w-5 h-5" strokeWidth={2} />
                        <span className="text-[14px] font-medium">
                            Testez 14 jours gratuitement, sans engagement
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

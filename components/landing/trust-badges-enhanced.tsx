"use client";

import { Shield, Zap, Heart, Lock, Clock, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const badges = [
    {
        icon: Shield,
        title: "Sécurité bancaire",
        description: "Chiffrement AES-256"
    },
    {
        icon: Zap,
        title: "Déploiement instantané",
        description: "Opérationnel en 2 min"
    },
    {
        icon: Heart,
        title: "Support réactif",
        description: "Réponse en 24h max"
    },
    {
        icon: Lock,
        title: "RGPD Conforme",
        description: "Données en Europe"
    },
    {
        icon: Clock,
        title: "Disponibilité 99.9%",
        description: "Infrastructure redondante"
    },
    {
        icon: Award,
        title: "Satisfaction garantie",
        description: "Remboursement 30j"
    }
];

export function TrustBadgesEnhanced() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="relative py-20 px-6 sm:px-8 bg-gradient-to-b from-white to-neutral-50/50">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative p-6 rounded-2xl bg-white border border-black/[0.06] hover:border-black/[0.12] hover:shadow-lg transition-all duration-500 ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                }`}
                                style={{
                                    transitionDelay: `${index * 75}ms`,
                                }}
                            >
                                {/* Hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/[0.01] to-black/[0.03] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative space-y-3">
                                    {/* Icon */}
                                    <div className="inline-flex p-3 rounded-xl bg-black/[0.04] group-hover:bg-black group-hover:scale-110 transition-all duration-300">
                                        <Icon className="w-5 h-5 text-black/60 group-hover:text-white transition-colors" strokeWidth={2} />
                                    </div>

                                    {/* Text */}
                                    <div>
                                        <div className="text-[13px] font-semibold text-black mb-1 tracking-tight">
                                            {badge.title}
                                        </div>
                                        <div className="text-[11px] text-black/50 font-medium leading-tight">
                                            {badge.description}
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative dot */}
                                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-black/10 group-hover:bg-black/40 group-hover:scale-150 transition-all duration-300" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

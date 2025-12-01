"use client";

import { Card } from "@/components/ui/card";
import { Clock, FileText, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const benefits = [
    {
        icon: Clock,
        title: "3h → 10min",
        subtitle: "par jour",
        description:
            "Devis en 2 clics. Factures automatiques. Relances programmées. L'IA fait le travail répétitif.",
        stat: "95% de temps gagné",
    },
    {
        icon: FileText,
        title: "0 erreur",
        subtitle: "de facturation",
        description:
            "TVA calculée. Numérotation conforme. Mentions légales incluses. Zéro risque de redressement.",
        stat: "100% conforme",
    },
    {
        icon: TrendingUp,
        title: "+30%",
        subtitle: "de CA récupéré",
        description:
            "Visualisez vos impayés. Relances automatiques. Ne laissez plus d'argent sur la table.",
        stat: "En moyenne",
    },
];

export function BenefitsSimple() {
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
        <section ref={ref} className="py-24 px-6 sm:px-8 bg-white">
            <div className="max-w-[1100px] mx-auto">
                {/* Header */}
                <div className="text-center space-y-4 mb-16">
                    <p className="text-[13px] font-semibold text-black/50 uppercase tracking-wide">
                        Pourquoi MyProPartner
                    </p>
                    <h2 className="text-[40px] sm:text-[48px] font-bold tracking-[-0.02em] text-black leading-[1.1]">
                        Concentrez-vous sur votre métier.
                        <span className="block text-black/60">Pas sur l&apos;admin.</span>
                    </h2>
                </div>

                {/* Benefits grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className={`transition-all duration-700 ${
                                    isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <Card className="relative p-8 h-full border-black/[0.06] hover:border-black/[0.12] hover:shadow-lg transition-all duration-300 group">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                                    </div>

                                    {/* Title */}
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[36px] font-bold text-black tracking-tight">
                                                {benefit.title}
                                            </span>
                                            <span className="text-[15px] text-black/50 font-medium">
                                                {benefit.subtitle}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[15px] text-black/60 leading-relaxed mb-6">
                                        {benefit.description}
                                    </p>

                                    {/* Stat badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                        <span className="text-[12px] font-semibold text-black/70">
                                            {benefit.stat}
                                        </span>
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

"use client";

import { Card } from "@/components/ui/card";
import {
    TrendingUp,
    Users,
    Clock,
    Zap,
    Target,
    Award,
    Sparkles,
    FileText
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Stat {
    icon: React.ElementType;
    value: number;
    suffix: string;
    label: string;
    description: string;
    color: string;
    iconColor: string;
}

const stats: Stat[] = [
    {
        icon: Users,
        value: 500,
        suffix: "+",
        label: "Entreprises actives",
        description: "Font confiance à MyProPartner",
        color: "from-blue-500/10 to-cyan-500/10",
        iconColor: "text-blue-600"
    },
    {
        icon: FileText,
        value: 50000,
        suffix: "+",
        label: "Documents créés",
        description: "Devis et factures générés",
        color: "from-purple-500/10 to-indigo-500/10",
        iconColor: "text-purple-600"
    },
    {
        icon: Clock,
        value: 15,
        suffix: "h",
        label: "Gagnées par semaine",
        description: "Temps économisé en moyenne",
        color: "from-amber-500/10 to-orange-500/10",
        iconColor: "text-amber-600"
    },
    {
        icon: TrendingUp,
        value: 35,
        suffix: "%",
        label: "Croissance du CA",
        description: "En moyenne la première année",
        color: "from-emerald-500/10 to-green-500/10",
        iconColor: "text-emerald-600"
    },
    {
        icon: Zap,
        value: 2,
        suffix: "min",
        label: "Pour créer un devis",
        description: "Vs 30 minutes avant",
        color: "from-yellow-500/10 to-amber-500/10",
        iconColor: "text-yellow-600"
    },
    {
        icon: Target,
        value: 98,
        suffix: "%",
        label: "Taux de satisfaction",
        description: "Nos utilisateurs recommandent",
        color: "from-rose-500/10 to-pink-500/10",
        iconColor: "text-rose-600"
    },
    {
        icon: Award,
        value: 4.9,
        suffix: "/5",
        label: "Note moyenne",
        description: "Sur plus de 500 avis",
        color: "from-violet-500/10 to-purple-500/10",
        iconColor: "text-violet-600"
    },
    {
        icon: Sparkles,
        value: 1000,
        suffix: "+",
        label: "Questions IA/jour",
        description: "Traitées par l'assistant",
        color: "from-fuchsia-500/10 to-pink-500/10",
        iconColor: "text-fuchsia-600"
    }
];

function AnimatedCounter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    const startTime = Date.now();
                    const step = () => {
                        const now = Date.now();
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(easeOutQuart * target);

                        setCount(current);

                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            setCount(target);
                        }
                    };

                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [target, duration, hasAnimated]);

    return (
        <div ref={ref} className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.04em] text-black leading-none">
            {count.toLocaleString()}{suffix}
        </div>
    );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const Icon = stat.icon;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${index * 75}ms` }}
        >
            <Card className="group p-8 bg-white border border-black/[0.08] hover:border-black/[0.15] hover:shadow-xl hover:shadow-black/5 transition-all duration-500 h-full overflow-hidden relative">
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative space-y-6">
                    {/* Icon */}
                    <div className="inline-flex p-3 rounded-2xl bg-black/[0.03] group-hover:bg-white border border-transparent group-hover:border-black/[0.08] group-hover:scale-110 transition-all duration-500">
                        <Icon className={`w-7 h-7 ${stat.iconColor} transition-transform duration-500 group-hover:rotate-12`} strokeWidth={1.5} />
                    </div>

                    {/* Animated Number */}
                    <div>
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>

                    {/* Label & Description */}
                    <div className="space-y-2">
                        <div className="text-[16px] font-semibold text-black tracking-[-0.01em]">
                            {stat.label}
                        </div>
                        <div className="text-[13px] text-black/50 leading-[1.5]">
                            {stat.description}
                        </div>
                    </div>
                </div>

                {/* Decorative dot */}
                <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-black/[0.06] group-hover:scale-150 group-hover:bg-black/[0.12] transition-all duration-500" />
            </Card>
        </div>
    );
}

export function StatsAnimated() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 -left-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 -right-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <TrendingUp className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Des résultats concrets
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Les chiffres parlent d'eux-mêmes
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Des milliers d'entrepreneurs ont déjà transformé leur business avec MyProPartner
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} index={index} />
                    ))}
                </div>

                {/* Bottom text */}
                <div className="mt-12 text-center">
                    <p className="text-[14px] text-black/40">
                        Données basées sur plus de 500 entreprises actives •{" "}
                        <span className="text-black/60 font-medium">Mises à jour en temps réel</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

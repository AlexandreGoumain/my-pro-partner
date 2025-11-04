"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, Clock, Shield, Users } from "lucide-react";

const stats = [
    {
        value: 15,
        suffix: "h",
        label: "économisées par semaine",
        description: "en moyenne pour nos utilisateurs",
        icon: Clock,
        color: "from-black to-black/80",
    },
    {
        value: 3,
        suffix: "x",
        label: "plus rapide",
        description: "création de devis vs Excel",
        icon: TrendingUp,
        color: "from-black to-black/80",
    },
    {
        value: 99.9,
        suffix: "%",
        label: "de disponibilité",
        description: "infrastructure sécurisée",
        icon: Shield,
        color: "from-black to-black/80",
    },
    {
        value: 500,
        suffix: "+",
        label: "entreprises",
        description: "nous font confiance",
        icon: Users,
        color: "from-black to-black/80",
    },
];

function AnimatedCounter({
    value,
    suffix,
    duration = 2000
}: {
    value: number;
    suffix: string;
    duration?: number;
}) {
    const [count, setCount] = useState(0);
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

    useEffect(() => {
        if (!isVisible) return;

        const startTime = Date.now();
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = value * easeOutQuart;

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [isVisible, value, duration]);

    const displayValue = suffix === "%"
        ? count.toFixed(1)
        : Math.floor(count).toString();

    return (
        <div ref={ref} className="text-[56px] sm:text-[72px] font-semibold tracking-[-0.03em] text-black leading-none">
            {displayValue}
            <span className="text-black/60">{suffix}</span>
        </div>
    );
}

export function StatsSection() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-1/3 h-1/3 bg-black/[0.02] rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1120px] mx-auto relative">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <TrendingUp className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Des résultats concrets et mesurables
                        </span>
                    </div>
                    <h2 className="text-[40px] sm:text-[52px] font-semibold tracking-[-0.02em] text-black mb-4 leading-[1.1]">
                        L&apos;impact sur votre entreprise
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[640px] mx-auto leading-[1.5]">
                        Rejoignez des centaines d&apos;entreprises qui ont transformé leur gestion
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-8 rounded-2xl border border-black/[0.08] bg-white hover:border-black/[0.15] hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
                            >
                                {/* Icon badge */}
                                <div className="absolute -top-4 left-8">
                                    <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-black to-black/90 shadow-lg shadow-black/20">
                                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center space-y-3 mt-4">
                                    <AnimatedCounter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        duration={2000}
                                    />
                                    <div className="text-[16px] text-black font-semibold tracking-[-0.01em]">
                                        {stat.label}
                                    </div>
                                    <div className="text-[13px] text-black/40 leading-relaxed">
                                        {stat.description}
                                    </div>
                                </div>

                                {/* Hover effect line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-black to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom tagline */}
                <div className="mt-16 text-center">
                    <p className="text-[15px] text-black/40">
                        <span className="text-black/60 font-medium">Plus de 12 000 heures</span> économisées collectivement par nos utilisateurs
                    </p>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
}

function AnimatedNumber({ value, suffix = "", prefix = "", duration = 2000 }: AnimatedNumberProps) {
    const [current, setCurrent] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCurrent(Math.floor(eased * value));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, value, duration]);

    return (
        <span ref={ref}>
            {prefix}
            {current}
            {suffix}
        </span>
    );
}

const stats = [
    {
        value: 3,
        suffix: "h",
        label: "économisées",
        sublabel: "par jour",
        description: "Plus de temps pour vos clients, moins pour la paperasse",
    },
    {
        value: 95,
        suffix: "%",
        label: "automatisé",
        sublabel: "devis, factures, relances",
        description: "L'IA gère les tâches répétitives à votre place",
    },
    {
        value: 30,
        prefix: "+",
        suffix: "%",
        label: "d'impayés",
        sublabel: "récupérés",
        description: "Grâce aux relances automatiques et au suivi intelligent",
    },
];

export function BenefitsPremium() {
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
        <section ref={ref} className="py-32 px-6 sm:px-8 bg-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-20 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                        Résultats concrets
                    </p>
                    <h2 className="text-[44px] sm:text-[56px] font-bold tracking-[-0.03em] text-black leading-[1.1]">
                        Moins d&apos;admin.
                        <br />
                        <span className="text-black/40">Plus de business.</span>
                    </h2>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`relative group transition-all duration-700 ${
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            {/* Card */}
                            <div className="relative p-8 rounded-2xl bg-neutral-50/50 border border-black/[0.04] hover:border-black/[0.08] hover:bg-neutral-50 transition-all duration-300">
                                {/* Number */}
                                <div className="mb-6">
                                    <div className="text-[72px] sm:text-[88px] font-bold tracking-[-0.04em] text-black leading-none">
                                        <AnimatedNumber
                                            value={stat.value}
                                            suffix={stat.suffix}
                                            prefix={stat.prefix}
                                        />
                                    </div>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-[18px] font-semibold text-black">
                                            {stat.label}
                                        </span>
                                        <span className="text-[15px] text-black/40">
                                            {stat.sublabel}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[15px] text-black/50 leading-relaxed">
                                    {stat.description}
                                </p>

                                {/* Decorative line */}
                                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom message */}
                <div
                    className={`mt-20 text-center transition-all duration-700 delay-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[15px] text-black/40 max-w-[500px] mx-auto">
                        Estimations basées sur l&apos;automatisation des tâches administratives courantes.
                        <span className="text-black font-medium"> Vos résultats peuvent varier.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

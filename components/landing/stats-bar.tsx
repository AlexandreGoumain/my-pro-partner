"use client";

import { TrendingUp, Users, Clock, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Stat {
    icon: React.ElementType;
    value: number;
    suffix: string;
    label: string;
    prefix?: string;
}

const stats: Stat[] = [
    {
        icon: Users,
        value: 500,
        suffix: "+",
        label: "Entreprises actives",
    },
    {
        icon: Clock,
        value: 40,
        suffix: "h",
        label: "Gagnées par semaine",
    },
    {
        icon: TrendingUp,
        value: 8,
        suffix: "x",
        label: "Retour sur investissement",
    },
    {
        icon: Zap,
        value: 95,
        suffix: "%",
        label: "Temps gagné sur l'admin",
    },
];

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setCount(Math.floor(progress * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isVisible, value, duration]);

    return <span ref={elementRef}>{count}</span>;
}

export function StatsBar() {
    return (
        <section className="py-12 px-6 sm:px-8 bg-black text-white overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-center">
                                    <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.12]">
                                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-baseline justify-center gap-1">
                                        {stat.prefix && (
                                            <span className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.03em]">
                                                {stat.prefix}
                                            </span>
                                        )}
                                        <span className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.03em]">
                                            <AnimatedNumber value={stat.value} />
                                        </span>
                                        <span className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.03em] text-white/80">
                                            {stat.suffix}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-white/60 font-medium">
                                        {stat.label}
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

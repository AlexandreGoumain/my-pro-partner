"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
    value: string;
    label: string;
    suffix?: string;
}

const stats: Stat[] = [
    { value: "500", label: "Artisans nous font confiance", suffix: "+" },
    { value: "50000", label: "Factures générées", suffix: "+" },
    { value: "99.9", label: "Disponibilité", suffix: "%" },
    { value: "24", label: "Support disponible", suffix: "h" },
];

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
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
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const target = parseFloat(value);
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div ref={ref} className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {count.toLocaleString("fr-FR")}{suffix}
        </div>
    );
}

export function StatsSection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center space-y-2 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-border hover:border-primary/50 transition-all hover:scale-105"
                        >
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            <p className="text-muted-foreground font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

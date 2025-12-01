"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, X, Check } from "lucide-react";

const comparisons = [
    {
        task: "Créer un devis",
        before: "20 min",
        after: "30 sec",
    },
    {
        task: "Générer une facture",
        before: "15 min",
        after: "1 clic",
    },
    {
        task: "Relancer un impayé",
        before: "Manuel",
        after: "Auto",
    },
    {
        task: "Suivre son stock",
        before: "Excel",
        after: "Temps réel",
    },
    {
        task: "Voir son CA",
        before: "Calculer",
        after: "Dashboard",
    },
    {
        task: "Temps admin/jour",
        before: "3h+",
        after: "15 min",
    },
];

export function BeforeAfter() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
        <section ref={ref} className="py-24 px-6 sm:px-8 bg-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full -translate-x-1/2" />
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full translate-x-1/2" />
            </div>

            <div className="max-w-[900px] mx-auto relative">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-16 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                        Comparaison
                    </p>
                    <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] text-black leading-[1.1]">
                        Avant / Après
                    </h2>
                    <p className="text-[17px] text-black/50 max-w-[450px] mx-auto">
                        Voyez la différence sur vos tâches quotidiennes.
                    </p>
                </div>

                {/* Comparison Table */}
                <div
                    className={`transition-all duration-700 delay-200 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 mb-4 px-4">
                        <div className="text-[12px] font-semibold text-black/40 uppercase tracking-wide">
                            Tâche
                        </div>
                        <div className="text-[12px] font-semibold text-black/40 uppercase tracking-wide text-center">
                            <span className="inline-flex items-center gap-1.5">
                                <X className="w-3 h-3" strokeWidth={2} />
                                Sans
                            </span>
                        </div>
                        <div className="text-[12px] font-semibold text-black/40 uppercase tracking-wide text-center">
                            <span className="inline-flex items-center gap-1.5">
                                <Check className="w-3 h-3" strokeWidth={2} />
                                Avec MyProPartner
                            </span>
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-2">
                        {comparisons.map((item, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-3 gap-4 p-4 rounded-xl border transition-all duration-300 cursor-default ${
                                    hoveredIndex === i
                                        ? "bg-black text-white border-black"
                                        : "bg-neutral-50/50 border-black/[0.04] hover:border-black/[0.08]"
                                }`}
                                style={{ transitionDelay: `${i * 50}ms` }}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div
                                    className={`text-[14px] font-medium ${
                                        hoveredIndex === i ? "text-white" : "text-black"
                                    }`}
                                >
                                    {item.task}
                                </div>
                                <div
                                    className={`text-[14px] text-center ${
                                        hoveredIndex === i ? "text-white/50 line-through" : "text-black/40"
                                    }`}
                                >
                                    {item.before}
                                </div>
                                <div className="text-center">
                                    <span
                                        className={`inline-flex items-center gap-2 text-[14px] font-semibold ${
                                            hoveredIndex === i ? "text-white" : "text-black"
                                        }`}
                                    >
                                        <ArrowRight
                                            className={`w-3 h-3 ${
                                                hoveredIndex === i ? "text-white/60" : "text-black/30"
                                            }`}
                                            strokeWidth={2}
                                        />
                                        {item.after}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Result */}
                <div
                    className={`mt-12 text-center transition-all duration-700 delay-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-6 rounded-2xl bg-black text-white">
                        <div className="text-center sm:text-left">
                            <p className="text-[32px] font-bold tracking-[-0.02em]">3h</p>
                            <p className="text-[13px] text-white/60">économisées par jour</p>
                        </div>
                        <div className="hidden sm:block w-px h-12 bg-white/20" />
                        <div className="text-center sm:text-left">
                            <p className="text-[32px] font-bold tracking-[-0.02em]">15h</p>
                            <p className="text-[13px] text-white/60">par semaine</p>
                        </div>
                        <div className="hidden sm:block w-px h-12 bg-white/20" />
                        <div className="text-center sm:text-left">
                            <p className="text-[32px] font-bold tracking-[-0.02em]">780h</p>
                            <p className="text-[13px] text-white/60">par an</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

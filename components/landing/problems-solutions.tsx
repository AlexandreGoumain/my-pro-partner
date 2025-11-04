"use client";

import { Card } from "@/components/ui/card";
import { X, Check, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProblemSolutionCardProps {
    problem: string;
    solution: string;
    metric: string;
    index: number;
}

function ProblemSolutionCard({ problem, solution, metric, index }: ProblemSolutionCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <Card className="group p-8 bg-white border border-black/[0.08] hover:border-black/[0.15] hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden relative">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-neutral-50/30 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                    {/* Problem side */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/[0.05] group-hover:bg-black/[0.08] flex items-center justify-center transition-colors duration-300">
                                <X
                                    className="w-4 h-4 text-black/40"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div>
                                <div className="text-[11px] text-black/40 font-semibold uppercase tracking-wider mb-2">
                                    Avant
                                </div>
                                <p className="text-[15px] text-black/70 leading-[1.6]">
                                    {problem}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-black to-black/90 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500">
                                <ArrowRight className="w-6 h-6 text-white" strokeWidth={2} />
                            </div>
                            {/* Sparkle decoration */}
                            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <Sparkles className="w-4 h-4 text-black/40" strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    {/* Solution side */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black group-hover:bg-black/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                <Check
                                    className="w-4 h-4 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[11px] text-black/40 font-semibold uppercase tracking-wider mb-2">
                                        Avec MyProPartner
                                    </div>
                                    <p className="text-[15px] text-black leading-[1.6] font-medium">
                                        {solution}
                                    </p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
                                    <Sparkles className="w-3 h-3" strokeWidth={2} />
                                    <span className="text-[12px] font-medium">
                                        {metric}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export function ProblemsSolutions() {
    const problems = [
        {
            problem: "Fichiers Excel partout, documents perdus, informations éparpillées",
            solution: "Tout centralisé au même endroit. Clients, devis, factures, stocks accessible en 1 clic.",
            metric: "90% de temps de recherche en moins"
        },
        {
            problem: "Devis qui prennent 30 minutes à créer, erreurs de calcul fréquentes",
            solution: "Création de devis en moins de 2 minutes avec calculs automatiques et templates personnalisables.",
            metric: "3x plus rapide"
        },
        {
            problem: "Stock non suivi, ruptures imprévues, commandes en retard",
            solution: "Suivi en temps réel avec alertes automatiques. Ne manquez plus jamais de stock.",
            metric: "Zéro rupture de stock"
        },
        {
            problem: "Factures impayées oubliées, relances manuelles chronophages",
            solution: "Relances automatiques par email et suivi des paiements en temps réel.",
            metric: "Paiement 40% plus rapide"
        },
    ];

    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1120px] mx-auto relative">
                <div className="text-center space-y-5 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <X className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Terminé les problèmes quotidiens
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Arrêtez de perdre du temps
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Les problèmes quotidiens que rencontrent les artisans et PME.{" "}
                        <span className="text-black font-medium">Et comment MyProPartner les résout définitivement.</span>
                    </p>
                </div>

                <div className="space-y-6">
                    {problems.map((item, index) => (
                        <ProblemSolutionCard
                            key={index}
                            problem={item.problem}
                            solution={item.solution}
                            metric={item.metric}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <p className="text-[15px] text-black/40">
                        Et ce n&apos;est qu&apos;un aperçu. <span className="text-black/60 font-medium">Découvrez tout ce que vous pouvez automatiser.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

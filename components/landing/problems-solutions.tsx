"use client";

import { Card } from "@/components/ui/card";
import { AlertCircle, Check } from "lucide-react";

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
        <section className="py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-5 mb-20">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Arrêtez de perdre du temps
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Les problèmes quotidiens que rencontrent les artisans et PME.
                        Et comment MyProPartner les résout définitivement.
                    </p>
                </div>

                <div className="space-y-6">
                    {problems.map((item, index) => (
                        <Card
                            key={index}
                            className="p-8 bg-white border border-black/[0.08] hover:border-black/[0.12] transition-all duration-300"
                        >
                            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle
                                            className="w-5 h-5 text-black/40 mt-0.5 flex-shrink-0"
                                            strokeWidth={2}
                                        />
                                        <div>
                                            <p className="text-[15px] text-black/60 leading-[1.6]">
                                                {item.problem}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Check
                                            className="w-5 h-5 text-black mt-0.5 flex-shrink-0"
                                            strokeWidth={2}
                                        />
                                        <div className="space-y-2">
                                            <p className="text-[15px] text-black leading-[1.6] font-medium">
                                                {item.solution}
                                            </p>
                                            <div className="inline-flex px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.08]">
                                                <span className="text-[12px] text-black/60 font-medium">
                                                    {item.metric}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

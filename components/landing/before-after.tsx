"use client";

import { Card } from "@/components/ui/card";
import { X, Check } from "lucide-react";

export function BeforeAfter() {
    const comparisons = [
        {
            before: "30 min pour créer un devis sur Excel",
            after: "2 min avec MyProPartner",
            metric: "15x plus rapide"
        },
        {
            before: "Fichiers éparpillés sur 3 ordinateurs",
            after: "Tout centralisé, accessible partout",
            metric: "100% organisé"
        },
        {
            before: "Oubli de relances clients = paiements tardifs",
            after: "Relances automatiques par email",
            metric: "Paiement 40% plus rapide"
        },
        {
            before: "Ruptures de stock non détectées",
            after: "Alertes temps réel avant rupture",
            metric: "Zéro rupture"
        },
        {
            before: "Pas de visibilité sur le CA",
            after: "Dashboard avec analytics en temps réel",
            metric: "Vision claire 24/7"
        },
        {
            before: "15h/semaine sur tâches administratives",
            after: "5h/semaine avec automatisations",
            metric: "10h économisées"
        },
    ];

    return (
        <section className="py-32 px-6 sm:px-8 bg-neutral-50">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-5 mb-20">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Avant / Après MyProPartner
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Découvrez comment MyProPartner transforme radicalement
                        la gestion quotidienne de votre entreprise
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-8 bg-white border border-black/[0.08]">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <X className="w-5 h-5 text-red-600" strokeWidth={2} />
                                </div>
                                <h3 className="text-[24px] font-semibold text-black tracking-[-0.01em]">
                                    Sans MyProPartner
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {comparisons.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 rounded-lg bg-red-500/[0.03] border border-red-500/10"
                                    >
                                        <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                        <p className="text-[14px] text-black/70 leading-[1.5]">
                                            {item.before}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8 bg-white border border-black/[0.08] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
                        <div className="relative space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" strokeWidth={2} />
                                </div>
                                <h3 className="text-[24px] font-semibold text-black tracking-[-0.01em]">
                                    Avec MyProPartner
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {comparisons.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 rounded-lg bg-green-500/[0.03] border border-green-500/10"
                                    >
                                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[14px] text-black/70 leading-[1.5]">
                                                {item.after}
                                            </p>
                                            <div className="inline-flex px-2 py-0.5 rounded-full bg-green-500/10">
                                                <span className="text-[11px] text-green-700 font-medium">
                                                    {item.metric}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="mt-12 text-center">
                    <Card className="inline-flex items-center gap-3 p-6 bg-black border-none">
                        <div className="text-left">
                            <p className="text-[20px] font-semibold text-white mb-1">
                                Prêt à transformer votre gestion ?
                            </p>
                            <p className="text-[14px] text-white/60">
                                Essayez MyProPartner gratuitement pendant 14 jours
                            </p>
                        </div>
                        <a
                            href="/auth/register"
                            className="px-8 py-3 rounded-lg bg-white text-black text-[14px] font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
                        >
                            Démarrer maintenant
                        </a>
                    </Card>
                </div>
            </div>
        </section>
    );
}

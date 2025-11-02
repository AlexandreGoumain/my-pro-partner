"use client";

import { Card } from "@/components/ui/card";
import { Calculator, Download, FileText, Send, Zap } from "lucide-react";

export function FeatureInvoicing() {
    const features = [
        {
            icon: Zap,
            title: "Création ultra-rapide",
            description:
                "Créez des devis professionnels en moins de 2 minutes avec templates personnalisables",
        },
        {
            icon: Calculator,
            title: "Calculs automatiques",
            description:
                "TVA, remises, totaux calculés automatiquement. Zéro erreur de calcul.",
        },
        {
            icon: Send,
            title: "Envoi instantané",
            description:
                "Envoyez vos devis et factures par email directement depuis l'application",
        },
        {
            icon: Download,
            title: "PDF professionnel",
            description:
                "Générez des documents PDF personnalisés aux couleurs de votre entreprise",
        },
    ];

    return (
        <section className="py-32 px-6 sm:px-8 bg-neutral-50">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="space-y-5">
                            <div className="inline-flex px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    Devis & Factures
                                </span>
                            </div>
                            <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                                Créez des devis en quelques clics
                            </h2>
                            <p className="text-[19px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                                Fini les fichiers Excel compliqués et les
                                erreurs de calcul. Créez des devis et factures
                                professionnels en un temps record.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-5 rounded-xl bg-white border border-black/[0.08] hover:border-black/[0.12] transition-all duration-300"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-black/[0.03] flex items-center justify-center">
                                            <Icon
                                                className="w-5 h-5 text-black"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[16px] font-semibold text-black tracking-[-0.01em]">
                                                {feature.title}
                                            </h3>
                                            <p className="text-[14px] text-black/60 leading-[1.5]">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Conversion devis → facture en 1 clic
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Numérotation automatique
                                </span>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.08]">
                                <span className="text-[13px] text-black/60 font-medium">
                                    ✓ Relances automatiques
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-[32px] blur-3xl translate-y-8" />
                        <Card className="relative p-8 bg-white border border-black/[0.08] shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                                            <FileText
                                                className="w-5 h-5 text-white"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-semibold text-black">
                                                Devis #2024-001
                                            </h4>
                                            <p className="text-[13px] text-black/40">
                                                Client: Entreprise ABC
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                        <span className="text-[12px] text-green-700 font-medium">
                                            Accepté
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-3 border-b border-black/[0.05]">
                                        <span className="text-[14px] text-black/60">
                                            Prestation 1
                                        </span>
                                        <span className="text-[14px] text-black font-medium">
                                            450,00 €
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-black/[0.05]">
                                        <span className="text-[14px] text-black/60">
                                            Prestation 2
                                        </span>
                                        <span className="text-[14px] text-black font-medium">
                                            320,00 €
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-black/[0.05]">
                                        <span className="text-[14px] text-black/60">
                                            Remise (10%)
                                        </span>
                                        <span className="text-[14px] text-red-600 font-medium">
                                            -77,00 €
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2 border-t border-black/[0.08]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] text-black/60">
                                            Sous-total HT
                                        </span>
                                        <span className="text-[14px] text-black">
                                            693,00 €
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] text-black/60">
                                            TVA (20%)
                                        </span>
                                        <span className="text-[14px] text-black">
                                            138,60 €
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-black/[0.08]">
                                        <span className="text-[16px] text-black font-semibold">
                                            Total TTC
                                        </span>
                                        <span className="text-[24px] text-black font-semibold">
                                            831,60 €
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button className="flex-1 h-10 px-4 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-black/90 transition-colors">
                                        Convertir en facture
                                    </button>
                                    <button className="h-10 px-4 rounded-lg border border-black/[0.08] text-[13px] font-medium hover:bg-black/5 transition-colors">
                                        PDF
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

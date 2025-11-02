"use client";

import { Card } from "@/components/ui/card";
import { Check, Info, X } from "lucide-react";
import { useState } from "react";

const features = [
    {
        category: "Gestion Clients",
        items: [
            {
                name: "Nombre de clients",
                starter: "50",
                pro: "Illimité",
                enterprise: "Illimité",
            },
            {
                name: "Fiches clients détaillées",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Historique complet",
                starter: "12 mois",
                pro: "Illimité",
                enterprise: "Illimité",
            },
            {
                name: "Import Excel/CSV",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Segmentation clients",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Tags personnalisés",
                starter: false,
                pro: true,
                enterprise: true,
            },
        ],
    },
    {
        category: "Devis & Factures",
        items: [
            {
                name: "Devis illimités",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Factures illimitées",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Templates personnalisables",
                starter: "3 modèles",
                pro: "Illimité",
                enterprise: "Illimité",
            },
            {
                name: "Conversion devis → facture",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Numérotation automatique",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Calculs automatiques TVA",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Envoi par email",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Relances automatiques",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Acomptes & paiements partiels",
                starter: false,
                pro: true,
                enterprise: true,
            },
        ],
    },
    {
        category: "Catalogue & Stock",
        items: [
            {
                name: "Produits au catalogue",
                starter: "100",
                pro: "Illimité",
                enterprise: "Illimité",
            },
            {
                name: "Gestion des stocks",
                starter: "Basique",
                pro: "Avancée",
                enterprise: "Avancée",
            },
            {
                name: "Alertes de stock bas",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Historique des mouvements",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Multi-emplacements",
                starter: false,
                pro: false,
                enterprise: true,
            },
            {
                name: "Scan codes-barres",
                starter: false,
                pro: true,
                enterprise: true,
            },
        ],
    },
    {
        category: "Collaboration & Utilisateurs",
        items: [
            {
                name: "Nombre d'utilisateurs",
                starter: "1",
                pro: "3",
                enterprise: "Illimité",
            },
            {
                name: "Rôles & permissions",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Historique des actions",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Partage de documents",
                starter: false,
                pro: true,
                enterprise: true,
            },
        ],
    },
    {
        category: "Analytics & Rapports",
        items: [
            {
                name: "Dashboard de base",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Graphiques CA",
                starter: "Basique",
                pro: "Avancé",
                enterprise: "Avancé",
            },
            {
                name: "Rapports personnalisés",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Export Excel",
                starter: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Export comptable",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Prévisions & tendances",
                starter: false,
                pro: false,
                enterprise: true,
            },
        ],
    },
    {
        category: "Automatisation",
        items: [
            {
                name: "Relances paiements automatiques",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Workflows personnalisés",
                starter: false,
                pro: false,
                enterprise: true,
            },
            {
                name: "Intégrations tierces",
                starter: false,
                pro: "Limitées",
                enterprise: "Complètes",
            },
            { name: "API", starter: false, pro: false, enterprise: true },
        ],
    },
    {
        category: "Support & Services",
        items: [
            {
                name: "Support par email",
                starter: "24-48h",
                pro: "4-8h",
                enterprise: "24/7",
            },
            {
                name: "Support prioritaire",
                starter: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Gestionnaire de compte dédié",
                starter: false,
                pro: false,
                enterprise: true,
            },
            {
                name: "Formation personnalisée",
                starter: false,
                pro: false,
                enterprise: true,
            },
            {
                name: "Audit de sécurité",
                starter: false,
                pro: false,
                enterprise: true,
            },
            {
                name: "SLA garanti",
                starter: false,
                pro: false,
                enterprise: "99.9%",
            },
        ],
    },
];

export function PricingComparison() {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set()
    );
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = {
        starter: {
            name: "Démarrage",
            monthlyPrice: 29,
            annualPrice: 24,
        },
        pro: {
            name: "Professionnel",
            monthlyPrice: 59,
            annualPrice: 49,
        },
        enterprise: {
            name: "Entreprise",
            monthlyPrice: 149,
            annualPrice: 129,
        },
    };

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const renderFeatureValue = (value: boolean | string) => {
        if (typeof value === "boolean") {
            return value ? (
                <Check
                    className="w-4 h-4 text-black mx-auto"
                    strokeWidth={2.5}
                />
            ) : (
                <X className="w-4 h-4 text-black/20 mx-auto" strokeWidth={2} />
            );
        }
        return (
            <span className="text-[13px] text-black/70 font-medium">
                {value}
            </span>
        );
    };

    return (
        <section className="py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center space-y-5 mb-16">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Comparez les fonctionnalités
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Tableau détaillé de toutes les fonctionnalités incluses
                        dans chaque plan
                    </p>

                    {/* Annual/Monthly Toggle */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`text-[15px] font-medium transition-colors ${
                                !isAnnual ? "text-black" : "text-black/40"
                            }`}
                        >
                            Mensuel
                        </button>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative inline-flex h-7 w-12 items-center rounded-full bg-black transition-colors"
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    isAnnual ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`text-[15px] font-medium transition-colors flex items-center gap-2 ${
                                isAnnual ? "text-black" : "text-black/40"
                            }`}
                        >
                            Annuel
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 text-[12px] font-semibold">
                                -17%
                            </span>
                        </button>
                    </div>
                </div>

                <Card className="overflow-hidden border border-black/[0.08]">
                    {/* Header */}
                    <div className="grid grid-cols-4 gap-4 p-6 bg-neutral-50 border-b border-black/[0.08]">
                        <div className="text-[15px] font-semibold text-black">
                            Fonctionnalités
                        </div>
                        <div className="text-center">
                            <div className="text-[15px] font-semibold text-black">
                                {plans.starter.name}
                            </div>
                            <div className="text-[13px] text-black/40 mt-1">
                                {isAnnual
                                    ? plans.starter.annualPrice
                                    : plans.starter.monthlyPrice}
                                €/mois
                            </div>
                            {isAnnual && (
                                <div className="text-[11px] text-black/30 mt-0.5">
                                    Facturé {plans.starter.annualPrice * 12}€/an
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <div className="text-[15px] font-semibold text-black">
                                {plans.pro.name}
                            </div>
                            <div className="text-[13px] text-black/40 mt-1">
                                {isAnnual
                                    ? plans.pro.annualPrice
                                    : plans.pro.monthlyPrice}
                                €/mois
                            </div>
                            {isAnnual && (
                                <div className="text-[11px] text-black/30 mt-0.5">
                                    Facturé {plans.pro.annualPrice * 12}€/an
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <div className="text-[15px] font-semibold text-black">
                                {plans.enterprise.name}
                            </div>
                            <div className="text-[13px] text-black/40 mt-1">
                                {isAnnual
                                    ? plans.enterprise.annualPrice
                                    : plans.enterprise.monthlyPrice}
                                €/mois
                            </div>
                            {isAnnual && (
                                <div className="text-[11px] text-black/30 mt-0.5">
                                    Facturé {plans.enterprise.annualPrice * 12}
                                    €/an
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    {features.map((section, sectionIndex) => (
                        <div
                            key={sectionIndex}
                            className="border-b border-black/[0.08] last:border-b-0"
                        >
                            <button
                                onClick={() => toggleCategory(section.category)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
                            >
                                <h3 className="text-[16px] font-semibold text-black">
                                    {section.category}
                                </h3>
                                <Info
                                    className="w-4 h-4 text-black/40"
                                    strokeWidth={2}
                                />
                            </button>

                            <div className="divide-y divide-black/[0.05]">
                                {section.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-neutral-50/30 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <span className="text-[14px] text-black/70">
                                                {item.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {renderFeatureValue(item.starter)}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {renderFeatureValue(item.pro)}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {renderFeatureValue(
                                                item.enterprise
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Card>

                <div className="mt-12 text-center">
                    <p className="text-[14px] text-black/60">
                        Vous avez besoin d&apos;une fonctionnalité spécifique ?{" "}
                        <a
                            href="/contact"
                            className="text-black font-medium hover:underline"
                        >
                            Contactez-nous
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}

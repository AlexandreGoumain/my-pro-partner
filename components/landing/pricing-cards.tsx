"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
    {
        name: "Starter",
        description: "Parfait pour débuter",
        monthlyPrice: 29,
        yearlyPrice: 290,
        features: [
            "Jusqu'à 50 clients",
            "Devis & factures illimités",
            "Catalogue de 100 produits",
            "Suivi des stocks basique",
            "Support email",
            "1 utilisateur",
        ],
        cta: "Commencer",
        popular: false,
    },
    {
        name: "Pro",
        description: "Pour les entreprises en croissance",
        monthlyPrice: 79,
        yearlyPrice: 790,
        features: [
            "Clients illimités",
            "Devis & factures illimités",
            "Catalogue illimité",
            "Suivi des stocks avancé",
            "Support prioritaire",
            "5 utilisateurs",
            "Automatisations",
            "Exports & rapports",
        ],
        cta: "Commencer",
        popular: true,
    },
    {
        name: "Entreprise",
        description: "Pour les grandes équipes",
        monthlyPrice: null,
        yearlyPrice: null,
        features: [
            "Tout du plan Pro",
            "Utilisateurs illimités",
            "API complète",
            "Support dédié 24/7",
            "Formation personnalisée",
            "Intégrations sur mesure",
            "SLA garanti",
        ],
        cta: "Nous contacter",
        popular: false,
    },
];

export function PricingCards() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Des tarifs simples et transparents
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choisissez le plan qui correspond à vos besoins. Sans engagement.
                    </p>

                    {/* Toggle monthly/yearly */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <span className={!isYearly ? "font-semibold" : "text-muted-foreground"}>
                            Mensuel
                        </span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    isYearly ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                        </button>
                        <span className={isYearly ? "font-semibold" : "text-muted-foreground"}>
                            Annuel
                            <Badge variant="secondary" className="ml-2">
                                -17%
                            </Badge>
                        </span>
                    </div>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative flex flex-col ${
                                plan.popular
                                    ? "border-2 border-primary shadow-xl scale-105"
                                    : "border-border"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        Le plus populaire
                                    </Badge>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription className="text-base">{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-grow space-y-6">
                                <div>
                                    {plan.monthlyPrice ? (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold">
                                                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}€
                                            </span>
                                            <span className="text-muted-foreground">
                                                /{isYearly ? "an" : "mois"}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-4xl font-bold">Sur devis</div>
                                    )}
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    asChild
                                    className={`w-full ${
                                        plan.popular
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            : ""
                                    }`}
                                    variant={plan.popular ? "default" : "outline"}
                                >
                                    <Link href={plan.monthlyPrice ? "/auth/register" : "#contact"}>
                                        {plan.cta}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Additional info */}
                <div className="text-center mt-12 text-sm text-muted-foreground">
                    <p>Tous les plans incluent 14 jours d&apos;essai gratuit. Sans carte bancaire.</p>
                </div>
            </div>
        </section>
    );
}

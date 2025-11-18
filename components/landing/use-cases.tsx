"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Wrench,
    ShoppingBag,
    Coffee,
    Briefcase,
    ArrowRight,
    TrendingUp,
    Clock,
    DollarSign,
} from "lucide-react";
import Link from "next/link";

interface UseCase {
    icon: React.ElementType;
    industry: string;
    persona: string;
    location: string;
    problem: string;
    solution: string;
    results: {
        metric: string;
        value: string;
        icon: React.ElementType;
    }[];
    quote: string;
    author: string;
}

const useCases: UseCase[] = [
    {
        icon: Wrench,
        industry: "Plomberie",
        persona: "Jean-Marc",
        location: "Lyon",
        problem:
            "Passait 15h/semaine sur l'administratif. Perdait des devis dans Excel. Oubliait de relancer les impayés.",
        solution:
            "Devis créés sur chantier en 2 min sur mobile. Conversion en facture automatique. Relances impayés auto.",
        results: [
            { metric: "Temps admin", value: "-18h/sem", icon: Clock },
            { metric: "Taux conversion", value: "+45%", icon: TrendingUp },
            { metric: "CA récupéré", value: "+8 200€", icon: DollarSign },
        ],
        quote:
            "J'ai récupéré 2 jours complets par semaine. Je peux enfin me concentrer sur mes chantiers au lieu de faire du papier.",
        author: "Jean-Marc, Plomberie Dubois",
    },
    {
        icon: Coffee,
        industry: "Boulangerie",
        persona: "Sophie",
        location: "Bordeaux",
        problem:
            "Gestion stock farines/levures à la main. Pas de programme fidélité. Perte de temps en caisse aux heures de pointe.",
        solution:
            "Stock suivi en temps réel avec alertes. Programme fidélité automatique. POS tactile ultra-rapide avec Stripe Terminal.",
        results: [
            { metric: "Clients fidèles", value: "+120%", icon: TrendingUp },
            { metric: "Temps caisse", value: "-60%", icon: Clock },
            { metric: "CA mensuel", value: "+22%", icon: DollarSign },
        ],
        quote:
            "Mes clients adorent gagner des points. Et moi je ne perds plus jamais de vente parce qu'il manque de farine !",
        author: "Sophie, Boulangerie du Coin",
    },
    {
        icon: ShoppingBag,
        industry: "Commerce",
        persona: "Antoine",
        location: "Paris",
        problem:
            "3 magasins, stock désynchronisé. Erreurs de transferts. Analytics inexistants. Impossible de savoir quel produit marche.",
        solution:
            "Stock centralisé sur 3 magasins. Transferts validés en temps réel. Analytics par magasin et produit avec prédictions IA.",
        results: [
            { metric: "Erreurs stock", value: "-95%", icon: TrendingUp },
            { metric: "Marge dégagée", value: "+18%", icon: DollarSign },
            { metric: "Vue complète", value: "3 magasins", icon: Clock },
        ],
        quote:
            "Je pilote mes 3 boutiques depuis mon téléphone. L'IA me dit quels produits réapprovisionner avant même que je manque.",
        author: "Antoine, Chaîne de prêt-à-porter",
    },
    {
        icon: Briefcase,
        industry: "Consulting",
        persona: "Marie",
        location: "Toulouse",
        problem:
            "Facturation manuelle chronophage. Suivi clients dans plusieurs fichiers Excel. Relances impayés oubliées. Pas de vue d'ensemble.",
        solution:
            "Facturation automatique depuis les projets. CRM centralisé avec historique complet. Relances auto avec templates personnalisés. Dashboard temps réel.",
        results: [
            { metric: "Temps facturation", value: "-85%", icon: Clock },
            { metric: "Délais paiement", value: "-40%", icon: TrendingUp },
            { metric: "CA annuel", value: "+35%", icon: DollarSign },
        ],
        quote:
            "Avant je passais 1 journée par semaine à facturer et relancer. Maintenant tout est automatique, je peux prendre plus de clients.",
        author: "Marie, Cabinet de conseil RH",
    },
];

export function UseCases() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </div>

            <div className="max-w-[1400px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <TrendingUp className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Histoires de réussite
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Ils ont transformé
                        <br />
                        <span className="text-black/60">leur entreprise.</span>
                    </h2>

                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Découvrez comment des artisans et entrepreneurs comme vous ont gagné du temps,
                        augmenté leur CA et simplifié leur quotidien.
                    </p>
                </div>

                {/* Use Cases Grid */}
                <div className="space-y-8">
                    {useCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <Card
                                key={index}
                                className="p-8 lg:p-10 bg-white border-black/[0.08] hover:border-black/[0.15] hover:shadow-xl transition-all duration-300"
                            >
                                <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-8 lg:gap-12 items-start">
                                    {/* Left: Context */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 rounded-2xl bg-black/[0.03] border border-black/[0.08]">
                                                <Icon className="w-6 h-6 text-black" strokeWidth={2} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-[20px] font-semibold text-black">
                                                        {useCase.persona}
                                                    </h3>
                                                    <span className="text-[13px] text-black/40">•</span>
                                                    <span className="text-[13px] text-black/60">
                                                        {useCase.location}
                                                    </span>
                                                </div>
                                                <p className="text-[14px] text-black/60 font-medium">
                                                    {useCase.industry}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[12px] font-semibold text-black/40 uppercase tracking-wider mb-2">
                                                    Avant MyProPartner
                                                </p>
                                                <p className="text-[15px] text-black/70 leading-[1.6]">
                                                    {useCase.problem}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-semibold text-black/40 uppercase tracking-wider mb-2">
                                                    Avec MyProPartner
                                                </p>
                                                <p className="text-[15px] text-black leading-[1.6]">
                                                    {useCase.solution}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Separator */}
                                    <div className="hidden lg:block w-px h-full bg-black/[0.08]" />

                                    {/* Right: Results & Quote */}
                                    <div className="space-y-6">
                                        {/* Results */}
                                        <div className="space-y-3">
                                            <p className="text-[12px] font-semibold text-black/40 uppercase tracking-wider">
                                                Résultats
                                            </p>
                                            <div className="space-y-3">
                                                {useCase.results.map((result, i) => {
                                                    const ResultIcon = result.icon;
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="flex items-center justify-between p-4 rounded-xl bg-black/[0.02] border border-black/[0.06]"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <ResultIcon
                                                                    className="w-4 h-4 text-black/60"
                                                                    strokeWidth={2}
                                                                />
                                                                <span className="text-[14px] text-black/70">
                                                                    {result.metric}
                                                                </span>
                                                            </div>
                                                            <span className="text-[18px] font-semibold text-black">
                                                                {result.value}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Quote */}
                                        <div className="p-5 rounded-xl bg-gradient-to-br from-black via-black to-black/90 text-white">
                                            <p className="text-[15px] leading-[1.7] mb-4 italic">
                                                "{useCase.quote}"
                                            </p>
                                            <p className="text-[13px] text-white/70 font-medium">
                                                — {useCase.author}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-block space-y-4">
                        <p className="text-[17px] text-black/80 font-medium">
                            Prêt à transformer votre entreprise ?
                        </p>
                        <Link href="/auth/register">
                            <Button className="bg-black hover:bg-black/90 text-white h-12 px-8 text-[15px] font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                                Commencer gratuitement
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <p className="text-[13px] text-black/50">
                            14 jours gratuits • Sans carte bancaire • Installation en 2 min
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

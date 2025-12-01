"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ArrowRight,
    Briefcase,
    Building2,
    Camera,
    Car,
    Coffee,
    Dumbbell,
    Flower2,
    GraduationCap,
    Hammer,
    Heart,
    Home,
    Laptop,
    Palette,
    Scissors,
    Shirt,
    Sparkles,
    UtensilsCrossed,
    Wrench,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const businessTypes = [
    {
        id: "plumber",
        name: "Plombier",
        icon: Wrench,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Gérez vos interventions comme un pro",
        features: [
            "Suivi interventions",
            "Devis rapides",
            "Stock pièces",
            "Planning techniciens",
        ],
        metric: "+40% d'interventions",
    },
    {
        id: "hairdresser",
        name: "Coiffeur",
        icon: Scissors,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Un salon qui tourne sans stress",
        features: [
            "Réservations en ligne",
            "Gestion rendez-vous",
            "Fidélité clients",
            "Suivi stock produits",
        ],
        metric: "+35% de réservations",
    },
    {
        id: "carpenter",
        name: "Menuisier",
        icon: Hammer,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Créez sans perdre de temps",
        features: [
            "Devis sur-mesure",
            "Suivi chantiers",
            "Gestion matériaux",
            "Photos projets",
        ],
        metric: "+50% de projets",
    },
    {
        id: "painter",
        name: "Peintre",
        icon: Palette,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Plus de chantiers, moins d'admin",
        features: [
            "Calcul surfaces",
            "Devis automatiques",
            "Photos avant/après",
            "Planning chantiers",
        ],
        metric: "+45% de chantiers",
    },
    {
        id: "it-repair",
        name: "Réparation IT",
        icon: Laptop,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Réparez plus, gérez moins",
        features: [
            "Suivi réparations",
            "Diagnostic rapide",
            "Stock composants",
            "Garanties automatiques",
        ],
        metric: "+60% de réparations",
    },
    {
        id: "mechanic",
        name: "Garagiste",
        icon: Car,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Un garage qui carbure",
        features: [
            "Carnet entretien",
            "Suivi véhicules",
            "Stock pièces",
            "Alertes révisions",
        ],
        metric: "+40% de rendez-vous",
    },
    {
        id: "restaurant",
        name: "Restaurant",
        icon: UtensilsCrossed,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Concentrez-vous sur vos clients",
        features: [
            "Gestion tables",
            "Commandes rapides",
            "Stock ingredients",
            "Menu digital",
        ],
        metric: "+30% de couverts",
    },
    {
        id: "cafe",
        name: "Café / Bar",
        icon: Coffee,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Servez plus, comptez moins",
        features: [
            "Caisse tactile",
            "Gestion stock",
            "Fidélité clients",
            "Happy hours",
        ],
        metric: "+25% de CA",
    },
    {
        id: "architect",
        name: "Architecte",
        icon: Building2,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Gérez vos projets avec clarté",
        features: [
            "Suivi projets",
            "Devis détaillés",
            "Photos chantiers",
            "Documents clients",
        ],
        metric: "+35% de projets",
    },
    {
        id: "health",
        name: "Professionnel santé",
        icon: Heart,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Plus de temps pour vos patients",
        features: [
            "Agenda patients",
            "Dossiers médicaux",
            "Rappels RDV",
            "Téléconsultation",
        ],
        metric: "+50% de patients",
    },
    {
        id: "trainer",
        name: "Coach sportif",
        icon: Dumbbell,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Entraînez plus, gérez moins",
        features: [
            "Planning séances",
            "Suivi progression",
            "Programmes perso",
            "Paiements en ligne",
        ],
        metric: "+40% de clients",
    },
    {
        id: "teacher",
        name: "Cours particuliers",
        icon: GraduationCap,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Enseignez sereinement",
        features: [
            "Planning cours",
            "Suivi élèves",
            "Factures auto",
            "Supports pédagogiques",
        ],
        metric: "+45% d'élèves",
    },
    {
        id: "consultant",
        name: "Consultant",
        icon: Briefcase,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Focalisez sur vos missions",
        features: [
            "Gestion projets",
            "Time tracking",
            "Facturation automatique",
            "Rapports clients",
        ],
        metric: "+55% de missions",
    },
    {
        id: "photographer",
        name: "Photographe",
        icon: Camera,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Capturez sans contraintes",
        features: [
            "Galeries clients",
            "Devis shootings",
            "Planning séances",
            "Contrats automatiques",
        ],
        metric: "+50% de shootings",
    },
    {
        id: "fashion",
        name: "Boutique vêtements",
        icon: Shirt,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Vendez sans compter",
        features: [
            "Caisse tactile",
            "Stock multi-tailles",
            "Fidélité clients",
            "Ventes privées",
        ],
        metric: "+30% de ventes",
    },
    {
        id: "real-estate",
        name: "Agence immobilière",
        icon: Home,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Vendez plus de biens",
        features: [
            "Gestion biens",
            "Visites virtuelles",
            "Documents automatiques",
            "Suivi prospects",
        ],
        metric: "+40% de ventes",
    },
    {
        id: "florist",
        name: "Fleuriste",
        icon: Flower2,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Fleurissez votre business",
        features: [
            "Commandes en ligne",
            "Stock fleurs",
            "Livraisons planifiées",
            "Occasions spéciales",
        ],
        metric: "+35% de commandes",
    },
    {
        id: "electrician",
        name: "Électricien",
        icon: Sparkles,
        color: "from-black/[0.02] to-black/[0.05]",
        iconColor: "text-black/70",
        headline: "Électrisez votre productivité",
        features: [
            "Suivi interventions",
            "Devis conformes",
            "Stock matériel",
            "Certifications",
        ],
        metric: "+45% d'interventions",
    },
];

export function BusinessSelector() {
    const [selectedBusiness, setSelectedBusiness] = useState(businessTypes[0]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleBusinessChange = (business: (typeof businessTypes)[0]) => {
        if (business.id === selectedBusiness.id) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setSelectedBusiness(business);
            setIsTransitioning(false);
        }, 150);
    };

    const SelectedIcon = selectedBusiness.icon;

    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/30 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Sparkles
                            className="w-4 h-4 text-black/60"
                            strokeWidth={2}
                        />
                        <span className="text-[13px] text-black/60 font-medium">
                            Adapté à votre métier
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Fait pour votre métier
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Sélectionnez votre secteur d'activité et découvrez
                        comment MyProPartner s'adapte à vos besoins
                    </p>
                </div>

                {/* Business Type Selector - Grid layout */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {businessTypes.map((business) => {
                            const Icon = business.icon;
                            const isSelected =
                                business.id === selectedBusiness.id;

                            return (
                                <button
                                    key={business.id}
                                    onClick={() =>
                                        handleBusinessChange(business)
                                    }
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap ${
                                        isSelected
                                            ? "bg-black text-white shadow-lg scale-105"
                                            : "bg-white border border-black/[0.08] text-black/60 hover:text-black hover:border-black/[0.15] hover:bg-black/[0.02]"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" strokeWidth={2} />
                                    <span className="text-[13px] font-medium">
                                        {business.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Business Content */}
                <div
                    className={`transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
                >
                    <Card className="p-10 bg-white border-black/[0.08] shadow-xl shadow-black/5 overflow-hidden relative">
                        {/* Animated background gradient */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${selectedBusiness.color} opacity-50 transition-all duration-500`}
                        />

                        <div className="relative grid lg:grid-cols-[1fr,auto] gap-10 items-center">
                            {/* Left: Content */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`inline-flex p-4 rounded-2xl bg-white border border-black/[0.08] shadow-sm`}
                                    >
                                        <SelectedIcon
                                            className={`w-8 h-8 ${selectedBusiness.iconColor}`}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-[13px] text-black/40 font-semibold uppercase tracking-wide mb-1">
                                            {selectedBusiness.name}
                                        </div>
                                        <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-black leading-tight">
                                            {selectedBusiness.headline}
                                        </h3>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                    {selectedBusiness.features.map(
                                        (feature, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-3 rounded-lg bg-white/80 border border-black/[0.06]"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
                                                <span className="text-[14px] text-black/70 font-medium">
                                                    {feature}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Metric Badge */}
                                <div className="flex items-center gap-3 pt-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white shadow-md">
                                        <Sparkles
                                            className="w-4 h-4"
                                            strokeWidth={2}
                                        />
                                        <span className="text-[13px] font-semibold">
                                            {selectedBusiness.metric}
                                        </span>
                                    </div>
                                    <span className="text-[13px] text-black/40">
                                        objectif réaliste pour votre entreprise
                                    </span>
                                </div>

                                {/* CTA */}
                                <div className="pt-4">
                                    <Link href="/waitlist">
                                        <Button className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm group">
                                            Rejoindre la liste d&apos;attente
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Visual */}
                            <div className="hidden lg:block">
                                <div className="relative w-64 h-64">
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${selectedBusiness.color} rounded-3xl rotate-6 transition-all duration-500`}
                                    />
                                    <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl shadow-black/10 flex items-center justify-center">
                                        <SelectedIcon
                                            className={`w-32 h-32 ${selectedBusiness.iconColor} opacity-20`}
                                            strokeWidth={1}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Bottom text */}
                <div className="mt-12 text-center">
                    <p className="text-[14px] text-black/40">
                        Plus de 18 secteurs d&apos;activité supportés •{" "}
                        <span className="text-black/60 font-medium">
                            Templates et workflows adaptés à chaque métier
                        </span>
                    </p>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import {
    Wrench,
    Scissors,
    UtensilsCrossed,
    Hammer,
    Paintbrush,
    Zap,
    Car,
    Flower2,
    Camera,
    Building2,
    GraduationCap,
    ShoppingBag,
} from "lucide-react";

const businessTypes = [
    {
        id: "plombier",
        icon: Wrench,
        name: "Plombier",
        tagline: "Devis chantier en 30 secondes",
        features: ["Calcul auto des fournitures", "Gestion interventions", "Stock camionnette"],
    },
    {
        id: "coiffeur",
        icon: Scissors,
        name: "Coiffeur",
        tagline: "Gérez votre salon sans effort",
        features: ["Prise de RDV en ligne", "Fidélité clients", "Caisse tactile"],
    },
    {
        id: "restaurant",
        icon: UtensilsCrossed,
        name: "Restaurant",
        tagline: "Service fluide, gestion simple",
        features: ["Gestion des tables", "Commandes cuisine", "Tickets de caisse"],
    },
    {
        id: "menuisier",
        icon: Hammer,
        name: "Menuisier",
        tagline: "Du devis à la facture en 2 clics",
        features: ["Devis détaillés", "Suivi chantiers", "Gestion stock bois"],
    },
    {
        id: "peintre",
        icon: Paintbrush,
        name: "Peintre",
        tagline: "Estimez vos chantiers précisément",
        features: ["Calcul surfaces", "Catalogue peintures", "Planning équipe"],
    },
    {
        id: "electricien",
        icon: Zap,
        name: "Électricien",
        tagline: "Conformité et traçabilité",
        features: ["Attestations conformité", "Stock matériel", "Urgences 24/7"],
    },
    {
        id: "garagiste",
        icon: Car,
        name: "Garagiste",
        tagline: "Atelier organisé, clients satisfaits",
        features: ["OR digitaux", "Historique véhicules", "Pièces détachées"],
    },
    {
        id: "fleuriste",
        icon: Flower2,
        name: "Fleuriste",
        tagline: "Ventes et commandes simplifiées",
        features: ["Commandes événements", "Stock périssable", "Livraisons"],
    },
    {
        id: "photographe",
        icon: Camera,
        name: "Photographe",
        tagline: "Focus sur votre art",
        features: ["Galeries clients", "Devis prestations", "Contrats auto"],
    },
    {
        id: "immobilier",
        icon: Building2,
        name: "Immobilier",
        tagline: "Gestion locative intelligente",
        features: ["Baux & quittances", "Rappels loyers", "État des lieux"],
    },
    {
        id: "formation",
        icon: GraduationCap,
        name: "Formation",
        tagline: "Gérez vos sessions facilement",
        features: ["Inscriptions", "Conventions", "Suivi présences"],
    },
    {
        id: "commerce",
        icon: ShoppingBag,
        name: "Commerce",
        tagline: "Vendez plus, gérez moins",
        features: ["Caisse tactile", "Gestion stocks", "Programme fidélité"],
    },
];

export function BusinessTypes() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
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

    // Auto-rotate
    useEffect(() => {
        if (!isVisible || isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % businessTypes.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [isVisible, isPaused]);

    const activeBusiness = businessTypes[activeIndex];
    const ActiveIcon = activeBusiness.icon;

    return (
        <section ref={ref} className="py-32 px-6 sm:px-8 bg-neutral-50 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-black/[0.03] to-transparent rounded-full" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-16 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                        Adapté à votre métier
                    </p>
                    <h2 className="text-[44px] sm:text-[56px] font-bold tracking-[-0.03em] text-black leading-[1.1]">
                        Conçu pour vous.
                        <br />
                        <span className="text-black/40">Pas pour tout le monde.</span>
                    </h2>
                    <p className="text-[17px] text-black/50 max-w-[500px] mx-auto">
                        Des templates et fonctionnalités spécifiques à votre secteur d&apos;activité.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Business selector */}
                    <div
                        className={`transition-all duration-700 ${
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                        }`}
                    >
                        <div
                            className="grid grid-cols-4 sm:grid-cols-6 gap-3"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            {businessTypes.map((business, i) => {
                                const Icon = business.icon;
                                const isActive = i === activeIndex;

                                return (
                                    <button
                                        key={business.id}
                                        onClick={() => setActiveIndex(i)}
                                        className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                                            isActive
                                                ? "bg-black border-black text-white scale-105 shadow-lg"
                                                : "bg-white border-black/[0.06] text-black/60 hover:border-black/20 hover:bg-black/[0.02]"
                                        }`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 mx-auto transition-transform duration-300 ${
                                                isActive ? "" : "group-hover:scale-110"
                                            }`}
                                            strokeWidth={1.5}
                                        />
                                        <p
                                            className={`text-[10px] font-medium mt-2 text-center truncate ${
                                                isActive ? "text-white" : "text-black/50"
                                            }`}
                                        >
                                            {business.name}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Active business details */}
                    <div
                        className={`transition-all duration-700 delay-200 ${
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                        }`}
                    >
                        <div className="relative p-8 rounded-2xl bg-white border border-black/[0.06] shadow-xl">
                            {/* Icon & Title */}
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center flex-shrink-0">
                                    <ActiveIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-[28px] font-bold text-black tracking-tight">
                                        {activeBusiness.name}
                                    </h3>
                                    <p className="text-[15px] text-black/50 mt-1">
                                        {activeBusiness.tagline}
                                    </p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <p className="text-[12px] font-semibold text-black/40 uppercase tracking-wide">
                                    Fonctionnalités incluses
                                </p>
                                <div className="grid gap-2">
                                    {activeBusiness.features.map((feature, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-black/[0.04]"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                                            <span className="text-[14px] text-black/70 font-medium">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA hint */}
                            <div className="mt-6 pt-6 border-t border-black/[0.06]">
                                <p className="text-[13px] text-black/40">
                                    + 50 fonctionnalités communes à tous les métiers
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom text */}
                <div
                    className={`mt-16 text-center transition-all duration-700 delay-300 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[15px] text-black/40">
                        Votre métier n&apos;est pas listé ?{" "}
                        <span className="text-black font-medium">
                            MyProPartner s&apos;adapte à toute activité.
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}

"use client";

import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
    name: string;
    role: string;
    company: string;
    quote: string;
    rating: number;
    avatar: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Thomas Martin",
        role: "Gérant",
        company: "Plomberie Martin & Fils",
        quote:
            "MyProPartner a transformé ma façon de travailler. Je crée mes devis sur chantier en 2 minutes, je facture en 1 clic. J'ai récupéré 2 jours par semaine !",
        rating: 5,
        avatar: "TM",
    },
    {
        name: "Sophie Dubois",
        role: "Propriétaire",
        company: "Boulangerie du Coin",
        quote:
            "Le programme de fidélité a boosté mes ventes de 22% ! Mes clients adorent gagner des points. Et le stock en temps réel, c'est magique.",
        rating: 5,
        avatar: "SD",
    },
    {
        name: "Antoine Lefebvre",
        role: "Directeur",
        company: "Chaîne de boutiques Mode",
        quote:
            "Gérer 3 magasins n'a jamais été aussi simple. Les transferts de stock sont instantanés, et l'IA me dit exactement quoi réapprovisionner.",
        rating: 5,
        avatar: "AL",
    },
    {
        name: "Marie Rousseau",
        role: "Consultante",
        company: "Cabinet RH Solutions",
        quote:
            "La facturation automatique et les relances m'ont fait gagner 85% de temps. Je peux maintenant prendre 3x plus de clients. ROI incroyable.",
        rating: 5,
        avatar: "MR",
    },
    {
        name: "Pierre Blanchard",
        role: "Gérant",
        company: "Électricité Blanchard",
        quote:
            "L'assistant IA répond à toutes mes questions. 'Quels chantiers sont en retard ?' Réponse en 2 secondes. Je ne peux plus m'en passer.",
        rating: 5,
        avatar: "PB",
    },
    {
        name: "Isabelle Moreau",
        role: "Propriétaire",
        company: "Salon de Coiffure Belle Époque",
        quote:
            "Interface magnifique et hyper intuitive. Même mes employés les moins à l'aise avec l'informatique l'utilisent sans problème. Bravo !",
        rating: 5,
        avatar: "IM",
    },
];

export function SocialProof() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1400px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Star className="w-4 h-4 text-black/60 fill-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            4.9/5 étoiles • 500+ avis
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Ils nous font confiance.
                        <br />
                        <span className="text-black/60">Et ils adorent.</span>
                    </h2>

                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Plus de 500 entreprises utilisent MyProPartner au quotidien pour gérer leur
                        activité. Découvrez ce qu'ils en pensent.
                    </p>
                </div>

                {/* Rating Summary */}
                <div className="mb-12">
                    <Card className="max-w-[600px] mx-auto p-8 bg-gradient-to-br from-black via-black to-black/90 border-black text-white text-center">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-7 h-7 text-yellow-400 fill-yellow-400"
                                        strokeWidth={2}
                                    />
                                ))}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[42px] font-semibold tracking-[-0.02em]">
                                    4.9/5
                                </p>
                                <p className="text-[15px] text-white/70">
                                    Basé sur 500+ avis vérifiés
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[13px] font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <span>98% recommandent</span>
                                </div>
                                <div className="w-px h-4 bg-white/20" />
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span>500+ clients actifs</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="p-6 bg-white border-black/[0.08] hover:border-black/[0.15] hover:shadow-lg transition-all duration-300"
                        >
                            <div className="space-y-4">
                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 text-black fill-black"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <div className="relative">
                                    <Quote className="absolute -top-1 -left-1 w-6 h-6 text-black/10" />
                                    <p className="text-[15px] text-black/80 leading-[1.6] pl-6">
                                        {testimonial.quote}
                                    </p>
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-2 border-t border-black/[0.06]">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-black/[0.06] flex items-center justify-center">
                                        <span className="text-[14px] font-semibold text-black">
                                            {testimonial.avatar}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-semibold text-black truncate">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-[12px] text-black/50 truncate">
                                            {testimonial.role} • {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Bottom Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-8 text-[14px] text-black/60">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>98% de satisfaction</span>
                    </div>
                    <div className="w-px h-4 bg-black/10" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Temps de réponse moyen: 2h</span>
                    </div>
                    <div className="w-px h-4 bg-black/10" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Support 7j/7</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Marie Dupont",
        role: "Plombière",
        company: "Dupont Plomberie",
        content: "MyProPartner a transformé ma gestion quotidienne. Je crée mes devis en 2 minutes là où j'en passais 30 avant. Un gain de temps incroyable !",
        rating: 5,
        initials: "MD",
    },
    {
        name: "Thomas Martin",
        role: "Électricien",
        company: "Martin Électricité",
        content: "Interface intuitive, support réactif, et surtout pensé pour les artisans. Enfin un logiciel qui ne me prend pas la tête !",
        rating: 5,
        initials: "TM",
    },
    {
        name: "Sophie Bernard",
        role: "Gérante",
        company: "Bernard Menuiserie",
        content: "Le suivi des stocks et des factures impayées nous a fait économiser des milliers d'euros. Je recommande à tous mes confrères !",
        rating: 5,
        initials: "SB",
    },
    {
        name: "Pierre Dubois",
        role: "Artisan peintre",
        company: "Dubois Déco",
        content: "J'ai testé 3 autres solutions avant MyProPartner. C'est de loin la plus simple et la plus complète. Excellent rapport qualité-prix.",
        rating: 5,
        initials: "PD",
    },
    {
        name: "Julie Rousseau",
        role: "Coiffeuse",
        company: "Salon Julie",
        content: "Mes clientes apprécient les factures professionnelles. L'application est rapide, jamais de bugs. Je gagne un temps fou sur la compta !",
        rating: 5,
        initials: "JR",
    },
    {
        name: "Laurent Petit",
        role: "Maçon",
        company: "Petit Maçonnerie",
        content: "Passage de devis en facture en un clic, c'est magique ! Plus d'erreurs de calcul, tout est automatisé. Je ne peux plus m'en passer.",
        rating: 5,
        initials: "LP",
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Ils nous font confiance
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Découvrez ce que nos utilisateurs disent de MyProPartner
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                        >
                            <CardContent className="pt-6 space-y-4">
                                {/* Rating */}
                                <div className="flex gap-1">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    &quot;{testimonial.content}&quot;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-2">
                                    <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600">
                                        <AvatarFallback className="bg-transparent text-white font-semibold">
                                            {testimonial.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-sm">{testimonial.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {testimonial.role} - {testimonial.company}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

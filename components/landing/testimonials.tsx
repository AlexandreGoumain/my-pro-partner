"use client";

import { Card } from "@/components/ui/card";
import { Star, Quote, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    metric?: string;
    image?: string;
    businessType: string;
}

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Marc Dubois",
        role: "Gérant",
        company: "Plomberie Dubois",
        businessType: "Plombier",
        content: "J'ai gagné 15 heures par semaine en administratif. L'assistant IA répond à toutes mes questions instantanément. Je peux enfin me concentrer sur mes chantiers.",
        rating: 5,
        metric: "+40% d'interventions"
    },
    {
        id: "2",
        name: "Sophie Martin",
        role: "Propriétaire",
        company: "Salon Élégance",
        businessType: "Coiffeuse",
        content: "Mes clientes réservent en ligne, les stocks sont gérés automatiquement, et le programme de fidélité a boosté mon CA de 30%. C'est magique !",
        rating: 5,
        metric: "+30% de CA"
    },
    {
        id: "3",
        name: "Thomas Lefebvre",
        role: "Artisan",
        company: "Menuiserie Lefebvre",
        businessType: "Menuisier",
        content: "Plus besoin de passer des heures sur les devis. En 2 minutes, j'ai un devis professionnel avec photos, calculs automatiques, et envoi direct au client.",
        rating: 5,
        metric: "3x plus rapide"
    },
    {
        id: "4",
        name: "Julie Rousseau",
        role: "Gérante",
        company: "Tech Repair Pro",
        businessType: "Réparation IT",
        content: "Le suivi des réparations est tellement simple. Mes clients reçoivent des updates automatiques, et je n'ai plus jamais perdu une pièce dans mon stock.",
        rating: 5,
        metric: "+60% de réparations"
    },
    {
        id: "5",
        name: "Pierre Durand",
        role: "Chef d'entreprise",
        company: "Garage Durand",
        businessType: "Garagiste",
        content: "Les relances automatiques de factures ont tout changé. Je suis payé 40% plus vite, et je n'ai plus à courir après mes clients.",
        rating: 5,
        metric: "Paiement 40% plus rapide"
    },
    {
        id: "6",
        name: "Isabelle Moreau",
        role: "Restauratrice",
        company: "Bistrot du Coin",
        businessType: "Restaurant",
        content: "La gestion des tables et des commandes est ultra-fluide. Mon équipe gagne un temps fou, et mes clients adorent pouvoir réserver en ligne.",
        rating: 5,
        metric: "+25% de couverts"
    }
];

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <Card className="group p-8 bg-white border border-black/[0.08] hover:border-black/[0.15] hover:shadow-xl hover:shadow-black/5 transition-all duration-500 h-full flex flex-col">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-4 h-4 fill-black text-black"
                            strokeWidth={0}
                        />
                    ))}
                </div>

                {/* Quote Icon */}
                <div className="mb-4">
                    <Quote className="w-8 h-8 text-black/10 group-hover:text-black/20 transition-colors" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <blockquote className="text-[15px] text-black/70 leading-[1.6] mb-6 flex-1">
                    "{testimonial.content}"
                </blockquote>

                {/* Metric Badge */}
                {testimonial.metric && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06] mb-6 self-start">
                        <Sparkles className="w-3 h-3 text-black/60" strokeWidth={2} />
                        <span className="text-[12px] font-medium text-black/70">
                            {testimonial.metric}
                        </span>
                    </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-black/[0.06]">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-black/[0.05] to-black/[0.1] flex items-center justify-center">
                        <span className="text-[16px] font-semibold text-black/60">
                            {testimonial.name.charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold text-black truncate">
                            {testimonial.name}
                        </div>
                        <div className="text-[12px] text-black/50 truncate">
                            {testimonial.role} • {testimonial.company}
                        </div>
                        <div className="text-[11px] text-black/40 truncate">
                            {testimonial.businessType}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export function Testimonials() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/30 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Star className="w-4 h-4 text-black/60 fill-black/60" strokeWidth={0} />
                        <span className="text-[13px] text-black/60 font-medium">
                            4.9/5 sur 500+ avis vérifiés
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Ils ont transformé leur business
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Découvrez comment des artisans et entrepreneurs comme vous ont gagné du temps et augmenté leur chiffre d'affaires
                    </p>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {[
                        { value: "500+", label: "Entreprises actives" },
                        { value: "4.9/5", label: "Note moyenne" },
                        { value: "15h", label: "Gagnées par semaine" },
                        { value: "98%", label: "Taux de satisfaction" }
                    ].map((stat, index) => (
                        <Card
                            key={index}
                            className="p-6 text-center bg-white border-black/[0.08] hover:border-black/[0.15] hover:shadow-lg transition-all duration-300"
                        >
                            <div className="text-[32px] font-semibold text-black tracking-[-0.02em] mb-1">
                                {stat.value}
                            </div>
                            <div className="text-[13px] text-black/50 font-medium">
                                {stat.label}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <Card className="inline-block p-6 bg-gradient-to-br from-black via-black to-black/90 border-black text-white">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5" strokeWidth={2} />
                                    <span className="text-[16px] font-semibold">
                                        Rejoignez-les dès aujourd'hui
                                    </span>
                                </div>
                                <p className="text-[13px] text-white/60">
                                    14 jours gratuits • Sans carte bancaire
                                </p>
                            </div>
                            <ArrowRight className="w-5 h-5 hidden sm:block" strokeWidth={2} />
                            <div className="text-[13px] text-white/80 font-medium">
                                +50 nouvelles inscriptions cette semaine
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

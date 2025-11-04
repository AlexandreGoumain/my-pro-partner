"use client";

import { Download, Zap, Rocket, Check, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface StepCardProps {
    step: {
        icon: React.ElementType;
        number: string;
        title: string;
        description: string;
        details: string[];
        time: string;
    };
    index: number;
    totalSteps: number;
}

function StepCard({ step, index, totalSteps }: StepCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const Icon = step.icon;

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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative transition-all duration-700 ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Connecting line */}
            {index < totalSteps - 1 && (
                <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-black/[0.15] to-black/[0.05] z-0">
                    <div
                        className={`h-full bg-gradient-to-r from-black to-black/80 origin-left transition-transform duration-1000 ${
                            isVisible ? "scale-x-100" : "scale-x-0"
                        }`}
                        style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                    />
                </div>
            )}

            <div className="relative text-center space-y-6 group">
                {/* Icon container */}
                <div className="relative inline-block">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-black to-black/90 text-white shadow-lg shadow-black/20 transition-all duration-500 ${
                        isHovered ? "scale-110 shadow-xl shadow-black/30" : ""
                    }`}>
                        <Icon className="w-10 h-10 transition-transform duration-500" strokeWidth={2} />
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white border-2 border-black/[0.08] flex items-center justify-center shadow-md">
                        <span className="text-[13px] font-bold text-black">
                            {step.number}
                        </span>
                    </div>

                    {/* Pulse effect on hover */}
                    {isHovered && (
                        <div className="absolute inset-0 rounded-2xl bg-black/20 animate-ping" />
                    )}
                </div>

                <div className="space-y-5 px-4">
                    {/* Title and time */}
                    <div className="space-y-3">
                        <h3 className="text-[22px] font-semibold text-black tracking-[-0.01em]">
                            {step.title}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.08] group-hover:bg-black/[0.06] transition-colors duration-300">
                            <Clock className="w-3.5 h-3.5 text-black/60" strokeWidth={2} />
                            <span className="text-[12px] text-black/60 font-medium">
                                {step.time}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-[15px] text-black/60 leading-[1.6] max-w-[320px] mx-auto">
                        {step.description}
                    </p>

                    {/* Details checklist */}
                    <div className="space-y-2.5 pt-3">
                        {step.details.map((detail, detailIndex) => (
                            <div
                                key={detailIndex}
                                className={`flex items-center gap-3 justify-center transition-all duration-500 ${
                                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                }`}
                                style={{ transitionDelay: `${(index * 150) + (detailIndex * 100) + 300}ms` }}
                            >
                                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-black/[0.08] group-hover:bg-black flex items-center justify-center transition-colors duration-300">
                                    <Check className="w-2.5 h-2.5 text-black/60 group-hover:text-white transition-colors duration-300" strokeWidth={3} />
                                </div>
                                <span className="text-[13px] text-black/50 font-medium">{detail}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function HowItWorks() {
    const steps = [
        {
            icon: Download,
            number: "01",
            title: "Créez votre compte",
            description:
                "Inscription en 2 minutes. Renseignez les informations de votre entreprise.",
            details: ["Email + mot de passe", "Informations entreprise", "Aucune carte requise"],
            time: "2 min"
        },
        {
            icon: Zap,
            number: "02",
            title: "Configurez votre espace",
            description:
                "Importez vos clients et produits. Personnalisez vos templates de factures.",
            details: ["Import Excel/CSV", "Templates personnalisés", "Logo et couleurs"],
            time: "5 min"
        },
        {
            icon: Rocket,
            number: "03",
            title: "Lancez-vous",
            description:
                "Créez votre premier devis, gérez vos stocks, suivez vos paiements.",
            details: ["Premier devis", "Gestion stocks", "Dashboard activé"],
            time: "Immédiat"
        },
    ];

    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/30 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1120px] mx-auto relative">
                <div className="text-center space-y-5 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Rocket className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Simple et rapide
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Démarrez en quelques minutes
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[640px] mx-auto leading-[1.5]">
                        Pas de configuration compliquée. <span className="text-black font-medium">Commencez à gérer votre entreprise immédiatement.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
                    {steps.map((step, index) => (
                        <StepCard
                            key={index}
                            step={step}
                            index={index}
                            totalSteps={steps.length}
                        />
                    ))}
                </div>

                {/* Bottom summary */}
                <div className="mt-20 text-center space-y-4">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white shadow-lg">
                        <Zap className="w-4 h-4" strokeWidth={2} />
                        <span className="text-[14px] font-medium">
                            Temps total de démarrage : ~7 minutes
                        </span>
                    </div>
                    <p className="text-[14px] text-black/40">
                        La plupart de nos utilisateurs créent leur premier devis en moins de 10 minutes
                    </p>
                </div>
            </div>
        </section>
    );
}

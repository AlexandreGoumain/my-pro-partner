"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Sparkles, Rocket } from "lucide-react";

const steps = [
    {
        icon: MessageSquare,
        number: "01",
        title: "Parlez naturellement",
        description: "Demandez ce dont vous avez besoin comme vous le diriez à un assistant. Pas de menus, pas de clics.",
        example: '"Fais-moi un devis pour M. Dupont"',
    },
    {
        icon: Sparkles,
        number: "02",
        title: "L'IA comprend et agit",
        description: "Notre assistant analyse votre demande, accède à vos données et exécute l'action en quelques secondes.",
        example: "Devis créé, prêt à envoyer",
    },
    {
        icon: Rocket,
        number: "03",
        title: "C'est fait",
        description: "Document créé, email envoyé, données mises à jour. Vous n'avez rien d'autre à faire.",
        example: "Temps total : 1.2 secondes",
    },
];

export function HowItWorksPremium() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
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

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <section
            ref={ref}
            id="demo"
            className="py-32 px-6 sm:px-8 bg-black text-white relative overflow-hidden"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-20 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-white/40 uppercase tracking-widest">
                        Simple comme bonjour
                    </p>
                    <h2 className="text-[44px] sm:text-[56px] font-bold tracking-[-0.03em] leading-[1.1]">
                        Comment ça marche
                    </h2>
                </div>

                {/* Steps */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        const isActive = i === activeStep;

                        return (
                            <div
                                key={i}
                                onClick={() => setActiveStep(i)}
                                className={`relative p-8 rounded-2xl border cursor-pointer transition-all duration-500 ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                } ${
                                    isActive
                                        ? "bg-white/[0.08] border-white/20"
                                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                                }`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {/* Number */}
                                <div
                                    className={`absolute -top-4 -left-2 text-[80px] font-bold leading-none transition-colors duration-300 ${
                                        isActive ? "text-white/10" : "text-white/[0.03]"
                                    }`}
                                >
                                    {step.number}
                                </div>

                                {/* Content */}
                                <div className="relative space-y-4">
                                    {/* Icon */}
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                            isActive ? "bg-white text-black" : "bg-white/10 text-white"
                                        }`}
                                    >
                                        <Icon className="w-6 h-6" strokeWidth={2} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-[22px] font-semibold tracking-tight">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[15px] text-white/60 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Example */}
                                    <div
                                        className={`pt-4 border-t transition-colors duration-300 ${
                                            isActive ? "border-white/20" : "border-white/[0.06]"
                                        }`}
                                    >
                                        <p
                                            className={`text-[14px] font-medium transition-colors duration-300 ${
                                                isActive ? "text-white" : "text-white/40"
                                            }`}
                                        >
                                            {step.example}
                                        </p>
                                    </div>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-8 right-8 h-1 bg-white rounded-full" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Progress indicators */}
                <div className="flex justify-center gap-3 mt-12">
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveStep(i)}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                i === activeStep ? "w-12 bg-white" : "w-4 bg-white/20"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

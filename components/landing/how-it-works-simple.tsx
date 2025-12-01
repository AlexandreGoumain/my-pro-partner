"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
    {
        number: "1",
        title: "Inscrivez-vous",
        description: "Créez votre compte en 2 minutes. Aucune carte bancaire requise.",
    },
    {
        number: "2",
        title: "Parlez à l'IA",
        description: "Demandez ce dont vous avez besoin. L'assistant comprend le langage naturel.",
    },
    {
        number: "3",
        title: "C'est fait",
        description: "Devis créés, factures envoyées, relances programmées. Automatiquement.",
    },
];

export function HowItWorksSimple() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="py-24 px-6 sm:px-8 bg-neutral-50/50">
            <div className="max-w-[900px] mx-auto">
                {/* Header */}
                <div className="text-center space-y-4 mb-16">
                    <p className="text-[13px] font-semibold text-black/50 uppercase tracking-wide">
                        Simple comme bonjour
                    </p>
                    <h2 className="text-[40px] sm:text-[48px] font-bold tracking-[-0.02em] text-black leading-[1.1]">
                        Opérationnel en 2 minutes
                    </h2>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-6 top-12 bottom-12 w-px bg-black/10 hidden md:block" />

                    <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`relative transition-all duration-700 ${
                                    isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <div className="flex md:flex-col items-start gap-4 md:gap-5">
                                    {/* Number */}
                                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                        <span className="text-[18px] font-bold text-white">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 md:text-center">
                                        <h3 className="text-[18px] font-semibold text-black mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-[14px] text-black/60 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

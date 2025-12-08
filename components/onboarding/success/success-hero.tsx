"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessHeroProps {
    title: string;
    subtitle: string;
    className?: string;
}

/**
 * Hero section avec animation d'apparition élégante
 */
export function SuccessHero({ title, subtitle, className }: SuccessHeroProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={cn(
                "text-center space-y-4 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                className
            )}
        >
            {/* Icône animée */}
            <div className="flex justify-center">
                <div
                    className={cn(
                        "relative h-20 w-20 rounded-full bg-black flex items-center justify-center",
                        "transition-all duration-500 delay-200",
                        isVisible ? "scale-100" : "scale-0"
                    )}
                >
                    <CheckCircle2
                        className="h-10 w-10 text-white"
                        strokeWidth={2}
                    />
                    {/* Cercle d'animation */}
                    <div
                        className={cn(
                            "absolute inset-0 rounded-full border-2 border-black/20",
                            "animate-ping-slow"
                        )}
                    />
                </div>
            </div>

            {/* Titre */}
            <h1
                className={cn(
                    "text-[32px] font-semibold tracking-[-0.02em] text-black",
                    "transition-all duration-500 delay-300",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
            >
                {title}
            </h1>

            {/* Sous-titre */}
            <p
                className={cn(
                    "text-[16px] text-black/50 max-w-md mx-auto",
                    "transition-all duration-500 delay-400",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                )}
            >
                {subtitle}
            </p>

            <style jsx>{`
                @keyframes ping-slow {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
}

"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface WelcomeHeroProps {
    userName: string;
    lastUpdated?: Date;
    className?: string;
}

/**
 * Get time-based greeting in French
 */
function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Bonjour";
    } else if (hour >= 12 && hour < 18) {
        return "Bon après-midi";
    } else {
        return "Bonsoir";
    }
}

/**
 * Welcome hero section with personalized greeting and last update time
 */
export function WelcomeHero({
    userName,
    lastUpdated,
    className,
}: WelcomeHeroProps) {
    const greeting = getGreeting();

    const lastUpdatedText = lastUpdated
        ? `Mis à jour ${formatDistanceToNow(lastUpdated, {
              locale: fr,
              addSuffix: true,
          })}`
        : null;

    return (
        <div
            className={cn(
                "animate-in fade-in slide-in-from-bottom-2 duration-500",
                className
            )}
        >
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                {greeting}, {userName} !
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <p className="text-[14px] text-black/40">
                    Voici un aperçu de votre espace
                </p>
                {lastUpdatedText && (
                    <>
                        <span className="text-black/20">·</span>
                        <p className="text-[13px] text-black/30">
                            {lastUpdatedText}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

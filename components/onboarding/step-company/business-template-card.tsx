"use client";

import { cn } from "@/lib/utils";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { Check } from "lucide-react";
import {
    Building2,
    Wrench,
    Zap,
    Flame,
    Hammer,
    Paintbrush,
    HardHat,
    UtensilsCrossed,
    Croissant,
    Scissors,
    Sparkles,
    Dumbbell,
    Car,
    Monitor,
    Briefcase,
    ShoppingCart,
    Home,
    Heart,
    Scale,
    Calculator,
    Landmark,
    type LucideIcon,
} from "lucide-react";

interface BusinessTemplateCardProps {
    template: BusinessTemplate;
    isSelected: boolean;
    onSelect: () => void;
}

/**
 * Mapping des noms d'icônes vers les composants Lucide
 */
const iconComponents: Record<string, LucideIcon> = {
    Building2,
    Wrench,
    Zap,
    Flame,
    Hammer,
    PaintbrushIcon: Paintbrush,
    HardHat,
    UtensilsCrossed,
    Croissant,
    Scissors,
    Sparkles,
    Dumbbell,
    Car,
    Monitor,
    BriefcaseIcon: Briefcase,
    ShoppingCart,
    Home,
    Heart,
    Scale,
    Calculator,
    Landmark,
};

/**
 * Card de sélection de business type.
 * Design minimaliste avec icônes Lucide.
 */
export function BusinessTemplateCard({
    template,
    isSelected,
    onSelect,
}: BusinessTemplateCardProps) {
    const IconComponent = iconComponents[template.icon] || Building2;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "group relative flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                isSelected
                    ? "border-black bg-black/[0.02] shadow-sm"
                    : "border-black/10 hover:border-black/20 hover:bg-black/[0.01]"
            )}
        >
            {/* Icône */}
            <div
                className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                    isSelected ? "bg-black text-white" : "bg-black/5 text-black/60"
                )}
            >
                <IconComponent className="h-6 w-6" strokeWidth={1.5} />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
                <h3
                    className={cn(
                        "text-[15px] font-medium truncate transition-colors",
                        isSelected ? "text-black" : "text-black/80"
                    )}
                >
                    {template.label}
                </h3>
                <p className="text-[13px] text-black/40 truncate mt-0.5">
                    {template.description}
                </p>
            </div>

            {/* Checkmark */}
            <div
                className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                    isSelected
                        ? "bg-black text-white"
                        : "border border-black/10 bg-white"
                )}
            >
                {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </div>
        </button>
    );
}

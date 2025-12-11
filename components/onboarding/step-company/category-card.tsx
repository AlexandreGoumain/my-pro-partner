"use client";

import type { BusinessCategory } from "@/lib/config/business-categories";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
    category: BusinessCategory;
    isSelected?: boolean;
    onClick: () => void;
}

/**
 * Card de catégorie pour le flow conversationnel.
 * Design premium avec icône, gradient subtil et animation au hover.
 */
export function CategoryCard({
    category,
    isSelected,
    onClick,
}: CategoryCardProps) {
    const Icon = category.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group relative w-full overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300",
                "hover:shadow-sm hover:-translate-y-0.5",
                isSelected
                    ? "border-black bg-black text-white shadow-xl scale-[1.02]"
                    : "border-black/10 bg-white hover:border-black/20"
            )}
        >
            {/* Gradient background on hover */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300",
                    !isSelected && "group-hover:opacity-100"
                )}
                style={{
                    background: `linear-gradient(135deg, ${category.color}08 0%, ${category.color}03 100%)`,
                }}
            />

            <div className="relative flex items-center gap-4">
                {/* Icon container */}
                <div
                    className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                        isSelected
                            ? "bg-white/20"
                            : "bg-black/[0.03] group-hover:scale-110"
                    )}
                    style={{
                        backgroundColor: isSelected
                            ? "rgba(255,255,255,0.2)"
                            : `${category.color}10`,
                    }}
                >
                    <Icon
                        className={cn(
                            "h-7 w-7 transition-colors duration-300",
                            isSelected ? "text-white" : "text-black/70"
                        )}
                        style={{
                            color: isSelected ? "white" : category.color,
                        }}
                        strokeWidth={1.5}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3
                        className={cn(
                            "text-[17px] font-semibold tracking-[-0.01em] transition-colors",
                            isSelected ? "text-white" : "text-black"
                        )}
                    >
                        {category.label}
                    </h3>
                    <p
                        className={cn(
                            "text-[14px] mt-0.5 transition-colors",
                            isSelected ? "text-white/70" : "text-black/50"
                        )}
                    >
                        {category.description}
                    </p>
                </div>

                {/* Arrow */}
                <ChevronRight
                    className={cn(
                        "h-5 w-5 shrink-0 transition-all duration-300",
                        isSelected
                            ? "text-white translate-x-0 opacity-100"
                            : "text-black/30 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )}
                    strokeWidth={2}
                />
            </div>
        </button>
    );
}

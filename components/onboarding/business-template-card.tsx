"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { Check } from "lucide-react";

interface BusinessTemplateCardProps {
  template: BusinessTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

export function BusinessTemplateCard({
  template,
  isSelected,
  onSelect,
}: BusinessTemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative group w-full text-left rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        isSelected
          ? "border-black bg-black/5 shadow-md"
          : "border-black/10 bg-white hover:border-black/30"
      )}
    >
      {/* Badge de sélection */}
      {isSelected && (
        <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-black flex items-center justify-center">
          <Check className="h-4 w-4 text-white" strokeWidth={3} />
        </div>
      )}

      {/* Icône et contenu */}
      <div className="space-y-3">
        {/* Icône avec fond coloré */}
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-lg text-white text-xl font-bold"
          style={{ backgroundColor: template.color }}
        >
          {template.icon === "Building2" && "🏢"}
          {template.icon === "Wrench" && "🔧"}
          {template.icon === "Zap" && "⚡"}
          {template.icon === "Flame" && "🔥"}
          {template.icon === "Hammer" && "🔨"}
          {template.icon === "PaintbrushIcon" && "🎨"}
          {template.icon === "HardHat" && "👷"}
          {template.icon === "UtensilsCrossed" && "🍽️"}
          {template.icon === "Croissant" && "🥐"}
          {template.icon === "Scissors" && "✂️"}
          {template.icon === "Sparkles" && "✨"}
          {template.icon === "Dumbbell" && "💪"}
          {template.icon === "Car" && "🚗"}
          {template.icon === "Monitor" && "💻"}
          {template.icon === "BriefcaseIcon" && "💼"}
          {template.icon === "ShoppingCart" && "🛒"}
          {template.icon === "Home" && "🏠"}
          {template.icon === "Heart" && "❤️"}
          {template.icon === "Scale" && "⚖️"}
          {template.icon === "Calculator" && "🧮"}
        </div>

        {/* Titre et description */}
        <div>
          <h3 className="text-[16px] font-semibold text-black mb-1">
            {template.label}
          </h3>
          <p className="text-[13px] text-black/60 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Catégories incluses */}
        {template.categories && template.categories.length > 0 && (
          <div className="pt-2 border-t border-black/5">
            <p className="text-[12px] font-medium text-black/40 mb-2">
              Catégories incluses :
            </p>
            <div className="flex flex-wrap gap-1.5">
              {template.categories.slice(0, 3).map((cat, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 text-black/60"
                >
                  {cat.nom}
                </span>
              ))}
              {template.categories.length > 3 && (
                <span className="text-[11px] px-2 py-0.5 text-black/40">
                  +{template.categories.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

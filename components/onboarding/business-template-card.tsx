"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { Check, Sparkles } from "lucide-react";

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
  const iconMap: Record<string, string> = {
    Building2: "🏢", Wrench: "🔧", Zap: "⚡", Flame: "🔥",
    Hammer: "🔨", PaintbrushIcon: "🎨", HardHat: "👷",
    UtensilsCrossed: "🍽️", Croissant: "🥐", Scissors: "✂️",
    Sparkles: "✨", Dumbbell: "💪", Car: "🚗", Monitor: "💻",
    BriefcaseIcon: "💼", ShoppingCart: "🛒", Home: "🏠",
    Heart: "❤️", Scale: "⚖️", Calculator: "🧮",
  };

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        isSelected
          ? "ring-2 ring-primary shadow-md border-primary bg-primary/5"
          : "hover:border-primary/50"
      )}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <Check className="h-4 w-4" strokeWidth={3} />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl shadow-sm"
            style={{ backgroundColor: template.color }}
          >
            {iconMap[template.icon] || "🏢"}
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base leading-tight">
              {template.label}
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {template.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {template.categories && template.categories.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5">
            {template.categories.slice(0, 3).map((cat, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px] font-normal">
                {cat.nom}
              </Badge>
            ))}
            {template.categories.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{template.categories.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

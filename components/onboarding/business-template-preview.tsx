"use client";

import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { Check, Package, Star, FileText, Gift } from "lucide-react";

interface BusinessTemplatePreviewProps {
  template: BusinessTemplate;
}

export function BusinessTemplatePreview({
  template,
}: BusinessTemplatePreviewProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl text-white text-2xl shadow-sm"
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
        <div className="flex-1">
          <h3 className="text-[18px] font-semibold text-black mb-1">
            {template.label}
          </h3>
          <p className="text-[14px] text-black/60">{template.description}</p>
        </div>
      </div>

      {/* Ce que vous allez obtenir */}
      <div className="space-y-4">
        <h4 className="text-[14px] font-semibold text-black flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Ce qui sera configuré automatiquement
        </h4>

        {/* Catégories */}
        {template.categories && template.categories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px] text-black/70">
              <Package className="h-4 w-4" />
              <span className="font-medium">
                {template.categories.length} catégories de produits/services
              </span>
            </div>
            <div className="ml-6 space-y-1">
              {template.categories.map((cat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[12px]">
                  <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-black/80">{cat.nom}</span>
                    {cat.description && (
                      <span className="text-black/50"> - {cat.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Programme de fidélité */}
        {template.niveauxFidelite && template.niveauxFidelite.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px] text-black/70">
              <Star className="h-4 w-4" />
              <span className="font-medium">
                {template.niveauxFidelite.length} niveaux de fidélité
              </span>
            </div>
            <div className="ml-6 space-y-1">
              {template.niveauxFidelite.map((niveau, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[12px]">
                  <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-black/80">{niveau.nom}</span>
                    <span className="text-black/50">
                      {" "}
                      - {niveau.remise}% de remise dès {niveau.seuil}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Séries de documents */}
        {template.seriesDocuments && template.seriesDocuments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px] text-black/70">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Numérotation des documents</span>
            </div>
            <div className="ml-6 space-y-1">
              {template.seriesDocuments.map((serie, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[12px]">
                  <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-black/80">{serie.nom}</span>
                    <span className="text-black/50">
                      {" "}
                      - Format: {serie.format}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fonctionnalités spéciales */}
        {template.features && template.features.length > 0 && (
          <div className="mt-4 pt-4 border-t border-black/5">
            <p className="text-[12px] font-medium text-black/60 mb-2">
              Fonctionnalités incluses :
            </p>
            <div className="flex flex-wrap gap-2">
              {template.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-[12px] text-blue-900">
          💡 <strong>Bonne nouvelle :</strong> Vous pourrez toujours
          personnaliser ces paramètres plus tard dans les réglages de
          l&apos;application.
        </p>
      </div>
    </div>
  );
}

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { Check, Gift, Lightbulb, Package, Star, FileText } from "lucide-react";

interface BusinessTemplatePreviewProps {
  template: BusinessTemplate;
}

export function BusinessTemplatePreview({
  template,
}: BusinessTemplatePreviewProps) {
  const iconMap: Record<string, string> = {
    Building2: "🏢", Wrench: "🔧", Zap: "⚡", Flame: "🔥",
    Hammer: "🔨", PaintbrushIcon: "🎨", HardHat: "👷",
    UtensilsCrossed: "🍽️", Croissant: "🥐", Scissors: "✂️",
    Sparkles: "✨", Dumbbell: "💪", Car: "🚗", Monitor: "💻",
    BriefcaseIcon: "💼", ShoppingCart: "🛒", Home: "🏠",
    Heart: "❤️", Scale: "⚖️", Calculator: "🧮",
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl shadow-sm"
            style={{ backgroundColor: template.color }}
          >
            {iconMap[template.icon] || "🏢"}
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg">{template.label}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Gift className="h-4 w-4 text-primary" />
            Configuration automatique
          </div>
          <p className="text-xs text-muted-foreground">
            Tout sera prêt dès votre première connexion
          </p>
        </div>

        <Separator />

        {/* Catégories */}
        {template.categories && template.categories.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" />
              {template.categories.length} catégories
            </div>
            <div className="space-y-2">
              {template.categories.map((cat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">{cat.nom}</span>
                    {cat.description && (
                      <span className="text-muted-foreground"> - {cat.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Programme de fidélité */}
        {template.niveauxFidelite && template.niveauxFidelite.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Star className="h-4 w-4" />
                {template.niveauxFidelite.length} niveaux de fidélité
              </div>
              <div className="space-y-2">
                {template.niveauxFidelite.map((niveau, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">{niveau.nom}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        - {niveau.remise}% dès {niveau.seuil}€
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Séries de documents */}
        {template.seriesDocuments && template.seriesDocuments.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Numérotation
              </div>
              <div className="space-y-2">
                {template.seriesDocuments.map((serie, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium">{serie.nom}</span>
                      <span className="text-muted-foreground"> - {serie.format}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Fonctionnalités */}
        {template.features && template.features.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Fonctionnalités incluses
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px]">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Note */}
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Vous pourrez personnaliser ces paramètres à tout moment dans les réglages.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

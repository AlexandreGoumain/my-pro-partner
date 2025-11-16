/**
 * Composant pour gérer l'accès aux features selon le plan
 * Affiche un paywall si la feature n'est pas disponible
 */

import { ReactNode } from "react";
import { PlanFeatures, GLOBAL_FEATURE_FLAGS } from "@/lib/config/plans.config";
import { useFeature } from "@/hooks/use-plan";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";
import Link from "next/link";

interface FeatureGateProps {
  /** Feature du plan à vérifier */
  feature: keyof PlanFeatures;

  /** Feature flag global optionnel */
  globalFeature?: keyof typeof GLOBAL_FEATURE_FLAGS;

  /** Contenu à afficher si la feature est disponible */
  children: ReactNode;

  /** Message personnalisé pour le paywall */
  paywallMessage?: string;

  /** Titre personnalisé pour le paywall */
  paywallTitle?: string;

  /** Afficher le bouton "Upgrader" */
  showUpgradeButton?: boolean;

  /** Fallback personnalisé au lieu du paywall par défaut */
  fallback?: ReactNode;
}

export function FeatureGate({
  feature,
  globalFeature,
  children,
  paywallMessage,
  paywallTitle = "Fonctionnalité Premium",
  showUpgradeButton = true,
  fallback,
}: FeatureGateProps) {
  const isAvailable = useFeature(feature, globalFeature);

  if (isAvailable) {
    return <>{children}</>;
  }

  // Feature non disponible - afficher le paywall
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Alert className="max-w-md border-black/10">
        <Lock className="h-5 w-5 text-black/40" />
        <AlertTitle className="text-[16px] font-semibold tracking-[-0.01em]">
          {paywallTitle}
        </AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p className="text-[14px] text-black/60 leading-relaxed">
            {paywallMessage ||
              "Cette fonctionnalité n'est pas incluse dans votre plan actuel. Passez à un plan supérieur pour y accéder."}
          </p>

          {showUpgradeButton && (
            <Link href="/dashboard/pricing">
              <Button className="w-full h-10 bg-black hover:bg-black/90 text-white">
                <Zap className="h-4 w-4 mr-2" />
                Voir les plans
              </Button>
            </Link>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Composant inline pour masquer/afficher du contenu selon le plan
 */
interface FeatureCheckProps {
  feature: keyof PlanFeatures;
  globalFeature?: keyof typeof GLOBAL_FEATURE_FLAGS;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureCheck({
  feature,
  globalFeature,
  children,
  fallback = null,
}: FeatureCheckProps) {
  const isAvailable = useFeature(feature, globalFeature);

  if (isAvailable) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Badge pour indiquer qu'une feature est premium
 */
export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/5 border border-black/10 text-[11px] font-medium text-black/60 ${className || ""}`}
    >
      <Lock className="h-3 w-3" />
      Premium
    </span>
  );
}

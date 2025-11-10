"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanType, PLAN_PRICING } from "@/lib/pricing-config";
import { useSubscription } from "@/hooks/use-subscription";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetPlan: PlanType | null;
}

type IntervalType = "month" | "year";

/**
 * Dialog simplifié pour la gestion des abonnements
 *
 * - Nouveau abonnement (FREE → plan payant) : Stripe Checkout
 * - Changement de plan / Annulation : Redirect vers Billing Portal
 *
 * UX inspirée de Vercel, GitHub, Stripe
 */
export function PlanChangeDialog({
  open,
  onOpenChange,
  targetPlan,
}: PlanChangeDialogProps) {
  const { subscribe, loading } = useSubscription();
  const { canSubscribe } = useSubscriptionStatus();

  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [interval, setInterval] = useState<IntervalType>("month");

  if (!targetPlan) return null;

  const planInfo = PLAN_PRICING[targetPlan];
  const isNewSubscription = canSubscribe;

  // Prix selon l'interval sélectionné
  const displayPrice = interval === "year" && planInfo.annualPrice
    ? planInfo.annualPrice
    : planInfo.price;

  const handleNewSubscription = async () => {
    setError(null);

    try {
      // Nouveau abonnement → Redirect vers Stripe Checkout
      await subscribe(targetPlan, interval);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  const handleBillingPortal = async () => {
    setError(null);

    try {
      setPortalLoading(true);

      const response = await fetch("/api/subscription/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ouverture du portail");
      }

      // Rediriger vers le Billing Portal de Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL du portail manquante");
      }
    } catch (error: any) {
      console.error("[BILLING_PORTAL_ERROR]", error);
      toast.error(error.message || "Erreur lors de l'ouverture du portail");
      setPortalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-black/10 p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-8 pb-6 space-y-4">
          {/* Icon */}
          <div className="flex items-center justify-center mb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 border border-black/10">
              <CheckCircle2 className="w-7 h-7 text-black" strokeWidth={2} />
            </div>
          </div>

          {/* Titre */}
          <DialogTitle className="text-[24px] font-bold tracking-[-0.02em] text-black text-center">
            {isNewSubscription
              ? `Obtenir ${planInfo.name}`
              : `Changer pour ${planInfo.name}`}
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="text-[15px] text-black/70 text-center leading-relaxed">
            {isNewSubscription
              ? `Commencez avec le plan ${planInfo.name}. Essai gratuit de 14 jours, aucune carte requise.`
              : `Pour changer de plan, gérer votre abonnement ou l'annuler, utilisez le portail de gestion sécurisé de Stripe.`}
          </DialogDescription>
        </DialogHeader>

        {/* Sélecteur d'interval (nouveau abonnement uniquement) */}
        {isNewSubscription && planInfo.annualPrice && (
          <div className="px-8 pt-6">
            <div className="flex items-center gap-2 p-1 bg-black/5 rounded-lg">
              <button
                onClick={() => setInterval("month")}
                className={`flex-1 px-4 py-2.5 text-[13px] font-medium rounded-md transition-all duration-200 ${
                  interval === "month"
                    ? "bg-white text-black shadow-sm"
                    : "text-black/60 hover:text-black"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setInterval("year")}
                className={`flex-1 px-4 py-2.5 text-[13px] font-medium rounded-md transition-all duration-200 ${
                  interval === "year"
                    ? "bg-white text-black shadow-sm"
                    : "text-black/60 hover:text-black"
                }`}
              >
                <span>Annuel</span>
                <span className="ml-1.5 text-[11px] font-semibold text-green-600">
                  -20%
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Prix et détails */}
        <div className="px-8 py-6 bg-black/[0.02] border-y border-black/5">
          <div className="flex items-baseline justify-center gap-2 mb-3">
            <span className="text-[36px] font-bold text-black">
              {displayPrice}€
            </span>
            <span className="text-[16px] text-black/50">
              /mois
            </span>
          </div>

          {interval === "year" && planInfo.annualPrice && (
            <p className="text-[13px] text-black/60 text-center">
              {displayPrice * 12}€ facturé annuellement
            </p>
          )}

          {/* Trial badge pour nouveaux abonnements */}
          {isNewSubscription && (
            <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-black/10">
              <CheckCircle2 className="w-4 h-4 text-black" strokeWidth={2} />
              <span className="text-[13px] font-medium text-black">
                14 jours d'essai gratuit
              </span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-8 mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-red-900 mb-1">
                  Erreur
                </p>
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="p-6 gap-3 sm:gap-3 bg-white">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || portalLoading}
            className="flex-1 h-11 text-[14px] font-medium border-black/10 hover:bg-black/5 rounded-lg"
          >
            Annuler
          </Button>
          <Button
            onClick={isNewSubscription ? handleNewSubscription : handleBillingPortal}
            disabled={loading || portalLoading}
            className="flex-1 h-11 text-[14px] font-semibold bg-black hover:bg-black/90 text-white rounded-lg shadow-sm"
          >
            {loading || portalLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isNewSubscription ? "Redirection..." : "Ouverture..."}
              </>
            ) : isNewSubscription ? (
              <>
                Obtenir {planInfo.name}
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2.5} />
              </>
            ) : (
              <>
                Ouvrir le portail Stripe
                <ExternalLink className="w-4 h-4 ml-2" strokeWidth={2} />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

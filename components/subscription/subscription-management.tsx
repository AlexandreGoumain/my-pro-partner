"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card-section";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";
import { PLAN_PRICING } from "@/lib/pricing-config";
import {
  CheckCircle2,
  Settings,
  ExternalLink,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

/**
 * Composant de gestion d'abonnement via Stripe Billing Portal
 *
 * Redirige vers le Billing Portal de Stripe pour :
 * - Changer de plan
 * - Annuler l'abonnement
 * - Réactiver un abonnement
 * - Mettre à jour le moyen de paiement
 * - Voir l'historique des factures
 *
 * UX inspirée de Vercel, GitHub, Stripe
 */
export function SubscriptionManagement() {
  const { status, currentPlan } = useSubscriptionStatus();
  const [loading, setLoading] = useState(false);

  // Si FREE, ne rien afficher
  if (currentPlan === "FREE") {
    return null;
  }

  const planInfo = PLAN_PRICING[currentPlan];

  const openBillingPortal = async () => {
    try {
      setLoading(true);

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
      toast.error(error.message || "Erreur lors de l'ouverture du portail de gestion");
      setLoading(false);
    }
  };

  return (
    <CardSection
      title="Gestion de l'abonnement"
      description={`Gérez votre abonnement ${planInfo.name} via Stripe`}
      titleClassName="text-[20px]"
      contentClassName="space-y-6"
    >
        {/* Statut actuel */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/[0.02] border border-black/10">
          <div>
            <p className="text-[14px] font-medium text-black">
              Plan actuel
            </p>
            <p className="text-[13px] text-black/60 mt-1">
              {planInfo.name} - {planInfo.price}€/mois
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2} />
            <span className="text-[13px] font-medium text-green-600">
              Actif
            </span>
          </div>
        </div>

        {/* Info sur le portail */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-[13px] font-medium text-blue-900 mb-1">
                Portail de gestion Stripe
              </p>
              <p className="text-[13px] text-blue-700 leading-relaxed">
                Accédez au portail sécurisé de Stripe pour changer de plan, annuler votre abonnement,
                mettre à jour votre moyen de paiement ou consulter vos factures.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton d'accès au portail */}
        <Button
          onClick={openBillingPortal}
          disabled={loading}
          className="w-full h-11 text-[14px] font-semibold bg-black hover:bg-black/90 text-white rounded-lg"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Ouverture...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" strokeWidth={2} />
              Gérer mon abonnement
              <ExternalLink className="w-4 h-4 ml-2" strokeWidth={2} />
            </>
          )}
        </Button>
    </CardSection>
  );
}

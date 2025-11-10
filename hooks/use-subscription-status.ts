import { useMemo } from "react";
import { useUserPlan } from "./use-user-plan";
import { PlanType } from "@/lib/pricing-config";

export type SubscriptionStatus =
  | "free"           // Aucun abonnement
  | "active"         // Abonnement actif et payant
  | "trialing"       // En période d'essai
  | "canceled"       // Annulé, actif jusqu'à la fin de période
  | "past_due"       // Paiement échoué
  | "incomplete";    // Paiement initial en attente

export interface SubscriptionState {
  // État actuel
  status: SubscriptionStatus;
  currentPlan: PlanType;

  // Capacités
  canSubscribe: boolean;        // Peut souscrire à un nouveau plan
  canUpgrade: boolean;          // Peut upgrade vers plan supérieur
  canDowngrade: boolean;        // Peut downgrade vers plan inférieur
  canCancel: boolean;           // Peut annuler l'abonnement
  canResume: boolean;           // Peut réactiver un abonnement annulé

  // Helpers
  isUpgrade: (targetPlan: PlanType) => boolean;
  isDowngrade: (targetPlan: PlanType) => boolean;
  isSamePlan: (targetPlan: PlanType) => boolean;
  canChangeTo: (targetPlan: PlanType) => boolean;

  // Messages
  getActionLabel: (targetPlan: PlanType) => string;
  getActionDescription: (targetPlan: PlanType) => string;
}

const PLAN_ORDER: Record<PlanType, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  ENTERPRISE: 3,
};

/**
 * Hook pour gérer l'état et les actions possibles sur l'abonnement
 *
 * Centralise toute la logique de détection d'état et de capacités
 * pour avoir une source de vérité unique
 */
export function useSubscriptionStatus(): SubscriptionState {
  const currentPlan = useUserPlan();

  return useMemo(() => {
    // Déterminer le statut actuel
    // TODO: Récupérer le vrai statut depuis la session/DB
    const status: SubscriptionStatus = currentPlan === "FREE" ? "free" : "active";

    // Capacités de base
    const canSubscribe = status === "free";
    const canUpgrade = status === "active" || status === "trialing";
    const canDowngrade = status === "active" || status === "trialing";
    const canCancel = status === "active" || status === "trialing";
    const canResume = status === "canceled";

    // Helpers de comparaison
    const isUpgrade = (targetPlan: PlanType): boolean => {
      return PLAN_ORDER[targetPlan] > PLAN_ORDER[currentPlan];
    };

    const isDowngrade = (targetPlan: PlanType): boolean => {
      return PLAN_ORDER[targetPlan] < PLAN_ORDER[currentPlan] && targetPlan !== "FREE";
    };

    const isSamePlan = (targetPlan: PlanType): boolean => {
      return targetPlan === currentPlan;
    };

    const canChangeTo = (targetPlan: PlanType): boolean => {
      if (isSamePlan(targetPlan)) return false;
      if (targetPlan === "FREE") return false; // Pas de "downgrade" vers FREE
      if (status === "free") return true; // Peut souscrire à n'importe quel plan
      return canUpgrade || canDowngrade;
    };

    // Messages contextuels
    const getActionLabel = (targetPlan: PlanType): string => {
      if (status === "free") return "S'abonner";
      if (isSamePlan(targetPlan)) return "Plan actuel";
      if (isUpgrade(targetPlan)) return "Upgrade";
      if (isDowngrade(targetPlan)) return "Downgrade";
      return "Changer de plan";
    };

    const getActionDescription = (targetPlan: PlanType): string => {
      if (status === "free") {
        return `Commencez avec le plan ${targetPlan}. Essai gratuit de 14 jours, aucune carte requise.`;
      }

      if (isUpgrade(targetPlan)) {
        return `Passez au plan ${targetPlan}. Le changement est immédiat et le montant sera ajusté au prorata de votre période actuelle.`;
      }

      if (isDowngrade(targetPlan)) {
        return `Passez au plan ${targetPlan}. Le changement prendra effet à la fin de votre période de facturation actuelle. Vous conservez vos avantages jusqu'à cette date.`;
      }

      return "";
    };

    return {
      status,
      currentPlan,
      canSubscribe,
      canUpgrade,
      canDowngrade,
      canCancel,
      canResume,
      isUpgrade,
      isDowngrade,
      isSamePlan,
      canChangeTo,
      getActionLabel,
      getActionDescription,
    };
  }, [currentPlan]);
}

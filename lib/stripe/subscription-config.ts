/**
 * Configuration des abonnements Stripe
 *
 * IMPORTANT : Vous devez créer ces produits et prix dans votre dashboard Stripe
 * et remplacer les Price IDs par les vrais IDs de votre compte Stripe.
 *
 * Pour créer vos produits et prix dans Stripe :
 * 1. Allez sur https://dashboard.stripe.com/products
 * 2. Créez un produit pour chaque plan (STARTER, PRO, ENTERPRISE)
 * 3. Pour chaque produit, créez 2 prix : monthly et annual
 * 4. Copiez les Price IDs (format: price_xxxxxxxxxxxxx)
 * 5. Collez-les ci-dessous
 */

export interface StripePriceConfig {
  priceId: string;
  amount: number; // En centimes (EUR)
  currency: "eur";
  interval: "month" | "year";
  trialDays?: number;
}

export interface StripePlanConfig {
  productId?: string; // Product ID Stripe (optionnel)
  monthly: StripePriceConfig;
  annual: StripePriceConfig;
}

/**
 * Configuration complète des prix Stripe par plan
 *
 * TODO: Remplacer les Price IDs par vos vrais IDs Stripe
 */
export const STRIPE_SUBSCRIPTION_PRICES: Record<"STARTER" | "PRO" | "ENTERPRISE", StripePlanConfig> = {
  STARTER: {
    productId: process.env.STRIPE_PRODUCT_STARTER, // Optionnel
    monthly: {
      priceId: process.env.STRIPE_PRICE_STARTER_MONTHLY || "price_starter_monthly_placeholder",
      amount: 2900, // 29€
      currency: "eur",
      interval: "month",
      trialDays: 14, // 14 jours d'essai gratuit
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_STARTER_ANNUAL || "price_starter_annual_placeholder",
      amount: 29000, // 290€ (économie de 2 mois)
      currency: "eur",
      interval: "year",
      trialDays: 14,
    },
  },
  PRO: {
    productId: process.env.STRIPE_PRODUCT_PRO,
    monthly: {
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly_placeholder",
      amount: 7900, // 79€
      currency: "eur",
      interval: "month",
      trialDays: 14,
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_pro_annual_placeholder",
      amount: 79000, // 790€ (économie de 2 mois)
      currency: "eur",
      interval: "year",
      trialDays: 14,
    },
  },
  ENTERPRISE: {
    productId: process.env.STRIPE_PRODUCT_ENTERPRISE,
    monthly: {
      priceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "price_enterprise_monthly_placeholder",
      amount: 29900, // 299€
      currency: "eur",
      interval: "month",
      trialDays: 30, // 30 jours d'essai pour Enterprise
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || "price_enterprise_annual_placeholder",
      amount: 299000, // 2990€ (économie de 2 mois)
      currency: "eur",
      interval: "year",
      trialDays: 30,
    },
  },
};

/**
 * Récupérer la configuration d'un prix Stripe
 */
export function getStripePriceConfig(
  plan: "STARTER" | "PRO" | "ENTERPRISE",
  interval: "month" | "year"
): StripePriceConfig {
  return STRIPE_SUBSCRIPTION_PRICES[plan][interval === "month" ? "monthly" : "annual"];
}

/**
 * Récupérer le Price ID Stripe pour un plan et une période
 */
export function getStripePriceId(
  plan: "STARTER" | "PRO" | "ENTERPRISE",
  interval: "month" | "year"
): string {
  return getStripePriceConfig(plan, interval).priceId;
}

/**
 * Vérifier si un Price ID est valide (pas un placeholder)
 */
export function isValidStripePriceId(priceId: string): boolean {
  return priceId.startsWith("price_") && !priceId.includes("placeholder");
}

/**
 * Trouver le plan correspondant à un Price ID
 */
export function getPlanFromPriceId(priceId: string): {
  plan: "STARTER" | "PRO" | "ENTERPRISE";
  interval: "month" | "year";
} | null {
  for (const [plan, config] of Object.entries(STRIPE_SUBSCRIPTION_PRICES)) {
    if (config.monthly.priceId === priceId) {
      return { plan: plan as "STARTER" | "PRO" | "ENTERPRISE", interval: "month" };
    }
    if (config.annual.priceId === priceId) {
      return { plan: plan as "STARTER" | "PRO" | "ENTERPRISE", interval: "year" };
    }
  }
  return null;
}

/**
 * Configuration du Billing Portal Stripe
 */
export const STRIPE_BILLING_PORTAL_CONFIG = {
  /**
   * URL de retour après la gestion de l'abonnement
   */
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?tab=subscription`,

  /**
   * Features activées dans le billing portal
   */
  features: {
    customerUpdate: {
      enabled: true,
      allowedUpdates: ["email", "address", "phone", "name"],
    },
    invoiceHistory: {
      enabled: true,
    },
    paymentMethodUpdate: {
      enabled: true,
    },
    subscriptionCancel: {
      enabled: true,
      mode: "at_period_end", // Annulation à la fin de la période
      cancellationReason: {
        enabled: true,
        options: [
          "too_expensive",
          "missing_features",
          "switched_service",
          "unused",
          "customer_service",
          "too_complex",
          "low_quality",
          "other",
        ],
      },
    },
    subscriptionPause: {
      enabled: false, // Désactivé pour l'instant
    },
  },
};

/**
 * Messages d'erreur liés aux abonnements
 */
export const SUBSCRIPTION_ERROR_MESSAGES = {
  INVALID_PRICE_ID: "Price ID Stripe invalide. Veuillez configurer vos Price IDs dans .env",
  SUBSCRIPTION_NOT_FOUND: "Aucun abonnement actif trouvé",
  SUBSCRIPTION_ALREADY_EXISTS: "Un abonnement existe déjà pour cette entreprise",
  STRIPE_CUSTOMER_NOT_FOUND: "Client Stripe introuvable",
  PAYMENT_FAILED: "Le paiement a échoué. Veuillez réessayer avec un autre moyen de paiement",
  TRIAL_ALREADY_USED: "L'essai gratuit a déjà été utilisé",
  DOWNGRADE_NOT_ALLOWED: "Le downgrade n'est pas autorisé en cours de période",
} as const;

/**
 * Configuration du trial (essai gratuit)
 */
export const TRIAL_CONFIG = {
  enabled: true,
  defaultDays: 14,
  requirePaymentMethod: true, // Exiger une CB pour le trial
  automaticConversion: true, // Convertir automatiquement en abonnement payant
};

/**
 * Webhooks events pour les abonnements
 */
export const SUBSCRIPTION_WEBHOOK_EVENTS = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
] as const;

export type SubscriptionWebhookEvent = typeof SUBSCRIPTION_WEBHOOK_EVENTS[number];

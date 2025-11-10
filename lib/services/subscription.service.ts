import Stripe from "stripe";
import { stripe } from "@/lib/stripe/stripe-config";
import { prisma } from "@/lib/prisma";
import {
  getStripePriceId,
  isValidStripePriceId,
  getPlanFromPriceId,
  STRIPE_BILLING_PORTAL_CONFIG,
  SUBSCRIPTION_ERROR_MESSAGES,
  getStripePriceConfig,
} from "@/lib/stripe/subscription-config";
import { PlanAbonnement, SubscriptionStatus } from "@prisma/client";

/**
 * Service de gestion des abonnements Stripe
 */
export class SubscriptionService {
  /**
   * Créer une session Checkout Stripe pour un nouvel abonnement
   */
  static async createCheckoutSession({
    entrepriseId,
    plan,
    interval,
    successUrl,
    cancelUrl,
  }: {
    entrepriseId: string;
    plan: "STARTER" | "PRO" | "ENTERPRISE";
    interval: "month" | "year";
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session> {
    // Récupérer l'entreprise
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      include: { subscription: true },
    });

    if (!entreprise) {
      throw new Error("Entreprise introuvable");
    }

    // Vérifier si un abonnement actif existe déjà
    const hasActiveSubscription = entreprise.subscription &&
      (entreprise.subscription.status === "ACTIVE" ||
       entreprise.subscription.status === "TRIALING");

    if (hasActiveSubscription) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_ALREADY_EXISTS);
    }

    // Si subscription existe mais est inactive/canceled, la supprimer
    if (entreprise.subscription) {
      await prisma.subscription.delete({
        where: { id: entreprise.subscription.id },
      });
    }

    // Récupérer le Price ID
    const priceId = getStripePriceId(plan, interval);
    if (!isValidStripePriceId(priceId)) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.INVALID_PRICE_ID);
    }

    // Créer ou récupérer le customer Stripe
    let stripeCustomerId = entreprise.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: entreprise.email,
        name: entreprise.nom,
        metadata: {
          entrepriseId: entreprise.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Récupérer la config du prix pour le trial
    const priceConfig = getStripePriceConfig(plan, interval);

    // Créer la session Checkout
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card", "paypal"], // Activer PayPal aussi
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true, // Permettre les codes promo
      billing_address_collection: "required",
      // Activer Apple Pay et Google Pay (Payment Request Button)
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic", // 3D Secure automatique
        },
      },
      // Activer les wallets (Apple Pay, Google Pay)
      custom_text: {
        submit: {
          message: "Paiement sécurisé par Stripe",
        },
      },
      subscription_data: {
        trial_period_days: priceConfig.trialDays,
        metadata: {
          entrepriseId: entreprise.id,
          plan,
          interval,
        },
      },
      metadata: {
        entrepriseId: entreprise.id,
        plan,
        interval,
      },
    });

    return session;
  }

  /**
   * Créer un abonnement dans la base de données après paiement Stripe réussi
   */
  static async createSubscriptionFromStripe(
    stripeSubscription: Stripe.Subscription,
    entrepriseId: string
  ): Promise<void> {
    const priceId = stripeSubscription.items.data[0].price.id;
    const planInfo = getPlanFromPriceId(priceId);

    if (!planInfo) {
      throw new Error("Plan introuvable pour ce Price ID");
    }

    // Mapper le statut Stripe vers notre enum
    const status = this.mapStripeStatus(stripeSubscription.status);

    // Créer l'abonnement en BDD
    await prisma.subscription.create({
      data: {
        entrepriseId,
        stripeCustomerId: stripeSubscription.customer as string,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        stripeProductId: stripeSubscription.items.data[0].price.product as string,
        plan: planInfo.plan,
        status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        trialStart: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000)
          : null,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : null,
      },
    });

    // Mettre à jour le plan de l'entreprise
    await prisma.entreprise.update({
      where: { id: entrepriseId },
      data: {
        plan: planInfo.plan,
        abonnementActif: status === "ACTIVE" || status === "TRIALING",
        dateAbonnement: new Date(),
        dateExpiration: new Date(stripeSubscription.current_period_end * 1000),
      },
    });
  }

  /**
   * Mettre à jour un abonnement depuis Stripe
   */
  static async updateSubscriptionFromStripe(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    const planInfo = getPlanFromPriceId(stripeSubscription.items.data[0].price.id);

    if (!planInfo) {
      throw new Error("Plan introuvable pour ce Price ID");
    }

    const status = this.mapStripeStatus(stripeSubscription.status);

    // Gérer les dates qui peuvent être null/undefined
    const currentPeriodStart = stripeSubscription.current_period_start
      ? new Date(stripeSubscription.current_period_start * 1000)
      : new Date();

    const currentPeriodEnd = stripeSubscription.current_period_end
      ? new Date(stripeSubscription.current_period_end * 1000)
      : new Date();

    // Mettre à jour l'abonnement
    await prisma.subscription.update({
      where: { stripeSubscriptionId: stripeSubscription.id },
      data: {
        plan: planInfo.plan,
        status,
        stripePriceId: stripeSubscription.items.data[0].price.id,
        currentPeriodStart,
        currentPeriodEnd,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : null,
      },
    });

    // Mettre à jour l'entreprise
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (subscription) {
      await prisma.entreprise.update({
        where: { id: subscription.entrepriseId },
        data: {
          plan: planInfo.plan,
          abonnementActif: status === "ACTIVE" || status === "TRIALING",
          dateExpiration: new Date(stripeSubscription.current_period_end * 1000),
        },
      });
    }
  }

  /**
   * Supprimer un abonnement (webhook subscription.deleted)
   */
  static async deleteSubscriptionFromStripe(stripeSubscriptionId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
    });

    if (!subscription) {
      return; // Déjà supprimé
    }

    // Mettre à jour le statut
    await prisma.subscription.update({
      where: { stripeSubscriptionId },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
      },
    });

    // Rétrograder l'entreprise vers FREE
    await prisma.entreprise.update({
      where: { id: subscription.entrepriseId },
      data: {
        plan: "FREE",
        abonnementActif: false,
        dateExpiration: null,
      },
    });
  }

  /**
   * Annuler un abonnement (à la fin de la période)
   */
  static async cancelSubscription(entrepriseId: string, reason?: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    // Annuler dans Stripe (à la fin de la période)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
      cancellation_details: reason ? { comment: reason } : undefined,
    });

    // Mettre à jour en BDD
    await prisma.subscription.update({
      where: { entrepriseId },
      data: {
        cancelAtPeriodEnd: true,
        cancelReason: reason || null,
      },
    });
  }

  /**
   * Réactiver un abonnement annulé
   */
  static async resumeSubscription(entrepriseId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    if (!subscription.cancelAtPeriodEnd) {
      throw new Error("L'abonnement n'est pas en attente d'annulation");
    }

    // Réactiver dans Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Mettre à jour en BDD
    await prisma.subscription.update({
      where: { entrepriseId },
      data: {
        cancelAtPeriodEnd: false,
        cancelReason: null,
      },
    });
  }

  /**
   * Changer de plan (upgrade/downgrade)
   */
  static async changePlan({
    entrepriseId,
    newPlan,
    newInterval,
    prorate = true,
  }: {
    entrepriseId: string;
    newPlan: "STARTER" | "PRO" | "ENTERPRISE";
    newInterval: "month" | "year";
    prorate?: boolean;
  }): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    const newPriceId = getStripePriceId(newPlan, newInterval);

    if (!isValidStripePriceId(newPriceId)) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.INVALID_PRICE_ID);
    }

    // Mettre à jour dans Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: prorate ? "create_prorations" : "none",
    });

    // La mise à jour en BDD sera faite par le webhook subscription.updated
  }

  /**
   * Créer une session Billing Portal
   */
  static async createBillingPortalSession(entrepriseId: string): Promise<string> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: STRIPE_BILLING_PORTAL_CONFIG.returnUrl,
    });

    return session.url;
  }

  /**
   * Récupérer les factures d'un abonnement
   */
  static async getInvoices(entrepriseId: string): Promise<Stripe.Invoice[]> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    const invoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 100,
    });

    return invoices.data;
  }

  /**
   * Synchroniser un abonnement avec Stripe (en cas de désynchronisation)
   */
  static async syncWithStripe(entrepriseId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription) {
      throw new Error(SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    await this.updateSubscriptionFromStripe(stripeSubscription);
  }

  /**
   * Mapper le statut Stripe vers notre enum
   */
  private static mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
    const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
      active: "ACTIVE",
      trialing: "TRIALING",
      past_due: "PAST_DUE",
      canceled: "CANCELED",
      incomplete: "INCOMPLETE",
      incomplete_expired: "INCOMPLETE_EXPIRED",
      unpaid: "UNPAID",
      paused: "PAUSED",
    };

    return statusMap[stripeStatus] || "CANCELED";
  }

  /**
   * Vérifier si une entreprise est en trial
   */
  static async isInTrial(entrepriseId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription || !subscription.trialEnd) {
      return false;
    }

    return subscription.status === "TRIALING" && new Date() < subscription.trialEnd;
  }

  /**
   * Obtenir le nombre de jours restants du trial
   */
  static async getTrialDaysRemaining(entrepriseId: string): Promise<number | null> {
    const subscription = await prisma.subscription.findUnique({
      where: { entrepriseId },
    });

    if (!subscription || !subscription.trialEnd || subscription.status !== "TRIALING") {
      return null;
    }

    const now = new Date();
    const trialEnd = subscription.trialEnd;
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }
}

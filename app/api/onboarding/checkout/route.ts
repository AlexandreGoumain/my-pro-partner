import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import {
    PLAN_ABONNEMENT,
    shouldAutoActivateTrial,
} from "@/lib/config/activity-plan-mapping";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe-config";
import {
    getStripePriceId,
    isValidStripePriceId,
    getStripePriceConfig,
    SUBSCRIPTION_ERROR_MESSAGES,
} from "@/lib/stripe/subscription-config";
import {
    BusinessTemplateService,
    BusinessType,
} from "@/lib/services/business-template.service";
import { prepareTrialData } from "@/lib/services/onboarding.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

const planValues = Object.values(PLAN_ABONNEMENT) as [string, ...string[]];

const onboardingCheckoutSchema = z.object({
    nomEntreprise: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères"),
    businessType: z.string().min(1, "Le type de business est requis"),
    selectedPlan: z.enum(planValues),
    billingPeriod: z.enum(["monthly", "yearly"]),
});

/**
 * POST /api/onboarding/checkout
 *
 * Complète l'onboarding et redirige vers Stripe Checkout pour les plans payants.
 * Pour le plan FREE, complète directement l'onboarding sans paiement.
 *
 * Sécurité :
 * - Validation stricte des données
 * - Session authentifiée requise
 * - Création du customer Stripe avec metadata
 * - URL de succès avec session_id pour vérification
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Parse and validate request body
            const body = await req.json();
            const result = onboardingCheckoutSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const {
                nomEntreprise,
                businessType,
                selectedPlan,
                billingPeriod,
            } = result.data;

            const finalPlan = selectedPlan as PlanAbonnement;

            // Pour le plan FREE, pas besoin de paiement
            if (finalPlan === PLAN_ABONNEMENT.FREE) {
                return await completeFreeOnboarding(ctx, {
                    nomEntreprise,
                    businessType: businessType as BusinessType,
                    finalPlan,
                });
            }

            // Pour les plans payants, créer une session Stripe Checkout
            return await createPaidCheckoutSession(ctx, {
                nomEntreprise,
                businessType: businessType as BusinessType,
                plan: finalPlan as "STARTER" | "PRO" | "ENTERPRISE",
                billingPeriod,
            });
        },
        {
            context: { resourceName: "Onboarding", operation: "checkout" },
        }
    );
}

/**
 * Complète l'onboarding pour le plan FREE (sans paiement)
 */
async function completeFreeOnboarding(
    ctx: { userId: string; entrepriseId: string },
    data: {
        nomEntreprise: string;
        businessType: BusinessType;
        finalPlan: PlanAbonnement;
    }
) {
    const { nomEntreprise, businessType, finalPlan } = data;

    const shouldActivateTrial = shouldAutoActivateTrial(businessType, finalPlan);

    await prisma.$transaction(async (tx) => {
        const trialData = prepareTrialData(shouldActivateTrial, businessType);

        await tx.entreprise.update({
            where: { id: ctx.entrepriseId },
            data: {
                nom: nomEntreprise,
                businessType,
                plan: finalPlan,
                ...trialData,
            },
        });

        await tx.parametresEntreprise.upsert({
            where: { entrepriseId: ctx.entrepriseId },
            update: { nom_entreprise: nomEntreprise },
            create: {
                entrepriseId: ctx.entrepriseId,
                nom_entreprise: nomEntreprise,
            },
        });

        await tx.user.update({
            where: { id: ctx.userId },
            data: { onboardingComplete: true },
        });
    });

    // Apply business template
    let templateWarning: string | null = null;
    try {
        await BusinessTemplateService.applyTemplateVariant(
            ctx.entrepriseId,
            businessType,
            finalPlan,
            shouldActivateTrial
        );
    } catch (error) {
        console.error("Erreur lors de l'application du template:", error);
        templateWarning = "Certaines configurations initiales n'ont pas pu être appliquées.";
    }

    return NextResponse.json({
        success: true,
        requiresPayment: false,
        redirectUrl: "/dashboard",
        warning: templateWarning,
    });
}

/**
 * Crée une session Stripe Checkout pour les plans payants
 */
async function createPaidCheckoutSession(
    ctx: { userId: string; entrepriseId: string },
    data: {
        nomEntreprise: string;
        businessType: BusinessType;
        plan: "STARTER" | "PRO" | "ENTERPRISE";
        billingPeriod: "monthly" | "yearly";
    }
) {
    const { nomEntreprise, businessType, plan, billingPeriod } = data;

    // Récupérer l'entreprise
    const entreprise = await prisma.entreprise.findUnique({
        where: { id: ctx.entrepriseId },
        include: { subscription: true },
    });

    if (!entreprise) {
        throw new Error("Entreprise introuvable");
    }

    // Récupérer l'utilisateur pour l'email
    const user = await prisma.user.findUnique({
        where: { id: ctx.userId },
    });

    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    // Récupérer le Price ID
    const interval = billingPeriod === "monthly" ? "month" : "year";
    const priceId = getStripePriceId(plan, interval);

    if (!isValidStripePriceId(priceId)) {
        throw new Error(SUBSCRIPTION_ERROR_MESSAGES.INVALID_PRICE_ID);
    }

    // Créer le customer Stripe
    const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: nomEntreprise,
        metadata: {
            entrepriseId: ctx.entrepriseId,
            userId: ctx.userId,
            businessType,
        },
    });

    // Récupérer la config pour le trial
    const priceConfig = getStripePriceConfig(plan, interval);

    // URLs de retour
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/onboarding?canceled=true`;

    // Créer la session Checkout sécurisée
    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        billing_address_collection: "required",
        // Sécurité 3D Secure automatique
        payment_method_options: {
            card: {
                request_three_d_secure: "automatic",
            },
        },
        // Configuration du trial
        subscription_data: {
            trial_period_days: priceConfig.trialDays,
            metadata: {
                entrepriseId: ctx.entrepriseId,
                userId: ctx.userId,
                plan,
                interval,
                businessType,
                nomEntreprise,
            },
        },
        // Metadata pour le webhook
        metadata: {
            type: "onboarding",
            entrepriseId: ctx.entrepriseId,
            userId: ctx.userId,
            plan,
            interval,
            businessType,
            nomEntreprise,
        },
        // Texte personnalisé
        custom_text: {
            submit: {
                message: "Paiement sécurisé par Stripe • Annulez à tout moment",
            },
        },
        // Locale française
        locale: "fr",
    });

    return NextResponse.json({
        success: true,
        requiresPayment: true,
        checkoutUrl: session.url,
        sessionId: session.id,
    });
}

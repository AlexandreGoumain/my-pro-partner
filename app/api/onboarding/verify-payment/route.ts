import Stripe from "stripe";
import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import {
    PLAN_ABONNEMENT,
    shouldAutoActivateTrial,
} from "@/lib/config/activity-plan-mapping";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe-config";
import {
    BusinessTemplateService,
    BusinessType,
} from "@/lib/services/business-template.service";
import { prepareTrialData } from "@/lib/services/onboarding.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

const verifyPaymentSchema = z.object({
    sessionId: z.string().min(1, "Session ID requis"),
});

// Validation des metadata Stripe
const stripeMetadataSchema = z.object({
    type: z.literal("onboarding"),
    entrepriseId: z.string().min(1),
    userId: z.string().min(1),
    plan: z.enum(["STARTER", "PRO", "ENTERPRISE"]),
    interval: z.enum(["month", "year"]),
    businessType: z.string().min(1),
    nomEntreprise: z.string().min(1),
});

/**
 * POST /api/onboarding/verify-payment
 *
 * Vérifie la session Stripe Checkout et complète l'onboarding après paiement réussi.
 * Cette route est appelée depuis la page de succès.
 *
 * Sécurité :
 * - Vérifie que la session existe et est payée
 * - Vérifie que l'entreprise correspond à l'utilisateur connecté
 * - Ne peut être appelée qu'une seule fois (onboardingComplete = true après)
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();
            const result = verifyPaymentSchema.safeParse(body);

            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { sessionId } = result.data;

            // Récupérer la session Stripe
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ["subscription"],
            });

            // Vérifier que la session est complétée
            if (session.status !== "complete") {
                throw new ValidationError("Le paiement n'est pas encore confirmé");
            }

            // Valider les metadata Stripe (type, entrepriseId, plan, etc.)
            const metadataResult = stripeMetadataSchema.safeParse(session.metadata);
            if (!metadataResult.success) {
                throw new ValidationError("Données de session invalides ou incomplètes");
            }

            // Vérifier que l'entreprise correspond à l'utilisateur connecté
            if (metadataResult.data.entrepriseId !== ctx.entrepriseId) {
                throw new ValidationError("Cette session ne vous appartient pas");
            }

            // Vérifier si déjà traité
            const user = await prisma.user.findUnique({
                where: { id: ctx.userId },
            });

            if (user?.onboardingComplete) {
                return NextResponse.json({
                    success: true,
                    alreadyCompleted: true,
                    message: "Onboarding déjà complété",
                });
            }

            // Extraire les données validées
            const { plan, businessType, nomEntreprise } = metadataResult.data;
            const finalPlan = plan as PlanAbonnement;
            const businessTypeEnum = businessType as BusinessType;

            // Compléter l'onboarding
            const shouldActivateTrial = shouldAutoActivateTrial(businessTypeEnum, finalPlan);

            // Récupérer la subscription Stripe complète
            const subscriptionId = typeof session.subscription === "string"
                ? session.subscription
                : session.subscription?.id;

            let stripeSubscription: Stripe.Subscription | null = null;
            if (subscriptionId) {
                stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
            }

            await prisma.$transaction(async (tx) => {
                const trialData = prepareTrialData(shouldActivateTrial, businessTypeEnum);

                // Mettre à jour l'entreprise
                await tx.entreprise.update({
                    where: { id: ctx.entrepriseId },
                    data: {
                        nom: nomEntreprise,
                        businessType: businessTypeEnum,
                        plan: finalPlan,
                        abonnementActif: true,
                        dateAbonnement: new Date(),
                        ...trialData,
                    },
                });

                // Créer/màj les paramètres
                await tx.parametresEntreprise.upsert({
                    where: { entrepriseId: ctx.entrepriseId },
                    update: { nom_entreprise: nomEntreprise },
                    create: {
                        entrepriseId: ctx.entrepriseId,
                        nom_entreprise: nomEntreprise,
                    },
                });

                // Marquer l'onboarding comme complet
                await tx.user.update({
                    where: { id: ctx.userId },
                    data: { onboardingComplete: true },
                });

                // Créer l'enregistrement de subscription si présent
                if (stripeSubscription) {
                    // Calculer les dates de période (fallback sur maintenant + 30 jours si absent)
                    const now = new Date();
                    // Cast explicite car ces propriétés existent dans l'API Stripe
                    const sub = stripeSubscription as Stripe.Subscription & {
                        current_period_start: number;
                        current_period_end: number;
                    };
                    const currentPeriodStart = sub.current_period_start
                        ? new Date(sub.current_period_start * 1000)
                        : now;
                    const currentPeriodEnd = sub.current_period_end
                        ? new Date(sub.current_period_end * 1000)
                        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

                    await tx.subscription.create({
                        data: {
                            entrepriseId: ctx.entrepriseId,
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: stripeSubscription.id,
                            stripePriceId: stripeSubscription.items.data[0].price.id,
                            stripeProductId: stripeSubscription.items.data[0].price.product as string,
                            plan: finalPlan as "STARTER" | "PRO" | "ENTERPRISE",
                            status: stripeSubscription.status === "trialing" ? "TRIALING" : "ACTIVE",
                            currentPeriodStart,
                            currentPeriodEnd,
                            trialStart: stripeSubscription.trial_start
                                ? new Date(stripeSubscription.trial_start * 1000)
                                : null,
                            trialEnd: stripeSubscription.trial_end
                                ? new Date(stripeSubscription.trial_end * 1000)
                                : null,
                        },
                    });
                }
            });

            // Appliquer le template business
            let templateWarning: string | null = null;
            try {
                await BusinessTemplateService.applyTemplateVariant(
                    ctx.entrepriseId,
                    businessTypeEnum,
                    finalPlan,
                    shouldActivateTrial
                );
            } catch (error) {
                console.error("Erreur lors de l'application du template:", error);
                templateWarning = "Certaines configurations initiales n'ont pas pu être appliquées. Vous pourrez les configurer manuellement dans les paramètres.";
            }

            return NextResponse.json({
                success: true,
                alreadyCompleted: false,
                message: "Onboarding complété avec succès",
                warning: templateWarning,
            });
        },
        {
            context: { resourceName: "Onboarding", operation: "verify-payment" },
        }
    );
}

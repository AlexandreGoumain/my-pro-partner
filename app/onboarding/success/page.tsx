"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, XCircle, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    SuccessConfetti,
    SuccessHero,
    SuccessSubscriptionRecap,
    SuccessNextSteps,
    SuccessTrustSignals,
} from "@/components/onboarding/success";
import { getPlanPriceDetails, type PlanType } from "@/lib/config/plans.config";

type VerificationStatus = "loading" | "success" | "error" | "already_completed";

interface SubscriptionDetails {
    planName: string;
    price: string;
    billingPeriod: string;
    trialDays: number;
}

// Fallback de chargement pour Suspense
function SuccessPageFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-black/[0.02] flex items-center justify-center p-4">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-black/5 flex items-center justify-center">
                        <Loader2 className="h-10 w-10 text-black/40 animate-spin" />
                    </div>
                </div>
                <div>
                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                        Chargement...
                    </h1>
                </div>
            </div>
        </div>
    );
}

// Composant principal qui utilise useSearchParams
function SuccessPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { update: updateSession } = useSession();
    const sessionId = searchParams.get("session_id");

    const [status, setStatus] = useState<VerificationStatus>("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isRedirecting, setIsRedirecting] = useState(false);
    // Valeurs par défaut depuis la config centralisée
    const defaultDetails = getPlanPriceDetails("STARTER", "month");
    const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails>({
        planName: defaultDetails.planName,
        price: defaultDetails.price,
        billingPeriod: defaultDetails.billingPeriod,
        trialDays: defaultDetails.trialDays,
    });

    useEffect(() => {
        const TIMEOUT_MS = 30000; // 30 secondes
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 2000; // 2 secondes entre chaque retry

        async function verifyPaymentWithRetry(attempt: number = 1): Promise<void> {
            if (!sessionId) {
                setStatus("error");
                setErrorMessage("Session de paiement introuvable");
                return;
            }

            // Créer un AbortController pour le timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            try {
                const response = await fetch("/api/onboarding/verify-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionId }),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);
                const data = await response.json();

                if (!response.ok) {
                    // Si erreur serveur et qu'on peut réessayer
                    if (response.status >= 500 && attempt < MAX_RETRIES) {
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                        return verifyPaymentWithRetry(attempt + 1);
                    }
                    setStatus("error");
                    setErrorMessage(data.message || "Une erreur est survenue");
                    return;
                }

                // Récupérer les détails de l'abonnement depuis les query params
                const plan = (searchParams.get("plan") || "STARTER") as PlanType;
                const interval = (searchParams.get("interval") || "month") as "month" | "year";

                // Utiliser la config centralisée pour les prix
                const details = getPlanPriceDetails(plan, interval);
                setSubscriptionDetails({
                    planName: details.planName,
                    price: details.price,
                    billingPeriod: details.billingPeriod,
                    trialDays: details.trialDays,
                });

                if (data.alreadyCompleted) {
                    setStatus("already_completed");
                } else {
                    setStatus("success");
                }
            } catch (error) {
                clearTimeout(timeoutId);

                // Gérer le timeout ou erreur réseau avec retry
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    return verifyPaymentWithRetry(attempt + 1);
                }

                // Message d'erreur approprié selon le type d'erreur
                if (error instanceof Error && error.name === "AbortError") {
                    setErrorMessage("La vérification a pris trop de temps. Veuillez réessayer.");
                } else {
                    setErrorMessage("Impossible de vérifier le paiement. Vérifiez votre connexion.");
                }
                setStatus("error");
            }
        }

        verifyPaymentWithRetry();
    }, [sessionId, searchParams]);

    const handleContinue = async () => {
        setIsRedirecting(true);
        try {
            // Rafraîchir la session pour que le JWT ait onboardingComplete = true
            await updateSession();
            // Petit délai pour laisser le temps au JWT de se mettre à jour
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Redirection avec rechargement complet pour s'assurer que le middleware a le nouveau JWT
            window.location.replace("/dashboard");
        } catch {
            // En cas d'erreur, on redirige quand même
            window.location.replace("/dashboard");
        }
    };

    // État de chargement
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-black/[0.02] flex items-center justify-center p-4">
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-black/5 flex items-center justify-center">
                            <Loader2 className="h-10 w-10 text-black/40 animate-spin" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                            Finalisation en cours...
                        </h1>
                        <p className="text-[15px] text-black/50 mt-2 max-w-sm mx-auto">
                            Nous préparons votre espace professionnel. Cela ne prendra que quelques secondes.
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 pt-4">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-2 w-2 rounded-full bg-black/20 animate-pulse"
                                style={{ animationDelay: `${i * 200}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // État d'erreur
    if (status === "error") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white to-black/[0.02] flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-black/5 flex items-center justify-center">
                            <XCircle className="h-10 w-10 text-black/40" strokeWidth={1.5} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                            Une erreur est survenue
                        </h1>
                        <p className="text-[15px] text-black/50 mt-2">
                            {errorMessage}
                        </p>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={() => router.push("/onboarding")}
                            className="w-full h-12 bg-black hover:bg-black/90 text-white text-[14px] font-medium rounded-xl"
                        >
                            Réessayer le paiement
                        </Button>
                        <Button
                            onClick={() => window.location.href = "mailto:support@mypropartner.fr"}
                            variant="outline"
                            className="w-full h-12 text-[14px] font-medium border-black/10 hover:bg-black/5 rounded-xl"
                        >
                            Contacter le support
                        </Button>
                    </div>

                    <p className="text-[12px] text-black/40 pt-4">
                        Référence de session : {sessionId?.slice(0, 20)}...
                    </p>
                </div>
            </div>
        );
    }

    // État de succès
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-black/[0.02]">
            {/* Confetti animation */}
            <SuccessConfetti />

            <div className="container max-w-3xl mx-auto px-4 py-12 sm:py-16">
                {/* Hero */}
                <SuccessHero
                    title={status === "already_completed" ? "Votre compte est prêt" : "Bienvenue dans votre nouvel espace"}
                    subtitle={
                        status === "already_completed"
                            ? "Votre espace professionnel est déjà configuré et prêt à l'emploi."
                            : "Votre paiement a été confirmé avec succès. Votre espace professionnel est maintenant actif."
                    }
                    className="mb-10"
                />

                {/* Main content grid */}
                <div className="grid gap-6 md:grid-cols-2 mb-10">
                    {/* Subscription recap */}
                    <SuccessSubscriptionRecap
                        planName={subscriptionDetails.planName}
                        price={subscriptionDetails.price}
                        billingPeriod={subscriptionDetails.billingPeriod}
                        trialDays={subscriptionDetails.trialDays}
                    />

                    {/* Quick tips */}
                    <div className="p-6 rounded-2xl bg-black text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Rocket className="h-5 w-5 text-white" strokeWidth={2} />
                            </div>
                            <h3 className="text-[15px] font-medium">
                                Conseil de pro
                            </h3>
                        </div>
                        <p className="text-[14px] text-white/70 leading-relaxed">
                            Commencez par importer vos clients existants. Vous pouvez le faire depuis un fichier Excel ou les ajouter manuellement. Plus vite votre base est prête, plus vite vous gagnerez du temps !
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-[12px] text-white/50">
                                Besoin d'aide ? Notre assistant IA est disponible 24/7 dans votre espace.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Next steps */}
                <SuccessNextSteps className="mb-10" />

                {/* CTA Button */}
                <div className="text-center space-y-6">
                    <Button
                        onClick={handleContinue}
                        disabled={isRedirecting}
                        size="lg"
                        className="h-14 px-10 bg-black hover:bg-black/90 text-white text-[15px] font-medium rounded-xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
                    >
                        {isRedirecting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Redirection en cours...
                            </>
                        ) : (
                            <>
                                Accéder à mon espace
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>

                    {/* Trust signals */}
                    <SuccessTrustSignals className="pt-4" />
                </div>

                {/* Footer */}
                <div className="text-center pt-12 border-t border-black/5 mt-12">
                    <p className="text-[12px] text-black/30">
                        Un email de confirmation a été envoyé à votre adresse.
                        <br />
                        Conservez-le pour vos archives.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Export avec Suspense boundary pour useSearchParams
export default function OnboardingSuccessPage() {
    return (
        <Suspense fallback={<SuccessPageFallback />}>
            <SuccessPageContent />
        </Suspense>
    );
}

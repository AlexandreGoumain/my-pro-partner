import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook pour gérer les abonnements Stripe
 */
export function useSubscription() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * Créer une session checkout pour souscrire à un plan
     */
    const subscribe = async (plan: "STARTER" | "PRO" | "ENTERPRISE", interval: "month" | "year") => {
        try {
            setLoading(true);

            const response = await fetch("/api/subscription/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan, interval }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la création de la session");
            }

            // Rediriger vers Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("URL de checkout manquante");
            }
        } catch (error: any) {
            console.error("[SUBSCRIBE_ERROR]", error);
            toast.error(error.message || "Erreur lors de la souscription");
            setLoading(false);
        }
    };

    /**
     * Annuler l'abonnement (à la fin de la période)
     */
    const cancelSubscription = async (reason?: string) => {
        try {
            setLoading(true);

            const response = await fetch("/api/subscription/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de l'annulation");
            }

            toast.success(data.message || "Abonnement annulé avec succès");
            router.refresh();
        } catch (error: any) {
            console.error("[CANCEL_SUBSCRIPTION_ERROR]", error);
            toast.error(error.message || "Erreur lors de l'annulation");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Réactiver un abonnement annulé
     */
    const resumeSubscription = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/subscription/resume", {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la réactivation");
            }

            toast.success(data.message || "Abonnement réactivé avec succès");
            router.refresh();
        } catch (error: any) {
            console.error("[RESUME_SUBSCRIPTION_ERROR]", error);
            toast.error(error.message || "Erreur lors de la réactivation");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Changer de plan (upgrade/downgrade)
     */
    const changePlan = async (
        plan: "STARTER" | "PRO" | "ENTERPRISE",
        interval: "month" | "year",
        prorate: boolean = true
    ) => {
        try {
            setLoading(true);

            const response = await fetch("/api/subscription/change-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan, interval, prorate }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors du changement de plan");
            }

            toast.success(data.message || "Plan modifié avec succès");
            router.refresh();
        } catch (error: any) {
            console.error("[CHANGE_PLAN_ERROR]", error);
            toast.error(error.message || "Erreur lors du changement de plan");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Ouvrir le Billing Portal Stripe
     */
    const openBillingPortal = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/subscription/portal");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de l'accès au portail");
            }

            // Rediriger vers le Billing Portal
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("URL du portail manquante");
            }
        } catch (error: any) {
            console.error("[BILLING_PORTAL_ERROR]", error);
            toast.error(error.message || "Erreur lors de l'accès au portail");
            setLoading(false);
        }
    };

    return {
        loading,
        subscribe,
        cancelSubscription,
        resumeSubscription,
        changePlan,
        openBillingPortal,
    };
}

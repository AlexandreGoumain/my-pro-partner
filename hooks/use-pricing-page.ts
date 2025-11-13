import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlanType } from "@/lib/pricing-config";

type IntervalType = "month" | "year";

interface PricingPageState {
    interval: IntervalType;
    loadingPlan: PlanType | null;
    loading: boolean;
}

export function usePricingPage() {
    const router = useRouter();
    const [state, setState] = useState<PricingPageState>({
        interval: "month",
        loadingPlan: null,
        loading: false,
    });

    const setInterval = (interval: IntervalType) => {
        setState((prev) => ({ ...prev, interval }));
    };

    const handleSubscribe = async (planId: PlanType) => {
        if (planId === "FREE") {
            router.push("/auth/register");
            return;
        }

        setState((prev) => ({ ...prev, loadingPlan: planId, loading: true }));

        try {
            const response = await fetch("/api/subscription/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId, interval: state.interval }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la création de la session");
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("URL de checkout manquante");
            }
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la souscription");
            setState((prev) => ({ ...prev, loadingPlan: null, loading: false }));
        }
    };

    const getPrice = (priceMonthly: number, priceYearly: number) => {
        return state.interval === "month" ? priceMonthly : priceYearly;
    };

    const getSavings = (priceMonthly: number, priceYearly: number) => {
        if (state.interval === "year" && priceMonthly > 0) {
            const yearlyTotal = priceMonthly * 12;
            const savings = yearlyTotal - priceYearly;
            return savings;
        }
        return 0;
    };

    return {
        interval: state.interval,
        loadingPlan: state.loadingPlan,
        loading: state.loading,
        setInterval,
        handleSubscribe,
        getPrice,
        getSavings,
    };
}

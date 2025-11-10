"use client";

import { useSession } from "next-auth/react";
import { PlanType } from "@/lib/pricing-config";
import { useMemo } from "react";

/**
 * Hook pour récupérer le plan de l'utilisateur depuis la session
 *
 * @returns Le plan de l'utilisateur (FREE par défaut si non connecté)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const userPlan = useUserPlan();
 *   // userPlan = "FREE" | "STARTER" | "PRO" | "ENTERPRISE"
 * }
 * ```
 */
export function useUserPlan(): PlanType {
    const { data: session } = useSession();

    return useMemo(() => {
        const plan = session?.user?.plan;

        // Valider que c'est un plan valide
        if (
            plan === "FREE" ||
            plan === "STARTER" ||
            plan === "PRO" ||
            plan === "ENTERPRISE"
        ) {
            return plan;
        }

        // Par défaut, FREE
        return "FREE";
    }, [session]);
}

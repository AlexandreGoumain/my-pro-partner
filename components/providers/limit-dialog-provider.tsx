"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PlanType, PlanLimits } from "@/lib/pricing-config";
import { usePlanLimits } from "@/hooks/use-plan-limits";
import { LimitReachedDialog } from "@/components/paywall";
import { useUserPlan } from "@/hooks/use-user-plan";

interface LimitDialogContextValue {
    /**
     * Vérifier une limite numérique et afficher le dialog si atteinte
     * @returns true si l'action peut continuer, false si limite atteinte
     */
    checkLimit: (limitKey: keyof PlanLimits, currentValue: number) => boolean;

    /**
     * Vérifier une feature booléenne et afficher le dialog si non disponible
     * @returns true si la feature est disponible, false sinon
     */
    checkFeature: (feature: keyof PlanLimits) => boolean;

    /**
     * Afficher manuellement le dialog pour une limite donnée
     */
    showDialog: (limitKey: keyof PlanLimits) => void;

    /**
     * Fermer le dialog
     */
    closeDialog: () => void;

    /**
     * Plan actuel de l'utilisateur
     */
    userPlan: PlanType;
}

const LimitDialogContext = createContext<LimitDialogContextValue | undefined>(
    undefined
);

/**
 * Provider global pour gérer le dialog de limite atteinte
 *
 * À placer au niveau du layout principal pour être accessible partout
 *
 * @example
 * ```tsx
 * // app/(dashboard)/layout.tsx
 * import { LimitDialogProvider } from "@/components/providers/limit-dialog-provider";
 *
 * export default function DashboardLayout({ children }) {
 *   return (
 *     <LimitDialogProvider>
 *       {children}
 *     </LimitDialogProvider>
 *   );
 * }
 * ```
 */
export function LimitDialogProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { update: updateSession } = useSession();
    const userPlan = useUserPlan();
    const { isLimited, canUse } = usePlanLimits(userPlan);

    const [isOpen, setIsOpen] = useState(false);
    const [currentLimitKey, setCurrentLimitKey] = useState<
        keyof PlanLimits | null
    >(null);

    // Auto-refresh de la session quand l'utilisateur revient sur l'onglet
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                // Rafraîchir la session quand l'utilisateur revient sur l'onglet
                updateSession();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [updateSession]);

    /**
     * Vérifier une limite et afficher le dialog si atteinte
     */
    const checkLimit = useCallback(
        (limitKey: keyof PlanLimits, currentValue: number): boolean => {
            const limited = isLimited(limitKey, currentValue);
            if (limited) {
                setCurrentLimitKey(limitKey);
                setIsOpen(true);
                return false;
            }
            return true;
        },
        [isLimited]
    );

    /**
     * Vérifier une feature booléenne et afficher le dialog si non disponible
     */
    const checkFeature = useCallback(
        (feature: keyof PlanLimits): boolean => {
            const hasAccess = canUse(feature);
            if (!hasAccess) {
                setCurrentLimitKey(feature);
                setIsOpen(true);
                return false;
            }
            return true;
        },
        [canUse]
    );

    /**
     * Afficher manuellement le dialog
     */
    const showDialog = useCallback((limitKey: keyof PlanLimits) => {
        setCurrentLimitKey(limitKey);
        setIsOpen(true);
    }, []);

    /**
     * Fermer le dialog
     */
    const closeDialog = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <LimitDialogContext.Provider
            value={{
                checkLimit,
                checkFeature,
                showDialog,
                closeDialog,
                userPlan,
            }}
        >
            {children}

            {/* Dialog global - une seule instance pour toute l'app */}
            <LimitReachedDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                userPlan={userPlan}
                limitKey={currentLimitKey || ("maxClients" as keyof PlanLimits)} // Fallback
            />
        </LimitDialogContext.Provider>
    );
}

/**
 * Hook pour utiliser le dialog de limite dans n'importe quel composant
 *
 * @example
 * ```tsx
 * function ClientsPage() {
 *   const { checkLimit, userPlan } = useLimitDialog();
 *
 *   function handleCreateClient() {
 *     if (!checkLimit("maxClients", clientsCount)) {
 *       return; // Dialog s'affiche automatiquement
 *     }
 *     // Créer le client...
 *   }
 * }
 * ```
 */
export function useLimitDialog() {
    const context = useContext(LimitDialogContext);

    if (context === undefined) {
        throw new Error(
            "useLimitDialog must be used within a LimitDialogProvider"
        );
    }

    return context;
}

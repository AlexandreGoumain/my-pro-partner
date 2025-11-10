"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { PlanType, PLAN_PRICING, PlanLimits } from "@/lib/pricing-config";
import { usePlanLimits } from "@/hooks/use-plan-limits";

interface LimitReachedDialogProps {
    /**
     * État d'ouverture du dialog
     */
    open: boolean;

    /**
     * Callback quand le dialog se ferme
     */
    onOpenChange: (open: boolean) => void;

    /**
     * Plan actuel de l'utilisateur
     */
    userPlan: PlanType;

    /**
     * Clé de la limite atteinte
     */
    limitKey: keyof PlanLimits;

    /**
     * Message personnalisé (optionnel, sinon généré automatiquement)
     */
    customMessage?: string;

    /**
     * Titre personnalisé (optionnel)
     */
    customTitle?: string;

    /**
     * Callback après redirection vers upgrade (optionnel)
     */
    onUpgradeClick?: () => void;
}

/**
 * Dialog élégant qui s'affiche quand une limite de plan est atteinte
 *
 * Design minimaliste style Apple, avec informations claires sur le plan recommandé
 *
 * @example
 * ```tsx
 * const [dialogOpen, setDialogOpen] = useState(false);
 *
 * function handleCreateClient() {
 *   if (isLimited("maxClients", clientsCount)) {
 *     setDialogOpen(true);
 *     return;
 *   }
 *   // Créer le client...
 * }
 *
 * return (
 *   <>
 *     <Button onClick={handleCreateClient}>Créer un client</Button>
 *     <LimitReachedDialog
 *       open={dialogOpen}
 *       onOpenChange={setDialogOpen}
 *       userPlan={userPlan}
 *       limitKey="maxClients"
 *     />
 *   </>
 * );
 * ```
 */
export function LimitReachedDialog({
    open,
    onOpenChange,
    userPlan,
    limitKey,
    customMessage,
    customTitle,
    onUpgradeClick,
}: LimitReachedDialogProps) {
    const { getErrorMessage, getUpgradePlan, limits } = usePlanLimits(userPlan);

    const recommendedPlan = getUpgradePlan(limitKey);
    const planInfo = recommendedPlan ? PLAN_PRICING[recommendedPlan] : null;
    const currentLimit = limits[limitKey];

    // Message par défaut si non fourni
    const message = customMessage || getErrorMessage(limitKey);
    const title = customTitle || "Limite atteinte";

    // Icône selon le type de limite
    const getIcon = () => {
        if (recommendedPlan) {
            return <Sparkles className="w-6 h-6 text-black/60" strokeWidth={2} />;
        }
        return <Lock className="w-6 h-6 text-black/60" strokeWidth={2} />;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-black/10 bg-white p-0 overflow-hidden">
                {/* Header avec icône */}
                <DialogHeader className="space-y-4 p-6 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/5 mx-auto">
                        {getIcon()}
                    </div>
                    <div className="space-y-2">
                        <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em] text-black text-center">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-black/60 text-center leading-relaxed">
                            {message}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Info du plan recommandé */}
                {planInfo && (
                    <div className="px-6 pb-4">
                        <div className="p-4 bg-black/[0.02] rounded-lg border border-black/8">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-[13px] text-black/60 mb-1">
                                        Plan recommandé
                                    </p>
                                    <p className="text-[16px] font-semibold text-black tracking-[-0.01em]">
                                        {planInfo.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                                            {planInfo.price}€
                                        </span>
                                        <span className="text-[13px] text-black/40">/mois</span>
                                    </div>
                                    {planInfo.annualPrice && (
                                        <p className="text-[11px] text-black/40 mt-0.5">
                                            ou {planInfo.annualPrice}€/mois
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p className="text-[13px] text-black/60 leading-relaxed">
                                {planInfo.tagline}
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer avec boutons */}
                <DialogFooter className="p-6 pt-2 gap-3 sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 border-black/10 hover:bg-black/5 h-11 text-[14px] font-medium rounded-md"
                    >
                        Annuler
                    </Button>
                    <Button
                        asChild
                        onClick={onUpgradeClick}
                        className="flex-1 bg-black hover:bg-black/90 text-white h-11 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Link href={recommendedPlan ? `/pricing?plan=${recommendedPlan}` : "/pricing"}>
                            {recommendedPlan ? `Passer au plan ${planInfo?.name}` : "Voir les plans"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

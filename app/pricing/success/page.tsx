"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Composant qui utilise useSearchParams (doit être dans Suspense)
 */
function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const session_id = searchParams.get("session_id");

        if (session_id) {
            setSessionId(session_id);
            setLoading(false);
        } else {
            // Pas de session_id, rediriger vers pricing
            setTimeout(() => {
                router.push("/pricing");
            }, 2000);
        }
    }, [searchParams, router]);

    if (loading || !sessionId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
                    <p className="text-[14px] text-black/60">Vérification du paiement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="max-w-2xl w-full">
                {/* Icône de succès avec animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/5 mb-6">
                        <CheckCircle2 className="h-10 w-10 text-black" strokeWidth={2} />
                    </div>
                    <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-black mb-3">
                        Abonnement confirmé !
                    </h1>
                    <p className="text-[16px] text-black/60 max-w-md mx-auto">
                        Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités de votre plan.
                    </p>
                </div>

                {/* Carte principale */}
                <Card className="border-black/8 shadow-sm mb-6">
                    <div className="p-8">
                        {/* Informations de l'abonnement */}
                        <div className="mb-8">
                            <h2 className="text-[18px] font-semibold text-black mb-4">
                                Prochaines étapes
                            </h2>
                            <div className="space-y-4">
                                <StepItem
                                    number={1}
                                    title="Essai gratuit de 14 jours"
                                    description="Vous ne serez pas facturé pendant les 14 prochains jours. Profitez-en pour explorer toutes les fonctionnalités !"
                                />
                                <StepItem
                                    number={2}
                                    title="Email de confirmation"
                                    description="Vous recevrez un email avec les détails de votre abonnement et votre première facture."
                                />
                                <StepItem
                                    number={3}
                                    title="Accédez à votre tableau de bord"
                                    description="Commencez à utiliser MyProPartner dès maintenant avec toutes les fonctionnalités de votre plan."
                                />
                            </div>
                        </div>

                        {/* Avantages */}
                        <div className="bg-black/2 rounded-lg p-6 mb-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Sparkles className="h-5 w-5 text-black/60 mt-0.5" strokeWidth={2} />
                                <div>
                                    <h3 className="text-[15px] font-semibold text-black mb-2">
                                        Ce qui est inclus dans votre plan
                                    </h3>
                                    <ul className="space-y-2 text-[14px] text-black/60">
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                                            Gestion illimitée de vos clients et documents
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                                            Facturation et devis professionnels
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                                            Programme de fidélité pour vos clients
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                                            Assistant IA pour vous aider au quotidien
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                                            Support client réactif
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                asChild
                                className="flex-1 h-11 bg-black hover:bg-black/90 text-white text-[14px] font-medium rounded-md shadow-sm"
                            >
                                <Link href="/dashboard">
                                    Accéder au tableau de bord
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1 h-11 border-black/10 hover:bg-black/5 text-[14px] font-medium rounded-md"
                            >
                                <Link href="/dashboard/settings?tab=subscription">
                                    Gérer mon abonnement
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Aide */}
                <div className="text-center">
                    <p className="text-[13px] text-black/40 mb-2">
                        Besoin d'aide ?
                    </p>
                    <div className="flex items-center justify-center gap-4 text-[13px]">
                        <Link
                            href="/support"
                            className="text-black/60 hover:text-black transition-colors"
                        >
                            Centre d'aide
                        </Link>
                        <span className="text-black/20">•</span>
                        <Link
                            href="mailto:support@mypropartner.com"
                            className="text-black/60 hover:text-black transition-colors"
                        >
                            Contacter le support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Composant pour une étape
 */
function StepItem({ number, title, description }: { number: number; title: string; description: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[14px] font-semibold">
                {number}
            </div>
            <div className="flex-1 pt-0.5">
                <h3 className="text-[15px] font-semibold text-black mb-1">
                    {title}
                </h3>
                <p className="text-[14px] text-black/60">
                    {description}
                </p>
            </div>
        </div>
    );
}

/**
 * Page principale avec Suspense boundary
 */
export default function SubscriptionSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
                    <p className="text-[14px] text-black/60">Chargement...</p>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}

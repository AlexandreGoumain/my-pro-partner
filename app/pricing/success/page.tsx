"use client";

import {
    BenefitItem,
    SubscriptionVerificationLoader,
    TimelineStep,
} from "@/components/subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSubscriptionSuccess } from "@/hooks/use-subscription-success";
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Crown,
    Gift,
    Mail,
    Rocket,
    Sparkles,
    Star,
    TrendingUp,
    Zap,
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import Link from "next/link";
import { SuspensePage } from "@/components/ui/suspense-page";

/**
 * Success content component (must be wrapped in Suspense due to useSearchParams)
 */
function SuccessContent() {
    const { verified, sessionId, handleVerified } = useSubscriptionSuccess();

    // Afficher le loader de vérification tant que non vérifié
    if (!verified && sessionId) {
        return (
            <SubscriptionVerificationLoader
                sessionId={sessionId}
                onVerified={handleVerified}
            />
        );
    }

    // Une fois vérifié, afficher la page de succès
    return (
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-5xl mx-auto">
                {/* Hero Section avec animation */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Badge success avec glow effect */}
                    <div className="inline-flex items-center justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-black/3 blur-3xl rounded-full scale-150" />
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black shadow-xl">
                                <CheckCircle2
                                    className="h-10 w-10 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-[48px] font-semibold tracking-[-0.03em] text-black mb-4 leading-tight">
                        Bienvenue dans
                        <br />
                        MyProPartner ! 🎉
                    </h1>

                    <p className="text-[18px] text-black/60 max-w-xl mx-auto leading-relaxed mb-6">
                        Votre abonnement a été activé avec succès.
                        <br />
                        Vous êtes prêt à transformer votre gestion
                        d&apos;entreprise.
                    </p>

                    {/* Trial badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white shadow-sm">
                        <Gift className="w-4 h-4" strokeWidth={2} />
                        <span className="text-[14px] font-medium">
                            Essai gratuit de 14 jours activé
                        </span>
                    </div>
                </div>

                {/* Grille principale */}
                <div className="grid lg:grid-cols-3 gap-5 mb-10">
                    {/* Colonne gauche - Timeline */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Card prochaines étapes */}
                        <Card className="border-black/8 shadow-sm overflow-hidden">
                            <div className="bg-black/[0.02] p-5 border-b border-black/8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm border border-black/8">
                                        <Rocket
                                            className="w-5 h-5 text-black"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-[20px] font-semibold text-black tracking-[-0.02em]">
                                            Vos prochaines étapes
                                        </h2>
                                        <p className="text-[13px] text-black/60">
                                            Commencez en quelques minutes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-5">
                                <div className="space-y-4">
                                    <TimelineStep
                                        number={1}
                                        icon={Calendar}
                                        title="14 jours gratuits pour tout tester"
                                        description="Profitez de toutes les fonctionnalités premium sans débourser un centime. Aucune facturation avant la fin de votre période d'essai."
                                        delay={200}
                                    />
                                    <TimelineStep
                                        number={2}
                                        icon={Mail}
                                        title="Confirmation envoyée par email"
                                        description="Vérifiez votre boîte mail pour les détails de votre abonnement et votre première facture (à venir dans 14 jours)."
                                        delay={400}
                                    />
                                    <TimelineStep
                                        number={3}
                                        icon={Zap}
                                        title="Explorez votre tableau de bord"
                                        description="Tout est prêt ! Accédez immédiatement à toutes les fonctionnalités de votre plan et commencez à gérer votre entreprise."
                                        delay={600}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* CTA Principal */}
                        <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                            <Button
                                asChild
                                className="flex-1 h-12 bg-black hover:bg-black/90 text-white text-[15px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <Link href="/dashboard">
                                    <Sparkles
                                        className="mr-2 h-4 w-4"
                                        strokeWidth={2}
                                    />
                                    Accéder au tableau de bord
                                    <ArrowRight
                                        className="ml-2 h-4 w-4"
                                        strokeWidth={2.5}
                                    />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="sm:w-auto h-12 border-black/10 hover:bg-black/5 text-[15px] font-medium rounded-lg px-6"
                            >
                                <Link href="/dashboard/settings?tab=subscription">
                                    Gérer mon abonnement
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Colonne droite - Avantages */}
                    <div className="space-y-5">
                        {/* Ce qui vous attend */}
                        <Card className="border-black/8 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                            <div className="bg-black p-5 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown
                                        className="w-4 h-4"
                                        strokeWidth={2}
                                    />
                                    <h3 className="text-[16px] font-semibold">
                                        Ce qui vous attend
                                    </h3>
                                </div>
                                <p className="text-[13px] text-white/70">
                                    Découvrez tout ce que vous pouvez faire
                                </p>
                            </div>

                            <CardContent className="p-5">
                                <ul className="space-y-3">
                                    <BenefitItem
                                        icon={CheckCircle2}
                                        text="Gestion illimitée clients & documents"
                                    />
                                    <BenefitItem
                                        icon={TrendingUp}
                                        text="Facturation professionnelle automatisée"
                                    />
                                    <BenefitItem
                                        icon={Star}
                                        text="Programme de fidélité client"
                                    />
                                    <BenefitItem
                                        icon={Sparkles}
                                        text="Assistant IA intelligent"
                                    />
                                    <BenefitItem
                                        icon={Zap}
                                        text="Analytics et rapports en temps réel"
                                    />
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Besoin d'aide */}
                        <Card className="border-black/8 shadow-sm bg-black/[0.02] animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                            <CardContent className="p-5">
                                <div className="text-center">
                                    <p className="text-[14px] font-medium text-black mb-3">
                                        Besoin d&apos;aide pour démarrer ?
                                    </p>
                                    <div className="space-y-1.5">
                                        <Link
                                            href="/support"
                                            className="block text-[13px] text-black/60 hover:text-black transition-colors"
                                        >
                                            → Centre d&apos;aide
                                        </Link>
                                        <Link
                                            href="mailto:support@mypropartner.com"
                                            className="block text-[13px] text-black/60 hover:text-black transition-colors"
                                        >
                                            → Contacter le support
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer message */}
                <div className="text-center animate-in fade-in duration-1000 delay-1000">
                    <p className="text-[13px] text-black/40">
                        Merci de faire confiance à MyProPartner pour votre
                        gestion d&apos;entreprise 🚀
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Main page with Suspense boundary
 */
export default function SubscriptionSuccessPage() {
    return (
        <SuspensePage
            fallback={<LoadingState variant="fullscreen" spinnerSize={28} />}
        >
            <SuccessContent />
        </SuspensePage>
    );
}

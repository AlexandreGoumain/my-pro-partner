"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    Loader2,
    ArrowRight,
    Sparkles,
    Crown,
    Star,
    Zap,
    Gift,
    TrendingUp,
    Calendar,
    Mail,
    Rocket,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { SubscriptionVerificationLoader } from "@/components/subscription/subscription-verification-loader";

/**
 * Composant qui utilise useSearchParams (doit être dans Suspense)
 */
function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { update: updateSession } = useSession();
    const [verified, setVerified] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const session_id = searchParams.get("session_id");

        if (session_id) {
            setSessionId(session_id);
        } else {
            // Pas de session_id, rediriger vers pricing
            setTimeout(() => {
                router.push("/pricing");
            }, 2000);
        }
    }, [searchParams, router]);

    // Effet de confettis quand la vérification est terminée
    useEffect(() => {
        if (!verified) return;

        // Premier burst de confettis après un court délai
        const timer1 = setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#000000', '#333333', '#666666', '#999999'],
            });
        }, 300);

        // Deuxième burst
        const timer2 = setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#000000', '#333333', '#666666'],
            });
        }, 600);

        // Troisième burst
        const timer3 = setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#000000', '#333333', '#666666'],
            });
        }, 900);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [verified]);

    const handleVerified = async () => {
        // Rafraîchir la session NextAuth après vérification
        await updateSession();
        setVerified(true);
    };

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
                                <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-[48px] font-semibold tracking-[-0.03em] text-black mb-4 leading-tight">
                        Bienvenue dans<br />MyProPartner ! 🎉
                    </h1>

                    <p className="text-[18px] text-black/60 max-w-xl mx-auto leading-relaxed mb-6">
                        Votre abonnement a été activé avec succès.<br />
                        Vous êtes prêt à transformer votre gestion d'entreprise.
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
                                        <Rocket className="w-5 h-5 text-black" strokeWidth={2} />
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
                                    <Sparkles className="mr-2 h-4 w-4" strokeWidth={2} />
                                    Accéder au tableau de bord
                                    <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.5} />
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
                                    <Crown className="w-4 h-4" strokeWidth={2} />
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
                                        Besoin d'aide pour démarrer ?
                                    </p>
                                    <div className="space-y-1.5">
                                        <Link
                                            href="/support"
                                            className="block text-[13px] text-black/60 hover:text-black transition-colors"
                                        >
                                            → Centre d'aide
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
                        Merci de faire confiance à MyProPartner pour votre gestion d'entreprise 🚀
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Composant Timeline Step avec animation
 */
function TimelineStep({
    number,
    icon: Icon,
    title,
    description,
    delay = 0,
}: {
    number: number;
    icon: any;
    title: string;
    description: string;
    delay?: number;
}) {
    return (
        <div
            className="flex items-start gap-3.5 animate-in fade-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex-shrink-0">
                <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white shadow-sm">
                        <span className="text-[15px] font-semibold">{number}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-black/10">
                        <Icon className="h-2.5 w-2.5 text-black" strokeWidth={2.5} />
                    </div>
                </div>
            </div>
            <div className="flex-1 pt-0.5">
                <h3 className="text-[15px] font-semibold text-black mb-1 leading-tight">
                    {title}
                </h3>
                <p className="text-[13px] text-black/60 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

/**
 * Composant Benefit Item
 */
function BenefitItem({ icon: Icon, text }: { icon: any; text: string }) {
    return (
        <li className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 flex-shrink-0">
                <Icon className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] text-black/80 font-medium leading-snug">
                {text}
            </span>
        </li>
    );
}

/**
 * Page principale avec Suspense boundary
 */
export default function SubscriptionSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="text-center">
                        <Loader2 className="h-7 w-7 animate-spin text-black mx-auto mb-3" />
                        <p className="text-[14px] text-black/60">Chargement...</p>
                    </div>
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}

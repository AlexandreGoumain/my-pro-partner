"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type VerificationStatus = "verifying" | "syncing" | "success" | "error" | "waiting";

interface SubscriptionVerificationLoaderProps {
    onVerified?: () => void;
    sessionId?: string;
}

export function SubscriptionVerificationLoader({
    onVerified,
    sessionId,
}: SubscriptionVerificationLoaderProps) {
    const [status, setStatus] = useState<VerificationStatus>("verifying");
    const [message, setMessage] = useState("Vérification de votre abonnement...");
    const [attempt, setAttempt] = useState(0);
    const [canRetry, setCanRetry] = useState(false);

    const verify = async () => {
        try {
            setStatus("verifying");
            setMessage("Vérification de votre abonnement avec Stripe...");
            setCanRetry(false);

            const response = await fetch("/api/subscription/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stripeSessionId: sessionId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur de vérification");
            }

            switch (data.status) {
                case "verified":
                    setStatus("success");
                    setMessage("✓ Abonnement activé avec succès !");
                    setTimeout(() => onVerified?.(), 1500);
                    break;

                case "synced":
                    setStatus("syncing");
                    setMessage("Synchronisation des données en cours...");
                    setTimeout(() => {
                        setStatus("success");
                        setMessage("✓ Abonnement activé et synchronisé !");
                        setTimeout(() => onVerified?.(), 1500);
                    }, 1500);
                    break;

                case "waiting":
                    setStatus("waiting");
                    setMessage("En attente de la confirmation Stripe...");
                    // Retry après 2 secondes
                    if (attempt < 15) {
                        setTimeout(() => {
                            setAttempt(prev => prev + 1);
                            verify();
                        }, 2000);
                    } else {
                        setStatus("error");
                        setMessage("La vérification prend plus de temps que prévu");
                        setCanRetry(true);
                    }
                    break;

                default:
                    setStatus("error");
                    setMessage(data.error || "Une erreur est survenue");
                    setCanRetry(true);
            }
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "Erreur de connexion");
            setCanRetry(true);
        }
    };

    useEffect(() => {
        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRetry = () => {
        setAttempt(0);
        verify();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <Card className="w-full max-w-md border-black/8 shadow-sm">
                <CardContent className="p-8">
                    <div className="text-center">
                        {/* Icône animée selon le statut */}
                        <div className="mb-6 flex justify-center">
                            {status === "verifying" && (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-black/5 blur-2xl rounded-full animate-pulse" />
                                    <Loader2 className="h-16 w-16 text-black animate-spin relative" strokeWidth={2} />
                                </div>
                            )}

                            {status === "syncing" && (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-black/5 blur-2xl rounded-full animate-pulse" />
                                    <RefreshCw className="h-16 w-16 text-black animate-spin relative" strokeWidth={2} />
                                </div>
                            )}

                            {status === "waiting" && (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-black/5 blur-2xl rounded-full animate-pulse" />
                                    <Clock className="h-16 w-16 text-black/60 relative animate-pulse" strokeWidth={2} />
                                </div>
                            )}

                            {status === "success" && (
                                <div className="relative animate-in zoom-in duration-500">
                                    <div className="absolute inset-0 bg-black/5 blur-2xl rounded-full" />
                                    <CheckCircle2 className="h-16 w-16 text-black relative" strokeWidth={2} />
                                </div>
                            )}

                            {status === "error" && (
                                <div className="relative animate-in zoom-in duration-300">
                                    <AlertCircle className="h-16 w-16 text-black/40" strokeWidth={2} />
                                </div>
                            )}
                        </div>

                        {/* Message principal */}
                        <h2 className="text-[24px] font-semibold text-black mb-3 tracking-[-0.02em]">
                            {status === "verifying" && "Vérification en cours"}
                            {status === "syncing" && "Synchronisation"}
                            {status === "waiting" && "Patience..."}
                            {status === "success" && "Tout est prêt !"}
                            {status === "error" && "Oups..."}
                        </h2>

                        <p className="text-[14px] text-black/60 mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Indicateur de progression */}
                        {(status === "verifying" || status === "syncing" || status === "waiting") && (
                            <div className="mb-6">
                                <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full transition-all duration-500 animate-pulse"
                                        style={{
                                            width: status === "syncing" ? "75%" : status === "waiting" ? "50%" : "25%"
                                        }}
                                    />
                                </div>
                                {status === "waiting" && (
                                    <p className="text-[12px] text-black/40 mt-2">
                                        Tentative {attempt + 1}/15
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {status === "error" && canRetry && (
                            <div className="space-y-3">
                                <Button
                                    onClick={handleRetry}
                                    className="w-full h-11 bg-black hover:bg-black/90 text-white"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Réessayer
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = "/dashboard/settings?tab=subscription"}
                                    className="w-full h-11 border-black/10 hover:bg-black/5"
                                >
                                    Accéder aux paramètres
                                </Button>
                                <p className="text-[12px] text-black/40 pt-2">
                                    Si le problème persiste, contactez le support
                                </p>
                            </div>
                        )}

                        {status === "success" && (
                            <Button
                                onClick={onVerified}
                                className="w-full h-11 bg-black hover:bg-black/90 text-white"
                            >
                                Continuer
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

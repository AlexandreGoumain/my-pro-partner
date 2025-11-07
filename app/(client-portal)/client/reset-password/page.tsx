"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Token invalide. Veuillez refaire une demande.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Token manquant");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/client/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Erreur lors de la réinitialisation");
                return;
            }

            setSuccess(true);
            toast.success(data.message);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/client/login");
            }, 2000);
        } catch (error) {
            toast.error("Erreur lors de la réinitialisation du mot de passe");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <Card className="border-black/8 shadow-sm max-w-md w-full">
                    <div className="p-6 text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                            <Lock className="h-8 w-8 text-black/60" />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black mb-2">
                                Lien invalide
                            </h2>
                            <p className="text-[14px] text-black/60">
                                Ce lien de réinitialisation est invalide ou a expiré.
                            </p>
                        </div>
                        <Link href="/client/forgot-password">
                            <Button className="bg-black hover:bg-black/90 text-white">
                                Refaire une demande
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black mb-2">
                        Réinitialiser le mot de passe
                    </h1>
                    <p className="text-[14px] text-black/60">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>
                </div>

                {!success ? (
                    <Card className="border-black/8 shadow-sm">
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="newPassword"
                                    className="text-[13px] text-black/60"
                                >
                                    Nouveau mot de passe
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 8 caractères"
                                        className="pl-10 pr-10 h-11 border-black/10 focus:border-black/20"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-[13px] text-black/60"
                                >
                                    Confirmer le mot de passe
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirmez le mot de passe"
                                        className="pl-10 h-11 border-black/10 focus:border-black/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-black/5 p-4">
                                <p className="text-[13px] text-black/60">
                                    ℹ️ Le mot de passe doit contenir au moins 8 caractères.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-black hover:bg-black/90 text-white text-[14px] font-medium"
                            >
                                {isLoading
                                    ? "Réinitialisation..."
                                    : "Réinitialiser le mot de passe"}
                            </Button>
                        </form>
                    </Card>
                ) : (
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-6 space-y-5">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-black/5 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-black" />
                                </div>

                                <div>
                                    <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black mb-2">
                                        Mot de passe réinitialisé !
                                    </h2>
                                    <p className="text-[14px] text-black/60">
                                        Votre mot de passe a été modifié avec succès. Vous
                                        allez être redirigé vers la page de connexion...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-[14px] text-black/60">Chargement...</div>
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}

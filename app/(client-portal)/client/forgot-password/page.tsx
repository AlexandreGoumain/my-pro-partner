"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { usePasswordReset } from "@/hooks/use-password-reset";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const { isLoading, success, resetLink, requestReset } = usePasswordReset();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await requestReset(email);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black mb-2">
                        Mot de passe oublié ?
                    </h1>
                    <p className="text-[14px] text-black/60">
                        Entrez votre adresse email pour recevoir un lien de
                        réinitialisation
                    </p>
                </div>

                {!success ? (
                    <Card className="border-black/8 shadow-sm">
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-[13px] text-black/60"
                                >
                                    Adresse email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre.email@exemple.com"
                                        className="pl-10 h-11 border-black/10 focus:border-black/20"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-black hover:bg-black/90 text-white text-[14px] font-medium"
                            >
                                {isLoading
                                    ? "Envoi en cours..."
                                    : "Envoyer le lien de réinitialisation"}
                            </Button>

                            <div className="pt-4 border-t border-black/8">
                                <Link
                                    href="/client/login"
                                    className="flex items-center justify-center gap-2 text-[14px] text-black/60 hover:text-black transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour à la connexion
                                </Link>
                            </div>
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
                                        Email envoyé !
                                    </h2>
                                    <p className="text-[14px] text-black/60">
                                        Si un compte existe avec l&apos;adresse{" "}
                                        <span className="font-medium text-black">
                                            {email}
                                        </span>
                                        , vous recevrez un lien de réinitialisation dans
                                        quelques instants.
                                    </p>
                                </div>

                                {resetLink && (
                                    <div className="w-full rounded-lg bg-black/5 p-4 text-left">
                                        <p className="text-[11px] text-black/40 uppercase tracking-wider font-medium mb-2">
                                            Mode développement
                                        </p>
                                        <p className="text-[13px] text-black/60 mb-2">
                                            Lien de réinitialisation :
                                        </p>
                                        <a
                                            href={resetLink}
                                            className="text-[13px] text-black hover:underline break-all"
                                        >
                                            {resetLink}
                                        </a>
                                    </div>
                                )}

                                <div className="rounded-lg bg-black/5 p-4 w-full">
                                    <p className="text-[13px] text-black/60">
                                        ℹ️ Vérifiez également votre dossier spam si vous ne
                                        recevez pas l&apos;email dans les 5 minutes.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/8">
                                <Link
                                    href="/client/login"
                                    className="flex items-center justify-center gap-2 text-[14px] text-black/60 hover:text-black transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour à la connexion
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

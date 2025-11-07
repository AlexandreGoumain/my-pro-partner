"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function ClientLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/client/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Erreur de connexion");
                setIsLoading(false);
                return;
            }

            // Store token
            localStorage.setItem("clientToken", data.token);

            // Redirect to dashboard
            router.push("/client/dashboard");
        } catch (err) {
            setError("Erreur de connexion. Veuillez réessayer.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-black mb-2">
                        Portail Client
                    </h1>
                    <p className="text-[15px] text-black/60">
                        Connectez-vous pour accéder à votre espace
                    </p>
                </div>

                {/* Login Form */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="rounded-lg bg-black/5 border border-black/10 p-4">
                                    <p className="text-[14px] text-black/80">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-[14px] font-medium text-black"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre.email@exemple.fr"
                                    required
                                    className="h-11 border-black/10 focus:border-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-[14px] font-medium text-black"
                                    >
                                        Mot de passe
                                    </Label>
                                    <Link
                                        href="/client/forgot-password"
                                        className="text-[13px] text-black/60 hover:text-black transition-colors"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="h-11 border-black/10 focus:border-black"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                            >
                                {isLoading ? (
                                    "Connexion..."
                                ) : (
                                    <>
                                        <LogIn
                                            className="h-4 w-4 mr-2"
                                            strokeWidth={2}
                                        />
                                        Se connecter
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-[13px] text-black/40">
                                Vous n&apos;avez pas de compte ?{" "}
                                <span className="text-black/60 font-medium">
                                    Demandez votre lien d&apos;inscription à l&apos;entreprise
                                </span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Footer */}
                <p className="text-center text-[13px] text-black/40">
                    Accès sécurisé réservé aux clients
                </p>
            </div>
        </div>
    );
}

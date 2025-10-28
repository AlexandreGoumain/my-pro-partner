"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, LogIn } from "lucide-react";

/**
 * Composant de branding pour les pages d'authentification
 */
export function AuthBranding({
    title = "MyProPartner",
    subtitle = "ERP Professionnel pour Artisans",
    features = [
        {
            title: "Gestion Simplifiée",
            description:
                "Gérez vos clients, devis et factures en quelques clics",
            icon: "blue",
        },
        {
            title: "Sécurité Garantie",
            description: "Vos données sont protégées et chiffrées",
            icon: "purple",
        },
        {
            title: "Support 24/7",
            description: "Une équipe dédiée pour vous accompagner",
            icon: "pink",
        },
    ],
    trustMessage = "Rejoignez des milliers de professionnels qui font confiance à MyProPartner",
}) {
    const colorMap = {
        blue: "bg-blue-500/10 text-blue-400",
        purple: "bg-purple-500/10 text-purple-400",
        pink: "bg-pink-500/10 text-pink-400",
    };

    return (
        <div className="flex flex-col justify-center items-start max-w-md space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <LogIn className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">{title}</h1>
                </div>
                <p className="text-slate-400 text-lg">{subtitle}</p>
            </div>

            <div className="space-y-6">
                {features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div
                                className={cn(
                                    "flex items-center justify-center h-10 w-10 rounded-lg",
                                    colorMap[
                                        feature.icon as keyof typeof colorMap
                                    ]
                                )}
                            >
                                <Check className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 text-sm">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-slate-700 w-full">
                <p className="text-slate-400 text-sm">{trustMessage}</p>
            </div>
        </div>
    );
}

/**
 * Composant d'erreur pour les formulaires d'authentification
 */
export function AuthError({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in">
            <div className="flex items-gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400 font-medium ml-2">
                    {message}
                </p>
            </div>
        </div>
    );
}

/**
 * Composant de succès avec animation
 */
export function AuthSuccess({
    icon = "check",
}: {
    message?: string;
    description?: string;
    icon?: string;
} = {}) {
    return (
        <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-full">
                    {icon === "check" && (
                        <svg
                            className="w-10 h-10 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Composant de divider
 */
export function AuthDivider() {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-slate-800/50 text-slate-500">ou</span>
            </div>
        </div>
    );
}

/**
 * Composant de footer avec liens légaux
 */
export function AuthFooter() {
    return (
        <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
                En utilisant MyProPartner, vous acceptez nos{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                    conditions d&apos;utilisation
                </a>{" "}
                et notre{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                    politique de confidentialité
                </a>
            </p>
        </div>
    );
}

/**
 * Loader animé pour les buttons
 */
export function LoadingSpinner() {
    return (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    );
}

function Check() {
    return (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
            />
        </svg>
    );
}

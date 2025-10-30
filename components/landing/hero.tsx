"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            L&apos;ERP moderne pour artisans
                        </span>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                        <span className="block">Gérez votre entreprise</span>
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            en toute simplicité
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        MyProPartner est l&apos;ERP tout-en-un conçu spécialement pour les artisans et PME.
                        Gérez vos clients, créez vos devis et factures, suivez vos stocks en un seul endroit.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button
                            size="lg"
                            asChild
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/50 transition-all hover:scale-105"
                        >
                            <Link href="/auth/register">
                                Commencer gratuitement
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="#demo">Voir la démo</Link>
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Essai gratuit 14 jours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Sans carte bancaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Support français</span>
                        </div>
                    </div>
                </div>

                {/* Product screenshot/mockup placeholder */}
                <div className="mt-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
                        <div className="relative rounded-2xl border border-border bg-background/50 backdrop-blur-sm p-2 shadow-2xl">
                            <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl">📊</div>
                                    <p className="text-muted-foreground">Capture d&apos;écran du dashboard à venir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

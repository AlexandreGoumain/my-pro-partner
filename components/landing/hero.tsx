"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative pt-40 sm:pt-48 pb-24 px-6 sm:px-8 overflow-hidden bg-white">
            <div className="max-w-[980px] mx-auto">
                <div className="text-center space-y-7">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08] mb-4 animate-in fade-in duration-700">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-black/10 border-2 border-white" />
                            <div className="w-6 h-6 rounded-full bg-black/10 border-2 border-white" />
                            <div className="w-6 h-6 rounded-full bg-black/10 border-2 border-white" />
                        </div>
                        <span className="text-[13px] text-black/60 font-medium">
                            Utilisé par 500+ artisans et PME
                        </span>
                    </div>

                    <h1 className="text-[56px] sm:text-[72px] lg:text-[96px] font-semibold tracking-[-0.03em] text-black leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Gérez votre entreprise
                        <br />
                        <span className="block mt-1">
                            en 3x moins de temps.
                        </span>
                    </h1>

                    <p className="text-[21px] sm:text-[24px] font-normal text-black/60 max-w-[720px] mx-auto leading-[1.4] tracking-[-0.01em] pt-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        L&apos;ERP tout-en-un qui fait gagner{" "}
                        <span className="text-black font-medium">
                            15h par semaine
                        </span>{" "}
                        aux artisans et PME. Devis, factures, clients, stocks,
                        tout au même endroit.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <Link href="/auth/register">
                            <Button
                                size="lg"
                                className="bg-black hover:bg-black/90 text-white rounded-full h-12 px-8 text-[15px] font-medium shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                            >
                                Démarrer gratuitement
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full h-12 px-8 text-[15px] font-medium border-black/10 hover:bg-black/5"
                            >
                                Voir les fonctionnalités
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-5 justify-center items-center pt-4 text-[13px] text-black/50 font-medium animate-in fade-in duration-700 delay-300">
                        <span>✓ Essai gratuit 14 jours</span>
                        <span className="w-1 h-1 rounded-full bg-black/20" />
                        <span>✓ Sans carte bancaire</span>
                        <span className="w-1 h-1 rounded-full bg-black/20" />
                        <span>✓ Configuration en 5 minutes</span>
                    </div>
                </div>

                <div className="mt-28 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
                    <div className="relative max-w-6xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-[32px] blur-3xl translate-y-8" />
                        <div className="relative rounded-[24px] overflow-hidden border border-black/10 shadow-2xl shadow-black/20 ring-1 ring-black/5">
                            <div className="aspect-[16/9] bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="text-8xl opacity-10">
                                        📊
                                    </div>
                                    <p className="text-black/30 text-[13px] font-medium">
                                        Product Preview
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

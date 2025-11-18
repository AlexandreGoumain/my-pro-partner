"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Clock, Shield, Zap } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-black/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1000px] mx-auto relative">
                <Card className="overflow-hidden border-black/[0.08] shadow-2xl bg-gradient-to-br from-black via-black to-black/90">
                    <div className="p-12 lg:p-16 text-center text-white space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.12] border border-white/[0.20]">
                            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                            <span className="text-[13px] text-white font-medium">
                                Offre de lancement • Jusqu'à -18% en annuel
                            </span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-4">
                            <h2 className="text-[42px] sm:text-[56px] lg:text-[68px] font-semibold tracking-[-0.03em] leading-[1.05]">
                                Prêt à gagner
                                <br />
                                <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                                    40h par semaine ?
                                </span>
                            </h2>
                            <p className="text-[19px] text-white/70 max-w-[600px] mx-auto leading-[1.5]">
                                Rejoignez les 500+ entreprises qui ont déjà transformé leur façon de
                                travailler avec MyProPartner.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/auth/register">
                                <Button
                                    size="lg"
                                    className="bg-white hover:bg-white/95 text-black rounded-full h-14 px-10 text-[16px] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                                >
                                    Commencer gratuitement
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-transparent border-2 border-white/30 hover:bg-white/10 hover:border-white/50 text-white rounded-full h-14 px-10 text-[16px] font-semibold"
                                >
                                    Demander une démo
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-[14px] text-white/70">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" strokeWidth={2} />
                                <span>14 jours gratuits</span>
                            </div>
                            <div className="w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" strokeWidth={2} />
                                <span>Sans carte bancaire</span>
                            </div>
                            <div className="w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4" strokeWidth={2} />
                                <span>Installation en 7 min</span>
                            </div>
                        </div>

                        {/* Guarantee */}
                        <div className="pt-8 border-t border-white/[0.1]">
                            <div className="inline-block p-5 rounded-2xl bg-white/[0.08] border border-white/[0.12]">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <Shield className="w-5 h-5 text-white" strokeWidth={2} />
                                        <p className="text-[16px] font-semibold text-white">
                                            Garantie satisfait ou remboursé 30 jours
                                        </p>
                                    </div>
                                    <p className="text-[13px] text-white/60">
                                        Si vous n'êtes pas satisfait, on vous rembourse. Sans
                                        condition.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bottom Stats */}
                <div className="mt-12 grid grid-cols-3 gap-6 text-center">
                    <div className="space-y-1">
                        <p className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            500+
                        </p>
                        <p className="text-[13px] text-black/60 font-medium">
                            Entreprises actives
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            40h
                        </p>
                        <p className="text-[13px] text-black/60 font-medium">
                            Gagnées par semaine
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            4.9/5
                        </p>
                        <p className="text-[13px] text-black/60 font-medium">Note moyenne</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

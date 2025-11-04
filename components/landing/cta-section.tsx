"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[800px] mx-auto text-center space-y-10">
                {/* Title */}
                <div className="space-y-4">
                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Prêt à gagner du temps ?
                    </h2>
                    <p className="text-[19px] text-black/60 leading-[1.5] max-w-[600px] mx-auto">
                        Rejoignez 500+ entreprises qui développent leur business sans se compliquer la vie.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Link href="/auth/register">
                        <Button
                            size="lg"
                            className="bg-black hover:bg-black/90 text-white rounded-full h-14 px-10 text-[15px] font-medium shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                        >
                            Commencer gratuitement
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </Link>
                    <Link href="#demo">
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full h-14 px-10 text-[15px] font-medium border-black/[0.1] hover:bg-black/[0.03]"
                        >
                            Voir la démo
                        </Button>
                    </Link>
                </div>

                {/* Simple benefits */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] text-black/60 pt-4">
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-black" strokeWidth={2} />
                        <span>14 jours gratuits</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-black" strokeWidth={2} />
                        <span>Sans carte bancaire</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-black" strokeWidth={2} />
                        <span>Installation en 2 min</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

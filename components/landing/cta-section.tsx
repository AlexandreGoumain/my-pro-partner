"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[840px] mx-auto text-center space-y-7">
                <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                    Prêt à commencer ?
                </h2>
                <p className="text-[19px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                    Commencez votre essai gratuit aujourd&apos;hui. Aucune carte
                    bancaire requise.
                </p>
                <div className="pt-4">
                    <Link href="/auth/register">
                        <Button
                            size="lg"
                            className="bg-black hover:bg-black/90 text-white rounded-full h-11 px-7 text-[14px] font-medium shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        >
                            Essayer gratuitement
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

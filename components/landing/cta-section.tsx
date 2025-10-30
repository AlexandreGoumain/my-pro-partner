"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 sm:p-16">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                            Prêt à simplifier votre gestion ?
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Rejoignez des centaines d&apos;artisans qui utilisent déjà MyProPartner pour
                            gagner du temps et développer leur activité.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                asChild
                                className="bg-white text-blue-600 hover:bg-white/90 shadow-xl"
                            >
                                <Link href="/auth/register">
                                    Commencer gratuitement
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="border-white text-white hover:bg-white/10"
                            >
                                <Link href="/auth/login">
                                    Se connecter
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-white/80 pt-2">
                            Essai gratuit 14 jours • Sans carte bancaire • Support français
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

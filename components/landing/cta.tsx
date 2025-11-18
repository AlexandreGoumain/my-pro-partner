"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function CTA() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/auth/register?email=${encodeURIComponent(email)}`;
    };

    return (
        <section className="px-6 gradient-subtle scroll-fade-in" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-[56px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[0.95] mb-6">
                    Prêt à gagner
                    <br />
                    <span className="text-black/50">40h par mois ?</span>
                </h2>

                <p className="text-[18px] text-black/50 mb-8 max-w-[600px] mx-auto">
                    Rejoignez les entreprises qui font confiance à MyProPartner pour automatiser leur gestion.
                </p>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Votre email professionnel"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-14 pr-40 text-[15px] border-black/[0.12] focus:border-black focus:ring-2 focus:ring-black/10 shadow-sm transition-all ease-premium"
                        />
                        <Button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm hover:shadow-md transition-all ease-premium group"
                            style={{ transitionDuration: '0.3s' }}
                        >
                            Commencer
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform ease-premium group-hover:translate-x-1" />
                        </Button>
                    </div>
                    <p className="text-[12px] text-black/40 mt-3">
                        14 jours gratuits • Sans carte bancaire
                    </p>
                </form>
            </div>
        </section>
    );
}

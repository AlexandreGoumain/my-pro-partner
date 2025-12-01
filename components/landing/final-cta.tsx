"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function FinalCTA() {
    const [waitlistCount, setWaitlistCount] = useState(0);

    useEffect(() => {
        const fetchWaitlistCount = async () => {
            try {
                const response = await fetch("/api/waitlist/count");
                if (response.ok) {
                    const data = await response.json();
                    setWaitlistCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch waitlist count:", error);
            }
        };
        fetchWaitlistCount();
    }, []);

    return (
        <section className="py-24 px-6 sm:px-8 bg-black">
            <div className="max-w-[700px] mx-auto text-center space-y-8">
                {/* Headline */}
                <div className="space-y-4">
                    <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] text-white leading-[1.1]">
                        Prêt à récupérer vos 3h par jour ?
                    </h2>
                    <p className="text-[17px] text-white/60 leading-relaxed">
                        Rejoignez la liste d&apos;attente. Soyez notifié au lancement et bénéficiez d&apos;un accès prioritaire.
                    </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/waitlist">
                        <Button
                            size="lg"
                            className="bg-white hover:bg-white/90 text-black h-13 px-8 text-[15px] font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                        >
                            Rejoindre la liste d&apos;attente
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Trust */}
                <div className="flex flex-wrap justify-center gap-6 text-[13px] text-white/50">
                    <span>✓ Sans carte bancaire</span>
                    <span>✓ 14 jours gratuits au lancement</span>
                    <span>✓ {waitlistCount} inscrit{waitlistCount > 1 ? "s" : ""}</span>
                </div>
            </div>
        </section>
    );
}

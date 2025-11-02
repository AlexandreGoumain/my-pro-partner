"use client";

import { Card } from "@/components/ui/card";
import {
    Award,
    Building2,
    Clock,
    FileCheck,
    Shield,
    TrendingUp,
} from "lucide-react";

export function SocialProofMetrics() {
    const metrics = [
        {
            icon: Building2,
            value: "500+",
            label: "Entreprises actives",
            description: "Artisans et PME qui nous font confiance",
        },
        {
            icon: FileCheck,
            value: "50k+",
            label: "Factures créées",
            description: "Documents générés chaque mois",
        },
        {
            icon: Clock,
            value: "15h",
            label: "Économisées/semaine",
            description: "En moyenne par utilisateur",
        },
        {
            icon: TrendingUp,
            value: "4.8/5",
            label: "Satisfaction moyenne",
            description: "Note donnée par nos utilisateurs",
        },
    ];

    const badges = [
        {
            icon: Shield,
            title: "Données sécurisées",
            description: "Hébergement en France, conforme RGPD",
        },
        {
            icon: Award,
            title: "Support réactif",
            description: "Réponse en moins de 2h en moyenne",
        },
    ];

    return (
        <section className="py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-5 mb-16">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Ils gagnent du temps chaque jour
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        MyProPartner aide des centaines d&apos;artisans et PME à
                        gérer leur entreprise plus efficacement
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <Card
                                key={index}
                                className="p-6 bg-neutral-50 border border-black/[0.08] hover:border-black/[0.12] transition-all duration-300"
                            >
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                                        <Icon
                                            className="w-6 h-6 text-black"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[40px] font-semibold tracking-[-0.02em] text-black leading-none">
                                            {metric.value}
                                        </div>
                                        <div className="text-[15px] font-medium text-black">
                                            {metric.label}
                                        </div>
                                        <div className="text-[13px] text-black/50 leading-[1.4]">
                                            {metric.description}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid sm:grid-cols-2 gap-6 max-w-[800px] mx-auto">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <Card
                                key={index}
                                className="p-6 bg-black border-none text-white hover:bg-black/90 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Icon
                                            className="w-6 h-6 text-white"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[16px] font-semibold">
                                            {badge.title}
                                        </div>
                                        <div className="text-[13px] text-white/60">
                                            {badge.description}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-neutral-50 border border-black/[0.08]">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-black/10 to-black/20 border-4 border-neutral-50"
                                />
                            ))}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[18px] font-semibold text-black">
                                Rejoignez des centaines d&apos;entrepreneurs
                            </p>
                            <p className="text-[14px] text-black/60">
                                Artisans, plombiers, électriciens, menuisiers,
                                et bien d&apos;autres nous font confiance
                            </p>
                        </div>
                        <a
                            href="/auth/register"
                            className="px-8 py-3 rounded-lg bg-black text-white text-[14px] font-medium hover:bg-black/90 transition-colors"
                        >
                            Essayer gratuitement
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

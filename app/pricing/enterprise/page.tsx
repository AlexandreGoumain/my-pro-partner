import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS_CONFIG } from "@/lib/config/plans.config";
import {
    Building2,
    Users,
    Headphones,
    Shield,
    Zap,
    Globe,
    Lock,
    BarChart3,
    Puzzle,
    GraduationCap,
    ArrowRight,
    Check,
    Star,
    ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Enterprise | MyProPartner",
    description:
        "Solution sur mesure pour les grandes organisations. Support dédié 24/7, intégrations personnalisées et SLA garanti.",
};

const enterpriseFeatures = [
    {
        icon: Users,
        title: "Utilisateurs illimités",
        description:
            "Toute votre équipe sur une seule plateforme, sans surcoût par utilisateur",
    },
    {
        icon: Headphones,
        title: "Support dédié 24/7",
        description:
            "Une équipe dédiée disponible à tout moment pour vous accompagner",
    },
    {
        icon: Shield,
        title: "SLA 99.9% garanti",
        description:
            "Engagement contractuel sur la disponibilité de la plateforme",
    },
    {
        icon: Zap,
        title: "Performance optimisée",
        description:
            "Infrastructure dédiée pour des temps de réponse ultra-rapides",
    },
    {
        icon: Globe,
        title: "Domaine personnalisé",
        description:
            "Votre propre domaine pour une expérience 100% à votre image",
    },
    {
        icon: Lock,
        title: "Sécurité renforcée",
        description: "SSO, audit logs, et conformité aux normes les plus strictes",
    },
    {
        icon: BarChart3,
        title: "Analytics avancées",
        description:
            "Tableaux de bord personnalisés et rapports sur mesure",
    },
    {
        icon: Puzzle,
        title: "Intégrations sur mesure",
        description:
            "API complète et développements personnalisés pour vos besoins",
    },
    {
        icon: GraduationCap,
        title: "Formation & Onboarding",
        description:
            "Accompagnement personnalisé pour une adoption réussie",
    },
];

const testimonials = [
    {
        quote: "MyProPartner Enterprise a transformé notre gestion. Le support dédié fait toute la différence.",
        author: "Marie D.",
        role: "Directrice, Groupe BTP+",
    },
    {
        quote: "Les intégrations sur mesure nous ont fait gagner des heures chaque semaine.",
        author: "Thomas L.",
        role: "DSI, Réseau Immo France",
    },
];

export default function EnterprisePage() {
    const enterprisePlan = PLANS_CONFIG.ENTERPRISE;

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <div className="border-b border-black/5">
                <div className="container max-w-6xl mx-auto px-4 py-4">
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 text-[14px] text-black/50 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux tarifs
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className="py-20 px-4">
                <div className="container max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 mb-6">
                        <Star className="h-4 w-4 text-white" />
                        <span className="text-[13px] font-medium text-white">
                            Solution Enterprise
                        </span>
                    </div>

                    <h1 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.03em] text-black leading-[1.1]">
                        Conçu pour les
                        <br />
                        <span className="bg-gradient-to-r from-black via-black/70 to-black bg-clip-text">
                            grandes ambitions
                        </span>
                    </h1>

                    <p className="mt-6 text-[18px] text-black/50 max-w-2xl mx-auto leading-relaxed">
                        Une solution sur mesure pour les organisations qui
                        exigent le meilleur : support dédié, sécurité renforcée
                        et fonctionnalités illimitées.
                    </p>

                    {/* CTA */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            className="h-12 px-8 text-[15px] font-medium bg-black hover:bg-black/90 text-white rounded-lg shadow-lg"
                        >
                            <Link href="/contact?plan=enterprise">
                                Contacter notre équipe
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-12 px-8 text-[15px] font-medium border-black/10 hover:bg-black/5 rounded-lg"
                        >
                            <Link href="/demo">Demander une démo</Link>
                        </Button>
                    </div>

                    {/* Prix indicatif */}
                    <p className="mt-8 text-[14px] text-black/40">
                        À partir de{" "}
                        <span className="font-semibold text-black">
                            {enterprisePlan.price.monthly}€/mois
                        </span>{" "}
                        · Tarification personnalisée selon vos besoins
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-black/[0.02]">
                <div className="container max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                            Tout ce dont vous avez besoin
                        </h2>
                        <p className="mt-3 text-[16px] text-black/50">
                            Des fonctionnalités exclusives pour votre
                            organisation
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {enterpriseFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl border border-black/5 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/[0.03] mb-4 group-hover:bg-black group-hover:text-white transition-all duration-200">
                                    <feature.icon
                                        className="h-6 w-6"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <h3 className="text-[17px] font-semibold text-black mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[14px] text-black/50 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-20 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                            Comparatif Enterprise vs Pro
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-black/10 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black/[0.02]">
                                    <th className="text-left py-4 px-6 text-[14px] font-medium text-black/50">
                                        Fonctionnalité
                                    </th>
                                    <th className="text-center py-4 px-6 text-[14px] font-medium text-black/50">
                                        Pro
                                    </th>
                                    <th className="text-center py-4 px-6 text-[14px] font-medium text-black bg-black/5">
                                        Enterprise
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {[
                                    ["Utilisateurs", "10", "Illimité"],
                                    ["Clients", "5 000", "Illimité"],
                                    ["Documents/mois", "500", "Illimité"],
                                    ["Stockage", "20 Go", "100 Go+"],
                                    ["Support", "Email prioritaire", "Dédié 24/7"],
                                    ["Gestionnaire de compte", "Non", "Oui"],
                                    ["SLA garanti", "Non", "99.9%"],
                                    ["Domaine personnalisé", "Non", "Oui"],
                                    ["White label", "Non", "Oui"],
                                    ["Intégrations sur mesure", "Non", "Oui"],
                                    ["Formation incluse", "Basique", "Complète"],
                                ].map(([feature, pro, enterprise], index) => (
                                    <tr key={index}>
                                        <td className="py-4 px-6 text-[14px] text-black">
                                            {feature}
                                        </td>
                                        <td className="py-4 px-6 text-center text-[14px] text-black/60">
                                            {pro}
                                        </td>
                                        <td className="py-4 px-6 text-center text-[14px] font-medium text-black bg-black/[0.02]">
                                            {enterprise === "Oui" ? (
                                                <Check className="h-5 w-5 mx-auto text-black" />
                                            ) : (
                                                enterprise
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 bg-black text-white">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-[32px] font-semibold tracking-[-0.02em]">
                            Ils nous font confiance
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6"
                            >
                                <p className="text-[16px] text-white/80 leading-relaxed mb-4">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                                <div>
                                    <p className="text-[14px] font-medium text-white">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-[13px] text-white/50">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4">
                <div className="container max-w-2xl mx-auto text-center">
                    <Building2 className="h-12 w-12 mx-auto mb-6 text-black/20" />
                    <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                        Prêt à passer à l&apos;échelle ?
                    </h2>
                    <p className="mt-3 text-[16px] text-black/50">
                        Notre équipe est là pour comprendre vos besoins et vous
                        proposer une solution adaptée.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            className="h-12 px-8 text-[15px] font-medium bg-black hover:bg-black/90 text-white rounded-lg shadow-lg"
                        >
                            <Link href="/contact?plan=enterprise">
                                Contacter notre équipe
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <p className="mt-6 text-[13px] text-black/40">
                        Réponse sous 24h · Démo personnalisée · Sans engagement
                    </p>
                </div>
            </section>
        </div>
    );
}

"use client";

import { Card } from "@/components/ui/card";
import {
    Shield,
    Lock,
    Server,
    Zap,
    Database,
    Code,
    CheckCircle2,
    Cloud,
} from "lucide-react";

interface TechFeature {
    icon: React.ElementType;
    title: string;
    description: string;
    badge?: string;
}

const techFeatures: TechFeature[] = [
    {
        icon: Shield,
        title: "Sécurité Enterprise-Grade",
        description:
            "Chiffrement AES-256, authentification JWT, OAuth2, conformité RGPD. Vos données sont protégées comme dans une banque.",
        badge: "ISO 27001",
    },
    {
        icon: Server,
        title: "Infrastructure Hautement Disponible",
        description:
            "99.9% d'uptime garanti, hébergement multi-zones, backups automatiques quotidiens, récupération en moins de 4h.",
        badge: "99.9% SLA",
    },
    {
        icon: Zap,
        title: "Performance Optimale",
        description:
            "Next.js 16 + React 19, Edge Computing, cache intelligent. Temps de réponse < 200ms en moyenne.",
        badge: "< 200ms",
    },
    {
        icon: Database,
        title: "Base de Données Fiable",
        description:
            "PostgreSQL 16 avec réplication, transactions ACID, sauvegarde continue. 40+ modèles optimisés pour la performance.",
    },
    {
        icon: Code,
        title: "Architecture Moderne",
        description:
            "TypeScript strict, clean architecture, 122 API routes, 66+ hooks custom. Code maintenable et évolutif.",
    },
    {
        icon: Lock,
        title: "Conformité & Certification",
        description:
            "RGPD compliant, export FEC, hébergement en France, audit de sécurité trimestriel. Conforme aux normes comptables françaises.",
        badge: "RGPD",
    },
    {
        icon: Cloud,
        title: "Cloud-Native & Scalable",
        description:
            "Architecture serverless, auto-scaling automatique, CDN global. De 1 à 10,000 utilisateurs sans problème.",
    },
    {
        icon: CheckCircle2,
        title: "Qualité & Fiabilité",
        description:
            "Tests automatisés, monitoring 24/7, alertes proactives, rollback instantané. Zero downtime deployment.",
    },
];

const techStack = [
    { name: "Next.js 16", category: "Framework" },
    { name: "React 19", category: "UI" },
    { name: "TypeScript 5", category: "Language" },
    { name: "PostgreSQL 16", category: "Database" },
    { name: "Prisma ORM", category: "ORM" },
    { name: "OpenAI GPT-4", category: "AI" },
    { name: "Stripe", category: "Payments" },
    { name: "Tailwind CSS", category: "Styling" },
];

export function TechnicalExcellence() {
    return (
        <section className="relative py-32 px-6 sm:px-8 bg-black text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/[0.02] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-white/[0.02] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.12]">
                        <Code className="w-4 h-4 text-white/80" strokeWidth={2} />
                        <span className="text-[13px] text-white/80 font-medium">
                            Excellence Technique
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-white leading-[1.05]">
                        Construit pour durer.
                        <br />
                        <span className="text-white/60">Codé avec passion.</span>
                    </h2>

                    <p className="text-[19px] text-white/70 max-w-[720px] mx-auto leading-[1.5]">
                        Une architecture moderne, sécurisée et performante. MyProPartner utilise les
                        dernières technologies pour vous offrir une expérience exceptionnelle.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {techFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="group relative p-6 bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                            >
                                <div className="space-y-4">
                                    {/* Icon & Badge */}
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-xl bg-white/[0.08] border border-white/[0.12] group-hover:bg-white group-hover:border-white transition-all duration-300">
                                            <Icon
                                                className="w-5 h-5 text-white/80 group-hover:text-black transition-colors duration-300"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        {feature.badge && (
                                            <span className="px-2 py-0.5 rounded-full bg-white/[0.12] text-white text-[10px] font-semibold">
                                                {feature.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-[16px] font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[13px] text-white/60 leading-[1.6]">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Tech Stack */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-[24px] font-semibold text-white mb-2">
                            Stack Technologique
                        </h3>
                        <p className="text-[14px] text-white/60">
                            Les meilleures technologies pour une plateforme moderne
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {techStack.map((tech, index) => (
                            <div
                                key={index}
                                className="group px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] hover:bg-white/[0.10] hover:border-white/[0.20] transition-all duration-300"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-semibold text-white">
                                        {tech.name}
                                    </span>
                                    <span className="text-[11px] text-white/50">
                                        {tech.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-white/[0.04] border-white/[0.08] text-center">
                        <div className="space-y-2">
                            <p className="text-[36px] font-semibold text-white tracking-[-0.02em]">
                                122
                            </p>
                            <p className="text-[12px] text-white/60 font-medium">API Routes</p>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white/[0.04] border-white/[0.08] text-center">
                        <div className="space-y-2">
                            <p className="text-[36px] font-semibold text-white tracking-[-0.02em]">
                                40+
                            </p>
                            <p className="text-[12px] text-white/60 font-medium">
                                Modèles de données
                            </p>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white/[0.04] border-white/[0.08] text-center">
                        <div className="space-y-2">
                            <p className="text-[36px] font-semibold text-white tracking-[-0.02em]">
                                99.9%
                            </p>
                            <p className="text-[12px] text-white/60 font-medium">Uptime garanti</p>
                        </div>
                    </Card>
                    <Card className="p-6 bg-white/[0.04] border-white/[0.08] text-center">
                        <div className="space-y-2">
                            <p className="text-[36px] font-semibold text-white tracking-[-0.02em]">
                                &lt;200ms
                            </p>
                            <p className="text-[12px] text-white/60 font-medium">
                                Temps de réponse
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

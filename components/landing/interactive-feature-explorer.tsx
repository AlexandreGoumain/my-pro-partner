"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Users,
    Package,
    Store,
    CreditCard,
    Gift,
    BarChart3,
    Sparkles,
    ArrowRight,
    Check,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    image?: string;
    highlight?: string;
}

interface Category {
    id: string;
    label: string;
    icon: React.ElementType;
    features: Feature[];
}

const categories: Category[] = [
    {
        id: "sales",
        label: "Ventes",
        icon: FileText,
        features: [
            {
                icon: FileText,
                title: "Devis & Factures Professionnels",
                description:
                    "Créez des devis en 2 minutes chrono. Convertissez en facture en 1 clic. Envoyez par email avec PDF automatique.",
                features: [
                    "Templates personnalisables par type d'entreprise",
                    "Conversion devis → facture instantanée",
                    "Génération PDF automatique avec logo",
                    "Envoi email avec pièce jointe",
                    "Numérotation automatique conforme",
                    "Multi-séries de numérotation",
                    "Avoirs et notes de crédit",
                ],
                highlight: "2 min pour créer un devis complet",
            },
            {
                icon: CreditCard,
                title: "Paiements Modernes",
                description:
                    "Encaissez vos clients facilement. Stripe intégré, QR codes, liens de paiement, relances automatiques.",
                features: [
                    "Paiement en ligne via Stripe",
                    "QR code sur factures (paiement mobile)",
                    "Liens de paiement personnalisés",
                    "Stripe Terminal (lecteur carte physique)",
                    "Relances automatiques des impayés",
                    "Suivi multi-méthodes (CB, Espèces, Chèque)",
                    "Rapprochement bancaire automatique",
                ],
                highlight: "Paiement reçu en 24h en moyenne",
            },
        ],
    },
    {
        id: "crm",
        label: "Clients",
        icon: Users,
        features: [
            {
                icon: Users,
                title: "CRM Intelligent",
                description:
                    "Gérez jusqu'à 5000 clients. Segmentation avancée. Historique complet. Portail client automatique.",
                features: [
                    "Fiches clients complètes avec historique",
                    "Segmentation dynamique par critères",
                    "Import/Export CSV et Excel",
                    "Portail client avec auto-inscription",
                    "Tags et catégories personnalisés",
                    "Notes et fichiers attachés",
                    "Statistiques par client (CA, fréquence)",
                ],
                highlight: "Jusqu'à 5000 clients (plan PRO)",
            },
            {
                icon: Gift,
                title: "Programme de Fidélité",
                description:
                    "Fidélisez vos clients automatiquement. Points, niveaux, récompenses. Engagement maximisé.",
                features: [
                    "Points automatiques à chaque achat (1€ = 1 point)",
                    "Niveaux personnalisés (Bronze, Argent, Or...)",
                    "Remises automatiques par niveau",
                    "Dashboard client avec progression",
                    "Expiration de points configurable",
                    "Ajustements manuels possibles",
                    "Notifications automatiques de niveau",
                ],
                highlight: "+120% clients fidèles en moyenne",
            },
        ],
    },
    {
        id: "inventory",
        label: "Stocks",
        icon: Package,
        features: [
            {
                icon: Package,
                title: "Gestion Stock Multi-Magasin",
                description:
                    "Inventaire temps réel. Alertes stocks bas. Transferts inter-magasins. Traçabilité complète.",
                features: [
                    "Stock par magasin en temps réel",
                    "Alertes automatiques stocks bas",
                    "Transferts inter-magasins validés",
                    "Historique complet des mouvements",
                    "Catégories avec champs personnalisés",
                    "Codes-barres et références",
                    "Import/Export produits Excel",
                ],
                highlight: "Zéro rupture de stock garantie",
            },
            {
                icon: Store,
                title: "Multi-Magasin & POS",
                description:
                    "Gérez plusieurs emplacements. Point de vente tactile. Sessions de caisse. Stock synchronisé.",
                features: [
                    "Création illimitée de magasins",
                    "POS tactile optimisé pour vente rapide",
                    "Sessions de caisse (ouverture/fermeture)",
                    "Stripe Terminal intégré",
                    "Stock synchronisé automatiquement",
                    "Rapports par magasin",
                    "Tickets de caisse PDF",
                ],
                highlight: "Gérez jusqu'à 10 magasins",
            },
        ],
    },
    {
        id: "ai",
        label: "IA & Analytics",
        icon: Sparkles,
        features: [
            {
                icon: Sparkles,
                title: "Assistant IA GPT-4",
                description:
                    "Posez vos questions en français. Obtenez des réponses instantanées avec vos vraies données.",
                features: [
                    "Chat en langage naturel (français)",
                    "Accès à toutes vos données en temps réel",
                    "Réponses en 2-3 secondes",
                    "Historique de conversations",
                    "Questions suggérées intelligentes",
                    "Génération de rapports automatique",
                    "Prédictions et recommandations",
                ],
                highlight: "10x plus rapide qu'une recherche manuelle",
            },
            {
                icon: BarChart3,
                title: "Analytics & Rapports",
                description:
                    "Tableaux de bord temps réel. KPIs métier. Export FEC. Prédictions fiables.",
                features: [
                    "Dashboard temps réel personnalisable",
                    "Analyse de rentabilité par produit/client",
                    "Suivi des impayés avec alertes",
                    "Top débiteurs automatique",
                    "Prédictions de CA par l'IA",
                    "Export FEC (conformité comptable FR)",
                    "Rapports PDF et Excel",
                ],
                highlight: "95% de temps gagné sur l'analyse",
            },
        ],
    },
];

export function InteractiveFeatureExplorer() {
    const [activeCategory, setActiveCategory] = useState(categories[0].id);
    const [activeFeature, setActiveFeature] = useState(0);

    const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];
    const currentFeature = currentCategory.features[activeFeature];
    const Icon = currentFeature.icon;

    return (
        <section className="relative py-32 px-6 sm:px-8 bg-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1400px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Sparkles className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Explorez toutes les fonctionnalités
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Découvrez MyProPartner
                        <br />
                        <span className="text-black/60">en détail.</span>
                    </h2>

                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Explorez chaque fonctionnalité de manière interactive. Cliquez sur les catégories pour découvrir ce que MyProPartner peut faire pour vous.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {categories.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveCategory(category.id);
                                    setActiveFeature(0);
                                }}
                                className={`group px-6 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-300 ${
                                    activeCategory === category.id
                                        ? "bg-black text-white shadow-lg scale-105"
                                        : "bg-black/[0.04] text-black/70 hover:bg-black/[0.08] border border-black/[0.08] hover:scale-102"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CategoryIcon
                                        className={`w-5 h-5 transition-colors ${
                                            activeCategory === category.id ? "text-white" : "text-black/60 group-hover:text-black"
                                        }`}
                                        strokeWidth={2}
                                    />
                                    <span>{category.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Feature Explorer */}
                <div className="grid lg:grid-cols-[300px,1fr] gap-8">
                    {/* Feature List Sidebar */}
                    <div className="space-y-2">
                        {currentCategory.features.map((feature, index) => {
                            const FeatureIcon = feature.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveFeature(index)}
                                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                                        activeFeature === index
                                            ? "bg-black text-white shadow-md"
                                            : "bg-black/[0.02] hover:bg-black/[0.05] border border-black/[0.06]"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            activeFeature === index ? "bg-white/[0.15]" : "bg-black/[0.05]"
                                        }`}>
                                            <FeatureIcon
                                                className={`w-5 h-5 ${
                                                    activeFeature === index ? "text-white" : "text-black/60"
                                                }`}
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-[15px] font-semibold mb-1 ${
                                                activeFeature === index ? "text-white" : "text-black"
                                            }`}>
                                                {feature.title}
                                            </h3>
                                            <p className={`text-[12px] line-clamp-2 ${
                                                activeFeature === index ? "text-white/70" : "text-black/60"
                                            }`}>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feature Details */}
                    <Card className="p-8 lg:p-10 bg-gradient-to-br from-white to-neutral-50/50 border-black/[0.08] shadow-lg">
                        <div className="space-y-8">
                            {/* Feature Header */}
                            <div className="space-y-4">
                                <div className="inline-flex p-4 rounded-2xl bg-black/[0.03] border border-black/[0.08]">
                                    <Icon className="w-8 h-8 text-black" strokeWidth={2} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                        {currentFeature.title}
                                    </h3>
                                    <p className="text-[17px] text-black/70 leading-[1.6]">
                                        {currentFeature.description}
                                    </p>
                                    {currentFeature.highlight && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white">
                                            <Sparkles className="w-4 h-4" strokeWidth={2} />
                                            <span className="text-[13px] font-semibold">
                                                {currentFeature.highlight}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Feature List */}
                            <div className="space-y-3 pt-6 border-t border-black/[0.08]">
                                <p className="text-[13px] font-semibold text-black/60 uppercase tracking-wider mb-4">
                                    Fonctionnalités incluses
                                </p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {currentFeature.features.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-white border border-black/[0.06]"
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                </div>
                                            </div>
                                            <span className="text-[14px] text-black/80 leading-[1.5]">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="pt-6 border-t border-black/[0.08]">
                                <Link href="/auth/register">
                                    <Button className="bg-black hover:bg-black/90 text-white h-12 px-8 text-[15px] font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 group">
                                        Essayer gratuitement
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </Link>
                                <p className="text-[13px] text-black/50 mt-3">
                                    14 jours gratuits • Sans carte bancaire
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}

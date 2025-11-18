"use client";

import { Wrench, Coffee, ShoppingBag, Briefcase, Check, Building2, Truck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Templates() {
    const templates = [
        {
            id: "artisans",
            icon: Wrench,
            title: "Artisans",
            description: "Plombiers, électriciens, menuisiers, peintres",
            tagline: "De l'intervention à la facturation en un clic",
            features: [
                "Devis de chantier pré-remplis avec catalogue matériaux",
                "Planning des interventions géolocalisées",
                "Photos avant/après directement dans le dossier client",
                "Factures générées automatiquement après intervention",
                "Gestion des garanties et SAV",
            ],
            benefits: "Gagnez 10h/semaine sur la paperasse administrative",
        },
        {
            id: "restauration",
            icon: Coffee,
            title: "Restauration",
            description: "Restaurants, cafés, boulangeries, traiteurs",
            tagline: "Gérez vos stocks et marges en temps réel",
            features: [
                "Cartes et menus digitaux avec photos",
                "Gestion des stocks alimentaires avec alertes péremption",
                "Fiches techniques recettes avec calcul des coûts",
                "Inventaire rapide avec scan de codes-barres",
                "Analyse des marges par plat",
            ],
            benefits: "Réduisez le gaspillage de 30% et optimisez vos marges",
        },
        {
            id: "commerce",
            icon: ShoppingBag,
            title: "Commerce",
            description: "Boutiques, retail, e-commerce",
            tagline: "Un seul outil pour vos ventes en magasin et online",
            features: [
                "Catalogue produits synchronisé multi-canal",
                "Gestion multi-magasin avec transferts de stock",
                "Programme de fidélité client intégré",
                "Statistiques de vente par produit/catégorie",
                "Réassort automatique selon les ventes",
            ],
            benefits: "Synchronisez tous vos canaux de vente en temps réel",
        },
        {
            id: "services",
            icon: Briefcase,
            title: "Services",
            description: "Consulting, agences, freelances, formation",
            tagline: "Facturez au temps passé sans effort",
            features: [
                "Suivi du temps par projet et client",
                "Propositions commerciales avec signature électronique",
                "Facturation récurrente pour abonnements",
                "Tableau de bord de rentabilité par projet",
                "Gestion des jalons et acomptes",
            ],
            benefits: "Facturez 100% de votre temps réellement travaillé",
        },
        {
            id: "batiment",
            icon: Building2,
            title: "Bâtiment",
            description: "Maçonnerie, charpente, couverture, gros œuvre",
            tagline: "Gérez vos chantiers de A à Z",
            features: [
                "Devis détaillés multi-lots avec quantitatifs",
                "Suivi de chantier avec photos géolocalisées",
                "Gestion des sous-traitants et fournisseurs",
                "Planning multi-chantiers",
                "Situations de travaux et appels de fonds",
            ],
            benefits: "Pilotez tous vos chantiers depuis une seule interface",
        },
        {
            id: "transport",
            icon: Truck,
            title: "Transport",
            description: "Livraison, déménagement, transport de marchandises",
            tagline: "Optimisez vos tournées et livraisons",
            features: [
                "Planning des tournées optimisé",
                "Suivi GPS en temps réel",
                "Proof of delivery avec signature tablette",
                "Gestion du parc véhicule et maintenance",
                "Facturation au kilomètre ou forfait",
            ],
            benefits: "Réduisez vos coûts de transport de 20%",
        },
    ];

    return (
        <section
            id="use-cases"
            className="px-6 bg-white scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top-large)',
                paddingBottom: 'var(--section-padding-bottom-large)'
            }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 className="text-[48px] font-semibold tracking-tight-premium text-black mb-4">
                        Adapté à votre métier
                    </h2>
                    <p className="text-[18px] text-black/50 max-w-[600px] mx-auto tracking-wide-premium">
                        MyProPartner comprend les spécificités de votre secteur.
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="artisans" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-2 bg-transparent p-0 mb-12">
                        {templates.map((template) => {
                            const Icon = template.icon;
                            return (
                                <TabsTrigger
                                    key={template.id}
                                    value={template.id}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-black/[0.08] bg-white data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black transition-all ease-premium shadow-sm hover:shadow-md data-[state=active]:shadow-stripe"
                                    style={{ transitionDuration: '0.3s' }}
                                >
                                    <Icon className="w-5 h-5" strokeWidth={2} />
                                    <span className="text-[13px] font-medium tracking-wide-premium">
                                        {template.title}
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {templates.map((template) => {
                        const Icon = template.icon;
                        return (
                            <TabsContent key={template.id} value={template.id} className="mt-0">
                                <div className="p-8 lg:p-12 rounded-2xl border border-black/[0.08] bg-gradient-to-b from-white to-black/[0.01] card-shadow">
                                    {/* Header du métier */}
                                    <div className="flex items-start gap-6 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-black/[0.04] flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-8 h-8 text-black/60" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[32px] font-semibold text-black mb-2 tracking-tight-premium">
                                                {template.title}
                                            </h3>
                                            <p className="text-[16px] text-black/50 mb-3 tracking-wide-premium">
                                                {template.description}
                                            </p>
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.04] border border-black/[0.06]">
                                                <span className="text-[14px] text-black/70 font-medium tracking-wide-premium">
                                                    {template.tagline}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fonctionnalités */}
                                    <div className="mb-8">
                                        <h4 className="text-[18px] font-semibold text-black mb-4 tracking-wide-premium">
                                            Fonctionnalités adaptées :
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {template.features.map((feature, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-3 p-4 rounded-lg bg-white border border-black/[0.06] transition-all ease-premium hover:border-black/[0.12]"
                                                    style={{ transitionDuration: '0.2s' }}
                                                >
                                                    <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                                                    <span className="text-[14px] text-black/70 tracking-wide-premium">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bénéfice */}
                                    <div className="p-6 rounded-xl bg-black text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                                            </div>
                                            <p className="text-[16px] font-medium tracking-wide-premium">
                                                {template.benefits}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>

                {/* Bottom note */}
                <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
                    <p className="text-[13px] text-black/40 tracking-wide-premium">
                        + 15 autres secteurs d'activité disponibles • Templates 100% personnalisables
                    </p>
                </div>
            </div>
        </section>
    );
}

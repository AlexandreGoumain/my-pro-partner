"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Package, Users, BarChart3 } from "lucide-react";

const demoTabs = [
    {
        value: "documents",
        label: "Devis & Factures",
        icon: FileText,
        title: "Créez des documents professionnels en quelques clics",
        description: "Interface intuitive pour générer vos devis et factures. Conversion automatique, calculs instantanés, personnalisation complète.",
        emoji: "📄",
    },
    {
        value: "articles",
        label: "Catalogue",
        icon: Package,
        title: "Gérez votre catalogue et vos stocks",
        description: "Vue complète de vos produits et services. Catégorisation, suivi des stocks en temps réel, alertes automatiques.",
        emoji: "📦",
    },
    {
        value: "clients",
        label: "Clients",
        icon: Users,
        title: "Centralisez vos données clients",
        description: "Accédez rapidement à toutes les informations de vos clients. Historique complet, recherche avancée, segmentation.",
        emoji: "👥",
    },
    {
        value: "analytics",
        label: "Statistiques",
        icon: BarChart3,
        title: "Pilotez votre activité avec des données précises",
        description: "Tableaux de bord en temps réel. Suivez vos performances, identifiez les tendances, prenez les bonnes décisions.",
        emoji: "📊",
    },
];

export function ProductDemo() {
    return (
        <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Une interface pensée pour vous
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Découvrez comment MyProPartner simplifie la gestion de votre entreprise
                    </p>
                </div>

                {/* Demo tabs */}
                <Tabs defaultValue="documents" className="space-y-8">
                    <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 lg:grid-cols-4 h-auto">
                        {demoTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="flex flex-col gap-2 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-100 data-[state=active]:to-purple-100 dark:data-[state=active]:from-blue-950 dark:data-[state=active]:to-purple-950"
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs sm:text-sm">{tab.label}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {demoTabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value} className="space-y-8">
                            <div className="text-center space-y-4 max-w-3xl mx-auto">
                                <h3 className="text-2xl sm:text-3xl font-bold">{tab.title}</h3>
                                <p className="text-lg text-muted-foreground">{tab.description}</p>
                            </div>

                            {/* Demo screenshot placeholder */}
                            <div className="relative max-w-5xl mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl" />
                                <div className="relative rounded-2xl border border-border bg-card p-4 shadow-2xl">
                                    <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="text-6xl">{tab.emoji}</div>
                                            <p className="text-muted-foreground">
                                                Capture d&apos;écran de {tab.label.toLowerCase()} à venir
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}

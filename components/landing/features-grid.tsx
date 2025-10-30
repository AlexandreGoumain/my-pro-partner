"use client";

import {
    Users,
    Package,
    FileText,
    TrendingUp,
    Shield,
    Zap,
    BarChart3,
    Clock,
    DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
    {
        icon: Users,
        title: "Gestion Clients",
        description: "Centralisez toutes les informations de vos clients. Recherche avancée, historique complet.",
        badge: null,
    },
    {
        icon: Package,
        title: "Catalogue & Stocks",
        description: "Gérez vos produits et services. Suivi des stocks en temps réel avec alertes automatiques.",
        badge: "Populaire",
    },
    {
        icon: FileText,
        title: "Devis & Factures",
        description: "Créez des devis et factures professionnels en quelques clics. Conversion automatique.",
        badge: null,
    },
    {
        icon: BarChart3,
        title: "Tableaux de bord",
        description: "Visualisez vos performances en temps réel. KPIs, statistiques, et rapports détaillés.",
        badge: null,
    },
    {
        icon: Clock,
        title: "Gain de temps",
        description: "Automatisez les tâches répétitives. Plus de temps pour votre cœur de métier.",
        badge: null,
    },
    {
        icon: DollarSign,
        title: "Suivi des paiements",
        description: "Suivez vos encaissements et relancez automatiquement les impayés.",
        badge: "Bientôt",
    },
    {
        icon: TrendingUp,
        title: "Évolutif",
        description: "Une solution qui grandit avec votre entreprise. De l'artisan solo à la PME.",
        badge: null,
    },
    {
        icon: Shield,
        title: "Sécurisé",
        description: "Vos données sont protégées. Hébergement sécurisé et sauvegardes automatiques.",
        badge: null,
    },
    {
        icon: Zap,
        title: "Ultra-rapide",
        description: "Interface moderne et réactive. Fini les logiciels lents et obsolètes.",
        badge: null,
    },
];

export function FeaturesGrid() {
    return (
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Une suite complète d&apos;outils pour gérer votre activité au quotidien
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        {feature.badge && (
                                            <Badge variant={feature.badge === "Bientôt" ? "secondary" : "default"}>
                                                {feature.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>

                                {/* Hover effect gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
import { Activity, AlertTriangle, Package, TrendingUp } from "lucide-react";

export interface StockStatsProps {
    totalArticles: number;
    articlesEnRupture: number;
    articlesEnAlerte: number;
    mouvementsRecents: number;
}

export function StockStats({
    totalArticles,
    articlesEnRupture,
    articlesEnAlerte,
    mouvementsRecents,
}: StockStatsProps) {
    const stats: StatConfig[] = [
        {
            id: "total",
            icon: Package,
            label: "Total articles",
            value: totalArticles,
            description: "Articles avec gestion de stock",
        },
        {
            id: "rupture",
            icon: AlertTriangle,
            label: "En rupture",
            value: articlesEnRupture,
            description: "Articles à réapprovisionner",
        },
        {
            id: "alerte",
            icon: TrendingUp,
            label: "En alerte",
            value: articlesEnAlerte,
            description: "Stock sous le seuil minimum",
        },
        {
            id: "mouvements",
            icon: Activity,
            label: "Mouvements",
            value: mouvementsRecents,
            description: "Mouvements enregistrés",
        },
    ];

    return <StatisticsGrid stats={stats} columns={{ md: 2, lg: 4 }} gap={4} />;
}

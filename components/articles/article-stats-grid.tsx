import { ArticleStatsCard } from "./article-stats-card";
import {
    ShoppingBag,
    Package,
    Briefcase,
    TrendingUp,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleStatsData {
    total: number;
    produits: number;
    services: number;
    actifs: number;
    stockFaible: number;
}

export interface ArticleStatsGridProps {
    stats: ArticleStatsData;
    typeFilter: "TOUS" | "PRODUIT" | "SERVICE";
    onTypeFilterToggle: (type: "TOUS" | "PRODUIT" | "SERVICE") => void;
    className?: string;
}

export function ArticleStatsGrid({
    stats,
    typeFilter,
    onTypeFilterToggle,
    className,
}: ArticleStatsGridProps) {
    return (
        <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-5", className)}>
            <ArticleStatsCard
                label="Total"
                value={stats.total}
                icon={ShoppingBag}
                isActive={typeFilter === "TOUS"}
                onClick={() => onTypeFilterToggle("TOUS")}
            />

            <ArticleStatsCard
                label="Produits"
                value={stats.produits}
                icon={Package}
                iconClassName="h-4 w-4 text-blue-600"
                percentage={stats.total > 0 ? (stats.produits / stats.total) * 100 : 0}
                badge={{
                    variant: "outline",
                    className: "bg-blue-100 text-blue-700 border-blue-300",
                }}
                isActive={typeFilter === "PRODUIT"}
                onClick={() => onTypeFilterToggle("PRODUIT")}
                activeClassName="border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                hoverClassName="hover:border-blue-500"
            />

            <ArticleStatsCard
                label="Services"
                value={stats.services}
                icon={Briefcase}
                iconClassName="h-4 w-4 text-purple-600"
                percentage={stats.total > 0 ? (stats.services / stats.total) * 100 : 0}
                badge={{
                    variant: "outline",
                    className: "bg-purple-100 text-purple-700 border-purple-300",
                }}
                isActive={typeFilter === "SERVICE"}
                onClick={() => onTypeFilterToggle("SERVICE")}
                activeClassName="border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20"
                hoverClassName="hover:border-purple-500"
            />

            <ArticleStatsCard
                label="Actifs"
                value={stats.actifs}
                icon={TrendingUp}
                iconClassName="h-4 w-4 text-green-600"
                percentage={stats.total > 0 ? (stats.actifs / stats.total) * 100 : 0}
                badge={{
                    variant: "outline",
                    className: "bg-green-100 text-green-700 border-green-300",
                }}
            />

            <ArticleStatsCard
                label="Stock faible"
                value={stats.stockFaible}
                icon={AlertCircle}
                iconClassName="h-4 w-4 text-amber-600"
                badge={
                    stats.stockFaible > 0
                        ? {
                              label: "Alerte",
                              variant: "outline",
                              className:
                                  "bg-amber-100 text-amber-700 border-amber-300",
                          }
                        : undefined
                }
            />
        </div>
    );
}

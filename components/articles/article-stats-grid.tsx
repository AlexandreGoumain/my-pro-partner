import { ArticleStatsCard } from "./article-stats-card";
import {
  ShoppingBag,
  Package,
  Briefcase,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ArticleTypeFilter } from "@/lib/types/article";

export interface ArticleStatsData {
  total: number;
  produits: number;
  services: number;
  actifs: number;
  stockFaible: number;
}

export interface ArticleStatsGridProps {
  stats: ArticleStatsData;
  typeFilter: ArticleTypeFilter;
  onTypeFilterToggle: (type: ArticleTypeFilter) => void;
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
        isClickable={true}
      />

      <ArticleStatsCard
        label="Produits"
        value={stats.produits}
        icon={Package}
        iconClassName="h-4 w-4 text-black/60"
        percentage={stats.total > 0 ? (stats.produits / stats.total) * 100 : 0}
        badge={{
          variant: "outline",
          className: "bg-black/5 text-black/70 border-black/10",
        }}
        isActive={typeFilter === "PRODUIT"}
        onClick={() => onTypeFilterToggle("PRODUIT")}
        isClickable={true}
        activeClassName="border-black/20 bg-black/5 ring-2 ring-black/10"
        hoverClassName="hover:border-black/20"
      />

      <ArticleStatsCard
        label="Services"
        value={stats.services}
        icon={Briefcase}
        iconClassName="h-4 w-4 text-black/60"
        percentage={stats.total > 0 ? (stats.services / stats.total) * 100 : 0}
        badge={{
          variant: "outline",
          className: "bg-black/5 text-black/70 border-black/10",
        }}
        isActive={typeFilter === "SERVICE"}
        isClickable={true}
        onClick={() => onTypeFilterToggle("SERVICE")}
        activeClassName="border-black/20 bg-black/5 ring-2 ring-black/10"
        hoverClassName="hover:border-black/20"
      />

      <ArticleStatsCard
        label="Actifs"
        value={stats.actifs}
        icon={TrendingUp}
        iconClassName="h-4 w-4 text-black/60"
        percentage={stats.total > 0 ? (stats.actifs / stats.total) * 100 : 0}
        badge={{
          variant: "outline",
          className: "bg-black/5 text-black/70 border-black/10",
        }}
      />

      <ArticleStatsCard
        label="Stock faible"
        value={stats.stockFaible}
        icon={AlertCircle}
        iconClassName="h-4 w-4 text-black/60"
        badge={
          stats.stockFaible > 0
            ? {
                label: "Alerte",
                variant: "outline",
                className: "bg-black/5 text-black/70 border-black/10",
              }
            : undefined
        }
      />
    </div>
  );
}

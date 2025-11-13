import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    ShoppingCart,
    DollarSign,
    Package,
    BarChart3,
    TrendingUp,
} from "lucide-react";
import { ArticleStats } from "@/lib/types/article-detail";

export interface ArticleDetailKPIsProps {
    stats: ArticleStats;
    stock?: number;
    seuilAlerte?: number;
    isService: boolean;
}

export function ArticleDetailKPIs({
    stats,
    stock,
    seuilAlerte,
    isService,
}: ArticleDetailKPIsProps) {
    const stockPercentage =
        seuilAlerte && seuilAlerte > 0
            ? Math.min(((stock || 0) / (seuilAlerte * 3)) * 100, 100)
            : 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-black/8 shadow-sm">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2 text-[14px] text-black/60">
                        <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                        {isService ? "Prestations (mois)" : "Ventes (mois)"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline justify-between">
                        <div className="text-[28px] font-bold tracking-[-0.02em] text-black">
                            {stats.ventesMois}
                        </div>
                        <div className="flex items-center gap-1 text-[13px]">
                            <TrendingUp className="h-3 w-3 text-green-600" strokeWidth={2} />
                            <span className="text-green-600 font-medium">
                                +{stats.ventesEvolution}%
                            </span>
                        </div>
                    </div>
                    <p className="text-[13px] text-black/60 mt-1">
                        {stats.ventesTotal} total
                    </p>
                </CardContent>
            </Card>

            <Card className="border-black/8 shadow-sm">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2 text-[14px] text-black/60">
                        <DollarSign className="h-4 w-4" strokeWidth={2} />
                        CA (mois)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline justify-between">
                        <div className="text-[28px] font-bold tracking-[-0.02em] text-black">
                            {stats.ca_mois.toLocaleString()}€
                        </div>
                        <div className="flex items-center gap-1 text-[13px]">
                            <TrendingUp className="h-3 w-3 text-green-600" strokeWidth={2} />
                            <span className="text-green-600 font-medium">
                                +{stats.ca_evolution}%
                            </span>
                        </div>
                    </div>
                    <p className="text-[13px] text-black/60 mt-1">
                        {stats.ca_total.toLocaleString()}€ total
                    </p>
                </CardContent>
            </Card>

            {!isService && stock !== undefined && seuilAlerte !== undefined && (
                <Card className="border-black/8 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-[14px] text-black/60">
                            <Package className="h-4 w-4" strokeWidth={2} />
                            Stock actuel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline justify-between">
                            <div className="text-[28px] font-bold tracking-[-0.02em] text-black">
                                {stock}
                            </div>
                            <div className="text-[13px] text-black/60">
                                /{seuilAlerte} min
                            </div>
                        </div>
                        <Progress value={stockPercentage} className="mt-2 h-1.5" />
                    </CardContent>
                </Card>
            )}

            <Card className="border-black/8 shadow-sm">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2 text-[14px] text-black/60">
                        <BarChart3 className="h-4 w-4" strokeWidth={2} />
                        Marge moyenne
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline justify-between">
                        <div className="text-[28px] font-bold tracking-[-0.02em] text-black">
                            {stats.marge_moyenne}%
                        </div>
                        <div className="text-[13px] text-black/60">
                            {!isService && `Rotation: ${stats.rotationStock}x`}
                        </div>
                    </div>
                    <p className="text-[13px] text-black/60 mt-1">
                        Très bonne rentabilité
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

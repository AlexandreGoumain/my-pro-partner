import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-black/8 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[14px] font-medium text-black/60">
                        Total articles
                    </CardTitle>
                    <Package
                        className="h-4 w-4 text-black/40"
                        strokeWidth={2}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {totalArticles}
                    </div>
                    <p className="text-[13px] text-black/40 mt-1">
                        Articles avec gestion de stock
                    </p>
                </CardContent>
            </Card>

            <Card className="border-black/8 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[14px] font-medium text-black/60">
                        En rupture
                    </CardTitle>
                    <AlertTriangle
                        className="h-4 w-4 text-black/40"
                        strokeWidth={2}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {articlesEnRupture}
                    </div>
                    <p className="text-[13px] text-black/40 mt-1">
                        Articles à réapprovisionner
                    </p>
                </CardContent>
            </Card>

            <Card className="border-black/8 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[14px] font-medium text-black/60">
                        En alerte
                    </CardTitle>
                    <TrendingUp
                        className="h-4 w-4 text-black/40"
                        strokeWidth={2}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {articlesEnAlerte}
                    </div>
                    <p className="text-[13px] text-black/40 mt-1">
                        Stock sous le seuil minimum
                    </p>
                </CardContent>
            </Card>

            <Card className="border-black/8 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[14px] font-medium text-black/60">
                        Mouvements
                    </CardTitle>
                    <Activity
                        className="h-4 w-4 text-black/40"
                        strokeWidth={2}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {mouvementsRecents}
                    </div>
                    <p className="text-[13px] text-black/40 mt-1">
                        Mouvements enregistrés
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

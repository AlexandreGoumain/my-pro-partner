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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total articles
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalArticles}</div>
                    <p className="text-xs text-muted-foreground">
                        Articles avec gestion de stock
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        En rupture
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                        {articlesEnRupture}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Articles à réapprovisionner
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        En alerte
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                        {articlesEnAlerte}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Stock sous le seuil minimum
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Mouvements
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mouvementsRecents}</div>
                    <p className="text-xs text-muted-foreground">
                        Mouvements enregistrés
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

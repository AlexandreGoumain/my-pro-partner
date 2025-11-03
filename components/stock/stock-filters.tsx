import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { StockFilters } from "@/hooks/use-stock";
import { STOCK_MOVEMENT_TYPES } from "@/lib/constants/stock-movements";

export interface StockFiltersProps {
    filters: StockFilters;
    articlesWithStock: unknown[];
    loadingArticles: boolean;
    onFilterChange: (key: keyof StockFilters, value: string) => void;
    onResetFilters: () => void;
}

export function StockFiltersCard({
    filters,
    articlesWithStock,
    loadingArticles,
    onFilterChange,
    onResetFilters,
}: StockFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Article</label>
                        <Select
                            value={filters.articleId || "all"}
                            onValueChange={(value) =>
                                onFilterChange("articleId", value)
                            }
                            disabled={loadingArticles}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les articles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tous les articles
                                </SelectItem>
                                {articlesWithStock.map((article) => (
                                    <SelectItem
                                        key={article.id}
                                        value={article.id}
                                    >
                                        {article.reference} - {article.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Type de mouvement
                        </label>
                        <Select
                            value={filters.type || "all"}
                            onValueChange={(value) => onFilterChange("type", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tous les types
                                </SelectItem>
                                {STOCK_MOVEMENT_TYPES.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {(filters.articleId || filters.type) && (
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={onResetFilters}
                                className="w-full"
                            >
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

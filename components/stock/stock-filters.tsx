import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import type { StockFilters } from "@/hooks/use-stock";
import { STOCK_MOVEMENT_TYPES } from "@/lib/constants/stock-movements";

export interface StockFiltersProps {
    filters: StockFilters;
    articlesWithStock: Article[];
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
        <Card className="border-black/8 shadow-sm">
            <CardHeader>
                <CardTitle className="text-[15px] font-medium text-black">
                    Filtres
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-[14px] font-medium text-black/60">
                            Article
                        </label>
                        <Select
                            value={filters.articleId || "all"}
                            onValueChange={(value) =>
                                onFilterChange("articleId", value)
                            }
                            disabled={loadingArticles}
                        >
                            <SelectTrigger className="h-11 border-black/10 text-[14px] focus:ring-black/20">
                                <SelectValue placeholder="Tous les articles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-[14px]">
                                    Tous les articles
                                </SelectItem>
                                {articlesWithStock.map((article) => (
                                    <SelectItem
                                        key={article.id}
                                        value={article.id}
                                        className="text-[14px]"
                                    >
                                        {article.reference} - {article.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[14px] font-medium text-black/60">
                            Type de mouvement
                        </label>
                        <Select
                            value={filters.type || "all"}
                            onValueChange={(value) =>
                                onFilterChange("type", value)
                            }
                        >
                            <SelectTrigger className="h-11 border-black/10 text-[14px] focus:ring-black/20">
                                <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-[14px]">
                                    Tous les types
                                </SelectItem>
                                {STOCK_MOVEMENT_TYPES.map((type) => (
                                    <SelectItem
                                        key={type.value}
                                        value={type.value}
                                        className="text-[14px]"
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
                                className="w-full h-11 border-black/10 hover:bg-black/5 text-[14px] font-medium"
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

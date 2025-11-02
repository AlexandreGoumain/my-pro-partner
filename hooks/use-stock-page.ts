import { useState, useMemo } from "react";
import { useArticles } from "@/hooks/use-articles";
import {
    useStockAlerts,
    useStockMouvements,
    type StockFilters,
} from "@/hooks/use-stock";

export interface StockPageHandlers {
    mouvements: any[];
    loadingMouvements: boolean;
    alerts: any[];
    loadingAlerts: boolean;
    articles: any[];
    loadingArticles: boolean;

    movementDialogOpen: boolean;
    setMovementDialogOpen: (open: boolean) => void;
    filters: StockFilters;
    setFilters: (filters: StockFilters) => void;

    articlesWithStock: any[];
    stats: {
        totalArticles: number;
        articlesEnRupture: number;
        articlesEnAlerte: number;
        mouvementsRecents: number;
    };

    handleFilterChange: (key: keyof StockFilters, value: string) => void;
}

export function useStockPage(): StockPageHandlers {
    const [movementDialogOpen, setMovementDialogOpen] = useState(false);
    const [filters, setFilters] = useState<StockFilters>({});

    const { data: mouvements = [], isLoading: loadingMouvements } =
        useStockMouvements(filters);
    const { data: alerts = [], isLoading: loadingAlerts } = useStockAlerts();
    const { data: articles = [], isLoading: loadingArticles } = useArticles();

    const articlesWithStock = useMemo(
        () => articles.filter((a) => a.gestionStock),
        [articles]
    );

    const stats = useMemo(
        () => ({
            totalArticles: articlesWithStock.length,
            articlesEnRupture: articlesWithStock.filter((a) => a.stock === 0)
                .length,
            articlesEnAlerte: articlesWithStock.filter(
                (a) => a.stock > 0 && a.stock <= a.seuilAlerte
            ).length,
            mouvementsRecents: mouvements.length,
        }),
        [articlesWithStock, mouvements]
    );

    const handleFilterChange = (key: keyof StockFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
        }));
    };

    return {
        mouvements,
        loadingMouvements,
        alerts,
        loadingAlerts,
        articles,
        loadingArticles,
        movementDialogOpen,
        setMovementDialogOpen,
        filters,
        setFilters,
        articlesWithStock,
        stats,
        handleFilterChange,
    };
}

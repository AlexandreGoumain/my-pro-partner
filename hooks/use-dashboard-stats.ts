import { useMemo } from "react";
import { differenceInDays } from "date-fns";

// Constants
const DAYS_IN_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS = 30;
const SIXTY_DAYS = 60;
const NINETY_DAYS = 90;
const LOW_STOCK_THRESHOLD = 10;

// Helper functions
const getDateDaysAgo = (days: number) => new Date(Date.now() - days * DAYS_IN_MS);

const calculateTrend = (current: number, previous: number): number => {
    if (previous > 0) return ((current - previous) / previous) * 100;
    return current > 0 ? 100 : 0;
};

export interface DashboardStatsData {
    clients: {
        total: number;
        new: number;
        trend: number;
        inactive: number;
    };
    articles: {
        total: number;
        new: number;
        trend: number;
        stockFaible: number;
        rupture: number;
    };
}

interface Client {
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface Article {
    createdAt?: Date | string;
    stock: number;
}

export function useDashboardStats(
    clients: Client[],
    articles: Article[]
): DashboardStatsData {
    return useMemo(() => {
        const now = new Date();
        const thirtyDaysAgo = getDateDaysAgo(THIRTY_DAYS);
        const sixtyDaysAgo = getDateDaysAgo(SIXTY_DAYS);

        // Clients
        const currentMonthClients = clients.filter(
            (c) => new Date(c.createdAt) >= thirtyDaysAgo
        ).length;
        const lastMonthClients = clients.filter((c) => {
            const date = new Date(c.createdAt);
            return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        }).length;
        const clientTrend = calculateTrend(currentMonthClients, lastMonthClients);

        // Articles
        const currentMonthArticles = articles.filter(
            (a) => a.createdAt && new Date(a.createdAt) >= thirtyDaysAgo
        ).length;
        const lastMonthArticles = articles.filter((a) => {
            if (!a.createdAt) return false;
            const date = new Date(a.createdAt);
            return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        }).length;
        const articleTrend = calculateTrend(currentMonthArticles, lastMonthArticles);

        // Clients inactifs
        const inactive = clients.filter(
            (c) => differenceInDays(now, new Date(c.updatedAt)) > NINETY_DAYS
        ).length;

        // Stock
        const stockFaible = articles.filter(
            (a) => a.stock > 0 && a.stock <= LOW_STOCK_THRESHOLD
        ).length;
        const rupture = articles.filter((a) => a.stock === 0).length;

        return {
            clients: {
                total: clients.length,
                new: currentMonthClients,
                trend: clientTrend,
                inactive,
            },
            articles: {
                total: articles.length,
                new: currentMonthArticles,
                trend: articleTrend,
                stockFaible,
                rupture,
            },
        };
    }, [clients, articles]);
}

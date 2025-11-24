"use client";

import { useState, useEffect } from "react";
import type { DashboardOverview } from "@/lib/types/dashboard";

export interface UseDashboardOverviewOptions {
    period?: number; // Days to look back
    refreshInterval?: number; // Auto-refresh interval in ms
}

export interface UseDashboardOverviewReturn {
    data: DashboardOverview | null;
    isLoading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}

export function useDashboardOverview(
    options: UseDashboardOverviewOptions = {}
): UseDashboardOverviewReturn {
    const { period = 30, refreshInterval } = options;

    const [data, setData] = useState<DashboardOverview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const url = new URL("/api/dashboard/overview", window.location.origin);
            url.searchParams.set("period", period.toString());

            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to load dashboard data");
            }

            // Convert date strings back to Date objects
            const processedData: DashboardOverview = {
                ...result.data,
                lastUpdated: new Date(result.data.lastUpdated),
                period: {
                    start: new Date(result.data.period.start),
                    end: new Date(result.data.period.end),
                },
                activities: result.data.activities.map((activity: any) => ({
                    ...activity,
                    timestamp: new Date(activity.timestamp),
                })),
                topPerformers: {
                    ...result.data.topPerformers,
                    clients: result.data.topPerformers.clients.map((client: any) => ({
                        ...client,
                        lastPurchase: new Date(client.lastPurchase),
                    })),
                },
            };

            setData(processedData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
            console.error("Dashboard overview fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [period]);

    // Auto-refresh
    useEffect(() => {
        if (!refreshInterval) return;

        const interval = setInterval(() => {
            fetchData();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval, period]);

    return {
        data,
        isLoading,
        error,
        refresh: fetchData,
    };
}

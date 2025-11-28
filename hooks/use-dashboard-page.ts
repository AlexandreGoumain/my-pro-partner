import { useCapabilities } from "@/hooks/use-capabilities";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useDashboardOverview } from "@/hooks/use-dashboard-overview";
import { useCallback, useState } from "react";

export interface UseDashboardPageReturn {
    // Period
    selectedPeriod: number;
    handlePeriodChange: (period: number) => void;

    // Business type
    isServiceIntellectuel: boolean;

    // Dashboard data
    greeting: ReturnType<typeof useDashboardData>["greeting"];
    userName: ReturnType<typeof useDashboardData>["userName"];
    dateLabel: ReturnType<typeof useDashboardData>["dateLabel"];
    todayTasks: ReturnType<typeof useDashboardData>["todayTasks"];
    quickActions: ReturnType<typeof useDashboardData>["quickActions"];

    // Overview data
    data: ReturnType<typeof useDashboardOverview>["data"];
    isLoading: boolean;
    error: Error | null;
    handleRefresh: () => Promise<void>;
}

export function useDashboardPage(): UseDashboardPageReturn {
    const [selectedPeriod, setSelectedPeriod] = useState(30);

    const { isServiceIntellectuel } = useCapabilities();

    const { greeting, userName, dateLabel, todayTasks, quickActions } =
        useDashboardData();

    const { data, isLoading, error, refresh } = useDashboardOverview({
        period: selectedPeriod,
    });

    const handlePeriodChange = useCallback((period: number) => {
        setSelectedPeriod(period);
    }, []);

    const handleRefresh = useCallback(async () => {
        await refresh();
    }, [refresh]);

    return {
        selectedPeriod,
        handlePeriodChange,
        isServiceIntellectuel,
        greeting,
        userName,
        dateLabel,
        todayTasks,
        quickActions,
        data,
        isLoading,
        error,
        handleRefresh,
    };
}

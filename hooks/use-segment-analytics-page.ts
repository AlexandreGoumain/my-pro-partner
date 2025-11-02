import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSegmentAnalytics } from "@/hooks/use-segments";
import type { DataQualityMetric } from "@/components/segment-analytics";

export function useSegmentAnalyticsPage(segmentId: string) {
    const router = useRouter();
    const { data: analytics, isLoading } = useSegmentAnalytics(segmentId);

    const dataQualityMetrics = useMemo<DataQualityMetric[]>(() => {
        if (!analytics) return [];

        const total = analytics.summary.totalClients;
        if (total === 0) return [];

        return [
            {
                label: "Avec email",
                percentage: (analytics.demographics.withEmail / total) * 100,
            },
            {
                label: "Avec téléphone",
                percentage: (analytics.demographics.withPhone / total) * 100,
            },
            {
                label: "Avec adresse",
                percentage: (analytics.demographics.withAddress / total) * 100,
            },
            {
                label: "Complet",
                percentage: analytics.demographics.completionRate,
            },
        ];
    }, [analytics]);

    const handleBack = () => router.back();
    const handleBackToSegments = () => router.push("/dashboard/clients/segments");

    return {
        analytics,
        isLoading,
        dataQualityMetrics,
        handleBack,
        handleBackToSegments,
    };
}

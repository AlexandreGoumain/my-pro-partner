import { Card } from "@/components/ui/card";

export interface DataQualityMetric {
    label: string;
    percentage: number;
}

export interface AnalyticsDataQualityProps {
    metrics: DataQualityMetric[];
}

export function AnalyticsDataQuality({
    metrics,
}: AnalyticsDataQualityProps) {
    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-5">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                    Qualité des données
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((metric, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[13px] text-black/60">
                                    {metric.label}
                                </p>
                                <p className="text-[13px] font-medium text-black">
                                    {metric.percentage.toFixed(0)}%
                                </p>
                            </div>
                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black"
                                    style={{
                                        width: `${metric.percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

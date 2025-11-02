import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TrendingUp } from "lucide-react";
import { calculatePercentageValue } from "@/lib/utils/statistics";

export interface DataQualityMetrics {
    withEmail: number;
    withPhone: number;
    withLocation: number;
    withBoth: number;
}

export interface DataQualityCardProps {
    metrics: DataQualityMetrics;
    total: number;
    className?: string;
}

export function DataQualityCard({ metrics, total, className }: DataQualityCardProps) {
    return (
        <Card className={className}>
            <div className="p-6">
                <SectionHeader
                    icon={TrendingUp}
                    title="Qualité des données"
                    description="Complétude des informations"
                    layout="row"
                />

                <div className="space-y-5">
                    <ProgressBar
                        label="Email renseigné"
                        value={calculatePercentageValue(metrics.withEmail, total)}
                        showPercentage
                    />

                    <ProgressBar
                        label="Téléphone renseigné"
                        value={calculatePercentageValue(metrics.withPhone, total)}
                        showPercentage
                    />

                    <ProgressBar
                        label="Localisation renseignée"
                        value={calculatePercentageValue(metrics.withLocation, total)}
                        showPercentage
                    />

                    <ProgressBar
                        label="Email ET téléphone"
                        value={calculatePercentageValue(metrics.withBoth, total)}
                        showPercentage
                    />
                </div>
            </div>
        </Card>
    );
}

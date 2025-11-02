import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { pluralize } from "@/lib/utils/format";

export interface MonthlyData {
    month: string;
    count: number;
}

export interface MonthlyEvolutionCardProps {
    data: MonthlyData[];
    title?: string;
    description?: string;
    className?: string;
}

export function MonthlyEvolutionCard({
    data,
    title = "Évolution sur 6 mois",
    description = "Nombre total de clients à la fin de chaque mois",
    className,
}: MonthlyEvolutionCardProps) {
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
        <Card className={className}>
            <div className="p-6">
                <SectionHeader title={title} description={description} />

                <div className="space-y-4">
                    {data.map((monthData, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium capitalize">
                                    {monthData.month}
                                </span>
                                <span className="font-semibold">
                                    {monthData.count} {pluralize(monthData.count, "client")}
                                </span>
                            </div>
                            <div className="h-8 bg-muted rounded-lg overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500 flex items-center justify-end pr-3"
                                    style={{
                                        width: `${(monthData.count / maxCount) * 100}%`,
                                        minWidth: monthData.count > 0 ? "30px" : "0",
                                    }}
                                >
                                    {monthData.count > 0 && (
                                        <span className="text-xs font-bold text-primary-foreground">
                                            {monthData.count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { MapPin } from "lucide-react";
import { calculatePercentage } from "@/lib/utils/statistics";

export interface CityData {
    city: string;
    count: number;
}

export interface TopCitiesCardProps {
    cities: CityData[];
    total: number;
    className?: string;
}

export function TopCitiesCard({ cities, total, className }: TopCitiesCardProps) {
    return (
        <Card className={className}>
            <div className="p-6">
                <SectionHeader
                    icon={MapPin}
                    title="Top 5 villes"
                    description="Répartition géographique"
                    layout="row"
                />

                {cities.length > 0 ? (
                    <div className="space-y-4">
                        {cities.map((cityData, index) => (
                            <div key={cityData.city} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs w-6 h-6 flex items-center justify-center p-0"
                                        >
                                            {index + 1}
                                        </Badge>
                                        <span className="font-medium">{cityData.city}</span>
                                    </div>
                                    <span className="font-semibold">{cityData.count}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{
                                            width: calculatePercentage(cityData.count, total),
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={MapPin}
                        title="Aucune donnée de localisation"
                        description="Aucune donnée de localisation disponible"
                        variant="minimal"
                        iconSize="sm"
                    />
                )}
            </div>
        </Card>
    );
}

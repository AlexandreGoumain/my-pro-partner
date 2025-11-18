import { Card } from "@/components/ui/card";
import { ActivityItem, ActivityItemProps } from "./activity-item";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface RecentActivityCardProps {
    activities: ActivityItemProps[];
    className?: string;
}

/**
 * RecentActivityCard component
 *
 * Card displaying recent activity items.
 * Uses Design System constants for consistent styling.
 */
export function RecentActivityCard({ activities, className }: RecentActivityCardProps) {
    return (
        <Card className={cn(DS.component.card.default, className)}>
            <div className="p-5">
                <h3 className={cn(DS.text.heading.h4, "mb-4")}>
                    Activité récente
                </h3>

                {activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                        ))}
                    </div>
                ) : (
                    <p className={cn(DS.text.body.base, DS.color.text.tertiary, "text-center py-8")}>
                        Aucune activité récente
                    </p>
                )}
            </div>
        </Card>
    );
}

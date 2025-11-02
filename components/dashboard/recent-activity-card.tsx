import { Card } from "@/components/ui/card";
import { ActivityItem, ActivityItemProps } from "./activity-item";
import { cn } from "@/lib/utils";

export interface RecentActivityCardProps {
    activities: ActivityItemProps[];
    className?: string;
}

export function RecentActivityCard({ activities, className }: RecentActivityCardProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-5">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                    Activité récente
                </h3>

                {activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                        ))}
                    </div>
                ) : (
                    <p className="text-[14px] text-black/40 text-center py-8">
                        Aucune activité récente
                    </p>
                )}
            </div>
        </Card>
    );
}

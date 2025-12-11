"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
    FileText,
    Calendar,
    Wrench,
    Star,
    Award,
    Bell,
    ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ActivityItem } from "@/lib/types/dashboard";

const ACTIVITY_ICONS = {
    document: FileText,
    rdv: Calendar,
    intervention: Wrench,
    points: Star,
    loyalty: Award,
    notification: Bell,
} as const;

export interface ActivityTimelineWidgetProps {
    activities: ActivityItem[];
    maxItems?: number;
    className?: string;
}

/**
 * Activity timeline widget showing recent client activities
 */
export function ActivityTimelineWidget({
    activities,
    maxItems = 5,
    className,
}: ActivityTimelineWidgetProps) {
    const router = useRouter();
    const displayedActivities = activities.slice(0, maxItems);

    return (
        <div className={cn("border border-black/8 rounded-lg p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-medium text-black">
                    Activité récente
                </h2>
                {activities.length > maxItems && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/client/notifications")}
                        className="text-[13px] text-black/50 hover:text-black"
                    >
                        Voir tout
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                )}
            </div>

            {displayedActivities.length > 0 ? (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-3 bottom-3 w-px bg-black/8" />

                    <div className="space-y-4">
                        {displayedActivities.map((activity, index) => {
                            const Icon = ACTIVITY_ICONS[activity.type] || Bell;
                            const isLast = index === displayedActivities.length - 1;

                            return (
                                <button
                                    key={activity.id}
                                    onClick={() => {
                                        if (activity.href) {
                                            router.push(activity.href);
                                        }
                                    }}
                                    className={cn(
                                        "relative flex gap-3 w-full text-left",
                                        "rounded-md py-1 px-1 -mx-1",
                                        "transition-all duration-200",
                                        activity.href && "hover:bg-black/[0.02] cursor-pointer"
                                    )}
                                >
                                    {/* Icon circle */}
                                    <div
                                        className={cn(
                                            "relative z-10 h-6 w-6 rounded-full",
                                            "flex items-center justify-center",
                                            "bg-white border border-black/10",
                                            "shrink-0"
                                        )}
                                    >
                                        <Icon className="h-3 w-3 text-black/50" strokeWidth={2} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-[13px] font-medium text-black truncate">
                                            {activity.title}
                                        </p>
                                        {activity.description && (
                                            <p className="text-[12px] text-black/40 truncate mt-0.5">
                                                {activity.description}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-black/30 mt-1">
                                            {formatDistanceToNow(new Date(activity.timestamp), {
                                                locale: fr,
                                                addSuffix: true,
                                            })}
                                        </p>
                                    </div>

                                    {activity.href && (
                                        <ChevronRight className="h-4 w-4 text-black/20 shrink-0 mt-1" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <Bell className="w-8 h-8 text-black/20 mx-auto mb-2" />
                    <p className="text-[13px] text-black/40">
                        Aucune activité récente
                    </p>
                </div>
            )}
        </div>
    );
}

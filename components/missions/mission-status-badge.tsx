"use client";

import {
    STATUT_MISSION_COLORS,
    STATUT_MISSION_LABELS,
    type StatutMission,
} from "@/lib/types/mission";
import { cn } from "@/lib/utils";

interface MissionStatusBadgeProps {
    statut: StatutMission;
    className?: string;
}

export function MissionStatusBadge({
    statut,
    className,
}: MissionStatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium",
                STATUT_MISSION_COLORS[statut],
                className
            )}
        >
            {STATUT_MISSION_LABELS[statut]}
        </span>
    );
}

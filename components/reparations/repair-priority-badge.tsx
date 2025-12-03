"use client";

import { createStatusBadge } from "@/components/ui/status-badge";
import { type PrioriteReparation } from "@/lib/generated/prisma";

const PRIORITY_CONFIG: Record<
    PrioriteReparation,
    { label: string; className: string }
> = {
    NORMALE: {
        label: "Normale",
        className: "bg-black/5 text-black/60 border-black/10",
    },
    URGENTE: {
        label: "Urgente",
        className: "bg-black/10 text-black/80 border-black/20",
    },
    CRITIQUE: {
        label: "Critique",
        className: "bg-black text-white border-black",
    },
};

const BasePriorityBadge = createStatusBadge(PRIORITY_CONFIG);

interface RepairPriorityBadgeProps {
    priorite: PrioriteReparation;
    className?: string;
}

export function RepairPriorityBadge({
    priorite,
    className,
}: RepairPriorityBadgeProps) {
    return <BasePriorityBadge status={priorite} className={className} />;
}

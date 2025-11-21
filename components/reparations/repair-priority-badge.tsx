"use client";

import { Badge } from "@/components/ui/badge";
import { type PrioriteReparation } from "@/lib/generated/prisma/client";

interface RepairPriorityBadgeProps {
  priorite: PrioriteReparation;
  className?: string;
}

export function RepairPriorityBadge({ priorite, className }: RepairPriorityBadgeProps) {
  const getPriorityConfig = (priority: PrioriteReparation) => {
    const configs = {
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

    return configs[priority] || configs.NORMALE;
  };

  const config = getPriorityConfig(priorite);

  return (
    <Badge
      variant="outline"
      className={`text-[12px] font-medium ${config.className} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}

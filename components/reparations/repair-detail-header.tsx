"use client";

import { RepairStatusBadge } from "./repair-status-badge";
import { RepairPriorityBadge } from "./repair-priority-badge";
import { BackButton } from "@/components/ui/back-button";
import { useRouter } from "next/navigation";

interface RepairDetailHeaderProps {
  reparation: {
    numero: string;
    statut: string;
    priorite: string;
    dateDepot: Date;
  };
}

export function RepairDetailHeader({ reparation }: RepairDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Back button */}
      <BackButton
        label="Retour aux réparations"
        onClick={() => router.push("/dashboard/reparations")}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
            Réparation {reparation.numero}
          </h1>
          <p className="text-[14px] text-black/60 mt-1">
            Déposée le{" "}
            {new Date(reparation.dateDepot).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RepairStatusBadge status={reparation.statut} />
          <RepairPriorityBadge priority={reparation.priorite} />
        </div>
      </div>
    </div>
  );
}

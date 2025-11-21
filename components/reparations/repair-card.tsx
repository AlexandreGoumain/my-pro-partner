"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RepairStatusBadge } from "./repair-status-badge";
import { RepairPriorityBadge } from "./repair-priority-badge";
import { Smartphone, Laptop, MonitorSmartphone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface RepairCardProps {
  reparation: {
    id: string;
    numero: string;
    typeAppareil: string;
    marque?: string | null;
    modele?: string | null;
    panne: string;
    statut: any;
    priorite: any;
    dateDepot: Date;
    dateEstimeeRetour?: Date | null;
    client: {
      nom: string;
      prenom?: string | null;
    };
    technicien?: {
      name?: string | null;
      prenom?: string | null;
    } | null;
    coutTotal: number;
  };
}

export function RepairCard({ reparation }: RepairCardProps) {
  const getDeviceIcon = (type: string) => {
    if (type.includes("SMARTPHONE") || type.includes("TABLETTE")) {
      return Smartphone;
    }
    if (type.includes("MAC") || type.includes("PC")) {
      return Laptop;
    }
    return MonitorSmartphone;
  };

  const DeviceIcon = getDeviceIcon(reparation.typeAppareil);

  const deviceName = [
    reparation.marque,
    reparation.modele,
    reparation.typeAppareil.replace(/_/g, " "),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={`/dashboard/reparations/${reparation.id}`}>
      <Card className="border-black/10 hover:border-black/20 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black/5 rounded-lg">
                  <DeviceIcon
                    className="h-5 w-5 text-black/60"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-black">
                    {reparation.numero}
                  </p>
                  <p className="text-[13px] text-black/60 mt-0.5">
                    {deviceName}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <RepairPriorityBadge priorite={reparation.priorite} />
                <RepairStatusBadge statut={reparation.statut} />
              </div>
            </div>

            {/* Issue description */}
            <p className="text-[13px] text-black/60 line-clamp-2">
              {reparation.panne}
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
              <div>
                <p className="text-[11px] text-black/40 mb-1">Client</p>
                <p className="text-[13px] text-black/80 font-medium">
                  {reparation.client.prenom
                    ? `${reparation.client.prenom} ${reparation.client.nom}`
                    : reparation.client.nom}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-black/40 mb-1">Technicien</p>
                <p className="text-[13px] text-black/80 font-medium">
                  {reparation.technicien?.name ||
                    reparation.technicien?.prenom ||
                    "Non assigné"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-black/40 mb-1">Dépôt</p>
                <p className="text-[13px] text-black/80">
                  {format(new Date(reparation.dateDepot), "d MMM yyyy", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-black/40 mb-1">Montant</p>
                <p className="text-[13px] text-black/80 font-semibold">
                  {Number(reparation.coutTotal).toFixed(2)} €
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

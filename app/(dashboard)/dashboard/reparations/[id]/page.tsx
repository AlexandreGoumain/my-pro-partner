"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { RepairDetailHeader } from "@/components/reparations/repair-detail-header";
import { RepairDeviceInfo } from "@/components/reparations/repair-device-info";
import { RepairClientInfo } from "@/components/reparations/repair-client-info";
import { RepairCostBreakdown } from "@/components/reparations/repair-cost-breakdown";
import { RepairPartsList } from "@/components/reparations/repair-parts-list";
import { RepairHistoryTimeline } from "@/components/reparations/repair-history-timeline";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReparationDetailPage({ params }: PageProps) {
  const { id } = use(params);

  // Fetch repair details
  const { data: reparation, isLoading } = useQuery({
    queryKey: ["reparation", id],
    queryFn: async () => {
      const response = await fetch(`/api/reparations/${id}`);
      if (!response.ok) throw new Error("Failed to fetch repair");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-black/40" />
      </div>
    );
  }

  if (!reparation) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <h2 className="text-[20px] font-semibold text-black mb-2">
            Réparation introuvable
          </h2>
          <p className="text-[14px] text-black/60">
            Cette réparation n'existe pas ou vous n'avez pas accès à celle-ci.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <RepairDetailHeader reparation={reparation} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Device & Client Info */}
        <div className="lg:col-span-2 space-y-6">
          <RepairDeviceInfo reparation={reparation} />
          <RepairClientInfo
            client={reparation.client}
            technicien={reparation.technicien}
          />
        </div>

        {/* Right Column - Costs */}
        <div className="space-y-6">
          <RepairCostBreakdown reparation={reparation} />
        </div>
      </div>

      {/* Parts & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RepairPartsList pieces={reparation.lignesPieces || []} />
        <RepairHistoryTimeline historique={reparation.historique || []} />
      </div>
    </div>
  );
}

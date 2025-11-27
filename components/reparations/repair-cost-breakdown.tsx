"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetadataField } from "@/components/ui/metadata-field";
import { Euro } from "lucide-react";

interface RepairCostBreakdownProps {
  reparation: {
    coutMain: number;
    coutPieces: number;
    coutTotal: number;
    diagnostic?: string | null;
    coutEstime?: number | null;
    delaiReparation?: number | null;
  };
}

export function RepairCostBreakdown({ reparation }: RepairCostBreakdownProps) {
  return (
    <Card className="border-black/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
          <Euro className="h-5 w-5 text-black/60" strokeWidth={2} />
          Coûts et diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Diagnostic */}
        {reparation.diagnostic && (
          <MetadataField
            label="Diagnostic"
            value={reparation.diagnostic}
            preserveWhitespace
          />
        )}

        {/* Estimated Cost */}
        {reparation.coutEstime !== null && reparation.coutEstime !== undefined && (
          <MetadataField
            label="Coût estimé"
            value={`${Number(reparation.coutEstime).toFixed(2)} €`}
          />
        )}

        {/* Repair Time */}
        {reparation.delaiReparation && (
          <MetadataField
            label="Délai de réparation estimé"
            value={`${reparation.delaiReparation} jour${reparation.delaiReparation > 1 ? "s" : ""}`}
          />
        )}

        {/* Cost Breakdown */}
        <div className="pt-4 border-t border-black/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[14px] text-black/60">Main d'œuvre</div>
            <div className="text-[14px] text-black font-medium">
              {Number(reparation.coutMain).toFixed(2)} €
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[14px] text-black/60">Pièces</div>
            <div className="text-[14px] text-black font-medium">
              {Number(reparation.coutPieces).toFixed(2)} €
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-black/10">
            <div className="text-[16px] text-black font-semibold">
              Total
            </div>
            <div className="text-[20px] text-black font-semibold">
              {Number(reparation.coutTotal).toFixed(2)} €
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

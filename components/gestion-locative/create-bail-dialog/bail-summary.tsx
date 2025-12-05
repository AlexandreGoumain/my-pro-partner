"use client";

import type { BienWithRelations } from "@/hooks/immobilier/use-biens";
import { FileText } from "lucide-react";

interface BailSummaryProps {
    selectedBien: BienWithRelations | null;
    loyerHC: number;
    provisions: number;
    loyerCC: number;
}

export function BailSummary({ selectedBien, loyerHC, provisions, loyerCC }: BailSummaryProps) {
    if (!selectedBien && loyerHC <= 0) {
        return null;
    }

    return (
        <div className="bg-black/[0.02] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-[14px] font-medium">
                <FileText className="w-4 h-4 text-black/60" />
                Récapitulatif
            </div>
            {selectedBien && (
                <div className="flex justify-between text-[13px]">
                    <span className="text-black/60">Bien</span>
                    <span className="font-medium">{selectedBien.titre}</span>
                </div>
            )}
            {loyerHC > 0 && (
                <>
                    <div className="flex justify-between text-[13px]">
                        <span className="text-black/60">Loyer HC</span>
                        <span className="font-medium">{loyerHC.toLocaleString("fr-FR")} €</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                        <span className="text-black/60">Provisions</span>
                        <span className="font-medium">{provisions.toLocaleString("fr-FR")} €</span>
                    </div>
                    <div className="flex justify-between text-[13px] pt-2 border-t border-black/5">
                        <span className="text-black/80 font-medium">Loyer CC mensuel</span>
                        <span className="font-bold">{loyerCC.toLocaleString("fr-FR")} €</span>
                    </div>
                </>
            )}
        </div>
    );
}

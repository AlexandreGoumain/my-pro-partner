"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface RepairPartsListProps {
  pieces: Array<{
    id: string;
    designation: string;
    quantite: number;
    prixUnitaire: number;
    montant: number;
    article?: {
      nom: string;
      reference?: string | null;
    } | null;
    ressourceAtelier?: {
      nom: string;
    } | null;
  }>;
}

export function RepairPartsList({ pieces }: RepairPartsListProps) {
  if (pieces.length === 0) {
    return (
      <Card className="border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-black/60" strokeWidth={2} />
            Pièces utilisées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[14px] text-black/40 text-center py-8">
            Aucune pièce utilisée pour le moment
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-black/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-black/60" strokeWidth={2} />
          Pièces utilisées ({pieces.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className="flex items-center justify-between p-3 rounded-md bg-black/2 hover:bg-black/5 transition-colors"
            >
              <div className="flex-1">
                <div className="text-[14px] font-medium text-black">
                  {piece.designation}
                </div>
                {(piece.article || piece.ressourceAtelier) && (
                  <div className="text-[13px] text-black/60 mt-0.5">
                    {piece.article
                      ? `${piece.article.nom}${
                          piece.article.reference
                            ? ` (${piece.article.reference})`
                            : ""
                        }`
                      : piece.ressourceAtelier?.nom}
                  </div>
                )}
                <div className="text-[13px] text-black/40 mt-1">
                  Qté: {piece.quantite} × {Number(piece.prixUnitaire).toFixed(2)} €
                </div>
              </div>
              <div className="text-[16px] font-semibold text-black">
                {Number(piece.montant).toFixed(2)} €
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

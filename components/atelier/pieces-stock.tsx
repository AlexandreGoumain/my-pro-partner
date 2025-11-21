"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";

export function PiecesStock() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["pieces-stock", search],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: "PIECE",
        ...(search && { search }),
        limit: "100",
      });
      const response = await fetch(`/api/catalogue?${params}`);
      if (!response.ok) throw new Error("Failed to fetch pieces");
      return response.json();
    },
  });

  const pieces = data?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
          strokeWidth={2}
        />
        <Input
          placeholder="Rechercher une pièce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-10 border-black/10"
        />
      </div>

      {pieces.length === 0 ? (
        <div className="text-center py-12 border border-black/10 rounded-lg">
          <p className="text-[14px] text-black/60">
            {search
              ? "Aucune pièce trouvée"
              : "Aucune pièce en stock"}
          </p>
        </div>
      ) : (
        <div className="border border-black/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-black/2 hover:bg-black/2">
                <TableHead className="text-[13px] font-semibold text-black/60">
                  Référence
                </TableHead>
                <TableHead className="text-[13px] font-semibold text-black/60">
                  Pièce
                </TableHead>
                <TableHead className="text-[13px] font-semibold text-black/60">
                  Type
                </TableHead>
                <TableHead className="text-[13px] font-semibold text-black/60">
                  Compatibilité
                </TableHead>
                <TableHead className="text-[13px] font-semibold text-black/60 text-right">
                  Stock
                </TableHead>
                <TableHead className="text-[13px] font-semibold text-black/60 text-right">
                  Valeur estimée
                </TableHead>
                <TableHead className="text-[13px] font-semibold text-black/60 text-right">
                  Prix vente HT
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pieces.map((piece: any) => (
                <TableRow key={piece.id} className="hover:bg-black/2">
                  <TableCell className="font-mono text-[13px] text-black/60">
                    {piece.reference}
                  </TableCell>
                  <TableCell>
                    <p className="text-[14px] font-medium text-black">
                      {piece.nom}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 border-gray-200 text-[12px]"
                    >
                      {piece.typePiece?.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[13px] text-black/60">
                    {piece.marque && piece.modele
                      ? `${piece.marque} ${piece.modele}`
                      : piece.marque || piece.modele || "-"}
                  </TableCell>
                  <TableCell className="text-[13px] text-black/60 text-right font-medium">
                    {piece.stock_actuel}
                  </TableCell>
                  <TableCell className="text-[13px] text-black/60 text-right">
                    {piece.valeurEstimee
                      ? `${Number(piece.valeurEstimee).toFixed(2)} €`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-[14px] text-black font-medium text-right">
                    {Number(piece.prix_ht).toFixed(2)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Stats */}
      {pieces.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/2 border border-black/10 rounded-lg p-4">
            <p className="text-[12px] text-black/60 mb-1">Pièces en stock</p>
            <p className="text-[24px] font-semibold text-black">
              {pieces.length}
            </p>
          </div>
          <div className="bg-black/2 border border-black/10 rounded-lg p-4">
            <p className="text-[12px] text-black/60 mb-1">Quantité totale</p>
            <p className="text-[24px] font-semibold text-black">
              {pieces.reduce(
                (sum: number, p: any) => sum + p.stock_actuel,
                0
              )}
            </p>
          </div>
          <div className="bg-black/2 border border-black/10 rounded-lg p-4">
            <p className="text-[12px] text-black/60 mb-1">Valeur totale</p>
            <p className="text-[24px] font-semibold text-black">
              {pieces
                .reduce(
                  (sum: number, p: any) =>
                    sum +
                    (Number(p.valeurEstimee) || 0) * p.stock_actuel,
                  0
                )
                .toFixed(2)}{" "}
              €
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

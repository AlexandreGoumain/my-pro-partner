"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

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
            <div className="group relative overflow-hidden bg-white border border-black/[0.08] rounded-lg p-4 hover:shadow-sm transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
                        strokeWidth={2}
                    />
                    <Input
                        placeholder="Rechercher une pièce..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 pl-10 border-black/10 text-[14px]"
                    />
                </div>
            </div>

            {pieces.length === 0 ? (
                <div className="text-center py-12 border border-black/[0.08] rounded-lg bg-white">
                    <p className="text-[13px] text-black/60">
                        {search
                            ? "Aucune pièce trouvée"
                            : "Aucune pièce en stock"}
                    </p>
                </div>
            ) : (
                <div className="border border-black/[0.08] rounded-lg overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-black/[0.02] hover:bg-black/[0.02]">
                                <TableHead className="text-[13px] font-medium text-black/70">
                                    Référence
                                </TableHead>
                                <TableHead className="text-[13px] font-medium text-black/70">
                                    Pièce
                                </TableHead>
                                <TableHead className="text-[13px] font-medium text-black/70">
                                    Type
                                </TableHead>
                                <TableHead className="text-[13px] font-medium text-black/70">
                                    Compatibilité
                                </TableHead>
                                <TableHead className="text-[13px] font-medium text-black/70 text-right">
                                    Stock
                                </TableHead>
                                <TableHead className="text-[13px] font-medium text-black/70 text-right">
                                    Valeur estimée
                                </TableHead>
                                <TableHead className="text-[13px] font-medium text-black/70 text-right">
                                    Prix vente HT
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pieces.map((piece: any) => (
                                <TableRow
                                    key={piece.id}
                                    className="hover:bg-black/[0.02] transition-colors"
                                >
                                    <TableCell className="font-mono text-[12px] text-black/60">
                                        {piece.reference}
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-[13px] font-medium text-black">
                                            {piece.nom}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium"
                                        >
                                            {piece.typePiece?.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[13px] text-black/70">
                                        {piece.marque && piece.modele
                                            ? `${piece.marque} ${piece.modele}`
                                            : piece.marque ||
                                              piece.modele ||
                                              "-"}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-black font-medium text-right">
                                        {piece.stock_actuel}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-black/70 text-right">
                                        {piece.valeurEstimee
                                            ? `${Number(piece.valeurEstimee).toFixed(2)} €`
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-black font-medium text-right">
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
                <div className="grid grid-cols-3 gap-5">
                    <div className="group relative overflow-hidden bg-white border border-black/[0.08] rounded-lg p-6 hover:shadow-sm transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                <p className="text-[13px] font-medium tracking-[-0.01em] text-black/60">
                                    Pièces en stock
                                </p>
                            </div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                                {pieces.length}
                            </p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden bg-white border border-black/[0.08] rounded-lg p-6 hover:shadow-sm transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                <p className="text-[13px] font-medium tracking-[-0.01em] text-black/60">
                                    Quantité totale
                                </p>
                            </div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                                {pieces.reduce(
                                    (sum: number, p: any) =>
                                        sum + p.stock_actuel,
                                    0
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden bg-white border border-black/[0.08] rounded-lg p-6 hover:shadow-sm transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                <p className="text-[13px] font-medium tracking-[-0.01em] text-black/60">
                                    Valeur totale
                                </p>
                            </div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                                {pieces
                                    .reduce(
                                        (sum: number, p: any) =>
                                            sum +
                                            (Number(p.valeurEstimee) || 0) *
                                                p.stock_actuel,
                                        0
                                    )
                                    .toFixed(2)}{" "}
                                €
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

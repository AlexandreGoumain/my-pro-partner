"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArticleType } from "@/lib/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CatalogueTableProps {
    search: string;
    type: ArticleType | null;
}

interface Article {
    id: string;
    reference: string;
    nom: string;
    type: ArticleType;
    prix_ht: number;
    tva_taux: number;
    stock_actuel: number;
    categorie?: {
        nom: string;
    };
    rachat?: {
        etat: string;
        prixRachat: number;
    };
    typePiece?: string;
    marque?: string;
    modele?: string;
}

const typeLabels: Record<ArticleType, string> = {
    PRODUIT: "Produit neuf",
    SERVICE: "Service",
    OCCASION: "Occasion",
    PIECE: "Pièce",
};

const typeBadgeColors: Record<ArticleType, string> = {
    PRODUIT: "bg-blue-100 text-blue-800 border-blue-200",
    SERVICE: "bg-purple-100 text-purple-800 border-purple-200",
    OCCASION: "bg-amber-100 text-amber-800 border-amber-200",
    PIECE: "bg-gray-100 text-gray-800 border-gray-200",
};

export function CatalogueTable({ search, type }: CatalogueTableProps) {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ["catalogue", search, type, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                ...(search && { search }),
                ...(type && { type }),
            });

            const response = await fetch(`/api/catalogue?${params}`);
            if (!response.ok) throw new Error("Failed to fetch catalogue");
            return response.json();
        },
    });

    const articles = data?.items || [];
    const pagination = data?.pagination;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <EmptyState
                title={
                    search
                        ? "Aucun article trouvé pour cette recherche"
                        : "Aucun article dans cette catégorie"
                }
                variant="inline"
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="border border-black/10 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black/2 hover:bg-black/2">
                            <TableHead className="text-[13px] font-semibold text-black/60">
                                Référence
                            </TableHead>
                            <TableHead className="text-[13px] font-semibold text-black/60">
                                Article
                            </TableHead>
                            {!type && (
                                <TableHead className="text-[13px] font-semibold text-black/60">
                                    Type
                                </TableHead>
                            )}
                            <TableHead className="text-[13px] font-semibold text-black/60">
                                Catégorie
                            </TableHead>
                            {type !== "SERVICE" && (
                                <TableHead className="text-[13px] font-semibold text-black/60 text-right">
                                    Stock
                                </TableHead>
                            )}
                            <TableHead className="text-[13px] font-semibold text-black/60 text-right">
                                Prix HT
                            </TableHead>
                            {type === "OCCASION" && (
                                <TableHead className="text-[13px] font-semibold text-black/60 text-right">
                                    Prix rachat
                                </TableHead>
                            )}
                            {type === "PIECE" && (
                                <TableHead className="text-[13px] font-semibold text-black/60">
                                    Compatibilité
                                </TableHead>
                            )}
                            <TableHead className="text-[13px] font-semibold text-black/60 w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map((article: Article) => (
                            <TableRow
                                key={article.id}
                                className="hover:bg-black/2"
                            >
                                <TableCell className="font-mono text-[13px] text-black/60">
                                    {article.reference}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-[14px] font-medium text-black">
                                            {article.nom}
                                        </p>
                                        {article.typePiece && (
                                            <p className="text-[12px] text-black/40 mt-0.5">
                                                {article.typePiece}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                {!type && (
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`${typeBadgeColors[article.type]} text-[12px] font-medium`}
                                        >
                                            {typeLabels[article.type]}
                                        </Badge>
                                    </TableCell>
                                )}
                                <TableCell className="text-[13px] text-black/60">
                                    {article.categorie?.nom || "-"}
                                </TableCell>
                                {type !== "SERVICE" && (
                                    <TableCell className="text-[13px] text-black/60 text-right font-medium">
                                        {article.stock_actuel}
                                    </TableCell>
                                )}
                                <TableCell className="text-[14px] text-black font-medium text-right">
                                    {Number(article.prix_ht).toFixed(2)} €
                                </TableCell>
                                {type === "OCCASION" && (
                                    <TableCell className="text-[13px] text-black/60 text-right">
                                        {article.rachat?.prixRachat
                                            ? Number(
                                                  article.rachat.prixRachat
                                              ).toFixed(2)
                                            : "-"}{" "}
                                        €
                                    </TableCell>
                                )}
                                {type === "PIECE" && (
                                    <TableCell className="text-[13px] text-black/60">
                                        {article.marque && article.modele
                                            ? `${article.marque} ${article.modele}`
                                            : article.marque ||
                                              article.modele ||
                                              "-"}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/dashboard/catalogue/${article.id}`}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Voir
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-[13px] text-black/60">
                        Page {pagination.page} sur {pagination.totalPages} •{" "}
                        {pagination.total} articles au total
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={pagination.page === 1}
                            className="border-black/10"
                        >
                            Précédent
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="border-black/10"
                        >
                            Suivant
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

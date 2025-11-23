"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { useDeleteStockMouvement } from "@/hooks/use-stock";
import { getMovementConfig } from "@/lib/constants/stock-movements";
import type { MouvementStockDisplay } from "@/lib/types/stock";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StockHistoryTableProps {
    mouvements: MouvementStockDisplay[];
    showArticle?: boolean;
    isLoading?: boolean;
}

export function StockHistoryTable({
    mouvements,
    showArticle = true,
    isLoading = false,
}: StockHistoryTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const deleteMouvement = useDeleteStockMouvement();

    const handleDelete = () => {
        if (!deleteId) return;

        deleteMouvement.mutate(deleteId, {
            onSuccess: () => {
                toast.success("Mouvement annulé avec succès");
                setDeleteId(null);
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de l'annulation"
                );
            },
        });
    };

    if (isLoading) {
        return (
            <GridSkeleton
                itemCount={5}
                gridColumns={{ default: 1 }}
                gap={2}
                itemHeight="h-16"
            />
        );
    }

    if (mouvements.length === 0) {
        return (
            <div className="flex items-center justify-center py-10 border border-black/[0.08] rounded-md bg-white">
                <p className="text-black/60 text-[13px]">
                    Aucun mouvement de stock enregistré
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border border-black/[0.08] bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black/[0.02] hover:bg-black/[0.02]">
                            <TableHead className="text-[13px] font-medium text-black/70">Date</TableHead>
                            {showArticle && <TableHead className="text-[13px] font-medium text-black/70">Article</TableHead>}
                            <TableHead className="text-[13px] font-medium text-black/70">Type</TableHead>
                            <TableHead className="text-right text-[13px] font-medium text-black/70">
                                Quantité
                            </TableHead>
                            <TableHead className="text-right text-[13px] font-medium text-black/70">
                                Stock avant
                            </TableHead>
                            <TableHead className="text-right text-[13px] font-medium text-black/70">
                                Stock après
                            </TableHead>
                            <TableHead className="text-[13px] font-medium text-black/70">Motif</TableHead>
                            <TableHead className="text-[13px] font-medium text-black/70">Référence</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mouvements.map((mouvement) => {
                            const config = getMovementConfig(mouvement.type);
                            return (
                                <TableRow key={mouvement.id} className="hover:bg-black/[0.02] transition-colors">
                                    <TableCell className="text-[13px] font-medium text-black">
                                        {format(
                                            new Date(mouvement.createdAt),
                                            "dd/MM/yyyy HH:mm",
                                            {
                                                locale: fr,
                                            }
                                        )}
                                    </TableCell>
                                    {showArticle && (
                                        <TableCell>
                                            <div>
                                                <p className="text-[13px] font-medium text-black">
                                                    {mouvement.articleNom}
                                                </p>
                                                <p className="text-[12px] text-black/60">
                                                    {mouvement.articleReference}
                                                </p>
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium"
                                        >
                                            {config.icon} {config.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-[13px] font-medium text-black">
                                        {mouvement.quantite > 0 ? "+" : ""}
                                        {mouvement.quantite}
                                    </TableCell>
                                    <TableCell className="text-right text-[13px] text-black/70">
                                        {mouvement.stock_avant}
                                    </TableCell>
                                    <TableCell className="text-right text-[13px] font-medium text-black">
                                        {mouvement.stock_apres}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-[13px] text-black/70">
                                        {mouvement.motif || "-"}
                                    </TableCell>
                                    <TableCell className="text-[13px] text-black/70">
                                        {mouvement.reference || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 hover:bg-black/5"
                                                >
                                                    <span className="sr-only">
                                                        Ouvrir le menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-[13px]">
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeleteId(
                                                            mouvement.id
                                                        )
                                                    }
                                                    className="text-destructive text-[13px]"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" strokeWidth={2} />
                                                    Annuler le mouvement
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent className="border-black/[0.08]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                            Annuler ce mouvement ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[13px] text-black/70">
                            Cette action va créer un mouvement compensatoire
                            pour annuler cet enregistrement. Le stock de
                            l&apos;article sera ajusté en conséquence.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-black/10 hover:bg-black/5 text-[14px] font-medium">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-black hover:bg-black/90 text-white text-[14px] font-medium"
                        >
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

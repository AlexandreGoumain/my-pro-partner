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
            <div className="flex items-center justify-center py-10">
                <p className="text-muted-foreground">Chargement...</p>
            </div>
        );
    }

    if (mouvements.length === 0) {
        return (
            <div className="flex items-center justify-center py-10 border rounded-md">
                <p className="text-muted-foreground">
                    Aucun mouvement de stock enregistré
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            {showArticle && <TableHead>Article</TableHead>}
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">
                                Quantité
                            </TableHead>
                            <TableHead className="text-right">
                                Stock avant
                            </TableHead>
                            <TableHead className="text-right">
                                Stock après
                            </TableHead>
                            <TableHead>Motif</TableHead>
                            <TableHead>Référence</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mouvements.map((mouvement) => {
                            const config = getMovementConfig(mouvement.type);
                            return (
                                <TableRow key={mouvement.id}>
                                    <TableCell className="font-medium">
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
                                                <p className="font-medium">
                                                    {mouvement.articleNom}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {mouvement.articleReference}
                                                </p>
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`${config.color} ${config.bgColor} ${config.borderColor}`}
                                        >
                                            {config.icon} {config.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell
                                        className={`text-right font-medium ${
                                            mouvement.quantite > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {mouvement.quantite > 0 ? "+" : ""}
                                        {mouvement.quantite}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {mouvement.stock_avant}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {mouvement.stock_apres}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {mouvement.motif || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {mouvement.reference || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Ouvrir le menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeleteId(
                                                            mouvement.id
                                                        )
                                                    }
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Annuler ce mouvement ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action va créer un mouvement compensatoire
                            pour annuler cet enregistrement. Le stock de
                            l&apos;article sera ajusté en conséquence.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

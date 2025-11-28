"use client";

import { TimeEntryDialog } from "@/components/temps/time-entry-dialog";
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
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { useDeleteTemps } from "@/hooks/use-temps";
import type { EntreeTemps, MissionWithDetails } from "@/lib/types/mission";
import { formatDuree } from "@/lib/types/mission";
import {
    Clock,
    FileText,
    Loader2,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useState } from "react";

export interface MissionTimeEntriesProps {
    mission: MissionWithDetails;
    onInvoiceSelected?: (entryIds: string[]) => void;
}

export function MissionTimeEntries({
    mission,
    onInvoiceSelected,
}: MissionTimeEntriesProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editEntry, setEditEntry] = useState<EntreeTemps | null>(null);
    const [deleteEntry, setDeleteEntry] = useState<EntreeTemps | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const deleteTemps = useDeleteTemps();

    const entries = mission.entreesTemps || [];
    const unbilledEntries = entries.filter((e) => !e.facturee && e.facturable);

    const totalMinutes = entries.reduce((sum, e) => sum + e.duree, 0);
    const totalBillable = entries
        .filter((e) => e.facturable)
        .reduce((sum, e) => sum + e.duree, 0);
    const totalUnbilled = unbilledEntries.reduce((sum, e) => sum + e.duree, 0);
    const totalUnbilledAmount = unbilledEntries.reduce(
        (sum, e) => sum + e.montant,
        0
    );

    const handleEdit = (entry: EntreeTemps) => {
        setEditEntry(entry);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteEntry) return;
        await deleteTemps.mutateAsync(deleteEntry.id);
        setDeleteEntry(null);
    };

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setEditEntry(null);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(unbilledEntries.map((e) => e.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectEntry = (entryId: string, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, entryId]);
        } else {
            setSelectedIds(selectedIds.filter((id) => id !== entryId));
        }
    };

    const handleInvoiceSelected = () => {
        if (onInvoiceSelected && selectedIds.length > 0) {
            onInvoiceSelected(selectedIds);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <Card className="border-black/8">
            {/* Header */}
            <div className="p-4 border-b border-black/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-[15px] font-medium text-black/80">
                            Entrées de temps
                        </h3>
                        <p className="text-[13px] text-black/40 mt-0.5">
                            {entries.length} entrée
                            {entries.length > 1 ? "s" : ""} •{" "}
                            {formatDuree(totalMinutes)} total •{" "}
                            {formatDuree(totalBillable)} facturables
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && onInvoiceSelected && (
                            <Button
                                onClick={handleInvoiceSelected}
                                variant="outline"
                                className="h-9 px-3 border-black/10"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Facturer ({selectedIds.length})
                            </Button>
                        )}
                        <Button
                            onClick={() => setDialogOpen(true)}
                            className="h-9 px-3 bg-black hover:bg-black/90"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter
                        </Button>
                    </div>
                </div>

                {/* Unbilled summary */}
                {totalUnbilled > 0 && (
                    <div className="mt-3 p-3 bg-black/2 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-black/40" />
                            <span className="text-[13px] text-black/60">
                                {formatDuree(totalUnbilled)} non facturées
                            </span>
                        </div>
                        <span className="text-[14px] font-medium text-black">
                            {totalUnbilledAmount.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                            })}
                        </span>
                    </div>
                )}
            </div>

            {/* Table */}
            {entries.length === 0 ? (
                <div className="p-8 text-center">
                    <Clock className="h-10 w-10 text-black/20 mx-auto mb-3" />
                    <h4 className="text-[14px] font-medium text-black/80 mb-1">
                        Aucune entrée de temps
                    </h4>
                    <p className="text-[13px] text-black/40 mb-4">
                        Commencez à tracker le temps sur cette mission
                    </p>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="h-10 px-4 bg-black hover:bg-black/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une entrée
                    </Button>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="border-black/5">
                            {onInvoiceSelected &&
                                unbilledEntries.length > 0 && (
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                selectedIds.length ===
                                                unbilledEntries.length
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                )}
                            <TableHead className="text-[12px] text-black/50">
                                Date
                            </TableHead>
                            <TableHead className="text-[12px] text-black/50">
                                Description
                            </TableHead>
                            <TableHead className="text-[12px] text-black/50">
                                Collaborateur
                            </TableHead>
                            <TableHead className="text-[12px] text-black/50 text-right">
                                Durée
                            </TableHead>
                            <TableHead className="text-[12px] text-black/50 text-right">
                                Montant
                            </TableHead>
                            <TableHead className="text-[12px] text-black/50">
                                Statut
                            </TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id} className="border-black/5">
                                {onInvoiceSelected &&
                                    unbilledEntries.length > 0 && (
                                        <TableCell>
                                            {!entry.facturee &&
                                                entry.facturable && (
                                                    <Checkbox
                                                        checked={selectedIds.includes(
                                                            entry.id
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            handleSelectEntry(
                                                                entry.id,
                                                                checked as boolean
                                                            )
                                                        }
                                                    />
                                                )}
                                        </TableCell>
                                    )}
                                <TableCell className="text-[13px] text-black/70">
                                    {formatDate(entry.date)}
                                </TableCell>
                                <TableCell className="text-[13px] text-black/70 max-w-[300px] truncate">
                                    {entry.description}
                                </TableCell>
                                <TableCell className="text-[13px] text-black/50">
                                    {entry.user?.name || entry.user?.email}
                                </TableCell>
                                <TableCell className="text-[13px] text-black/70 text-right font-medium">
                                    {formatDuree(entry.duree)}
                                </TableCell>
                                <TableCell className="text-[13px] text-black/70 text-right">
                                    {entry.facturable
                                        ? entry.montant.toLocaleString(
                                              "fr-FR",
                                              {
                                                  style: "currency",
                                                  currency: "EUR",
                                              }
                                          )
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    {entry.facturee ? (
                                        <Badge className="bg-black/10 text-black/60 hover:bg-black/10 text-[10px]">
                                            Facturé
                                        </Badge>
                                    ) : entry.facturable ? (
                                        <Badge
                                            variant="outline"
                                            className="border-black/10 text-black/50 text-[10px]"
                                        >
                                            À facturer
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="border-black/5 text-black/30 text-[10px]"
                                        >
                                            Non fact.
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!entry.facturee && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleEdit(entry)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeleteEntry(entry)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Create/Edit dialog */}
            <TimeEntryDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                missions={[mission]}
                entry={editEntry}
                defaultMissionId={mission.id}
            />

            {/* Delete confirmation */}
            <AlertDialog
                open={!!deleteEntry}
                onOpenChange={(open) => !open && setDeleteEntry(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Supprimer l'entrée ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteTemps.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Supprimer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

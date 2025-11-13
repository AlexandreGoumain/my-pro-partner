"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentHandlers } from "@/hooks/use-document-page";
import { Document } from "@/lib/types/document.types";
import { getClientFullName } from "@/lib/utils/client-formatting";
import { formatCurrency } from "@/lib/utils/format";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit, Eye, FileX, MoreHorizontal, Trash2 } from "lucide-react";

export const createColumns = (
    handlers: DocumentHandlers<Document>
): ColumnDef<Document>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Tout sélectionner"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Sélectionner la ligne"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "numero",
        header: "Numéro",
        cell: ({ row }) => {
            const credit = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/5">
                        <FileX
                            className="h-4 w-4 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <span className="font-medium text-[14px]">
                        {credit.numero}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "client",
        header: "Client",
        cell: ({ row }) => {
            const client = row.original.client;
            const nomComplet = getClientFullName(client.nom, client.prenom);

            return (
                <div className="min-w-0">
                    <div className="font-medium text-[14px]">{nomComplet}</div>
                    {client.email && (
                        <div className="text-[13px] text-black/40 truncate">
                            {client.email}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "dateEmission",
        header: "Date d'émission",
        cell: ({ row }) => {
            return (
                <div className="text-[14px]">
                    {format(
                        new Date(row.original.dateEmission),
                        "dd MMM yyyy",
                        {
                            locale: fr,
                        }
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
            return <DocumentStatusBadge status={row.original.statut} />;
        },
    },
    {
        accessorKey: "total_ttc",
        header: () => <div className="text-right">Montant TTC</div>,
        cell: ({ row }) => {
            const amount = row.original.total_ttc;
            return (
                <div className="text-right font-medium text-[14px]">
                    {formatCurrency(amount)}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const credit = row.original;

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-black/5"
                            >
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => handlers.onView(credit)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                                Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handlers.onEdit(credit)}
                                className="cursor-pointer"
                            >
                                <Edit
                                    className="mr-2 h-4 w-4"
                                    strokeWidth={2}
                                />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handlers.onDelete(credit)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash2
                                    className="mr-2 h-4 w-4"
                                    strokeWidth={2}
                                />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

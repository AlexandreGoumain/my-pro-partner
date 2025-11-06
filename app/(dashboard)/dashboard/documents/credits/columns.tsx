"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { DocumentTypeBadge } from "@/components/ui/document-type-badge";

export type CreditNote = {
    id: string;
    numero: string;
    type: "AVOIR";
    statut: string;
    dateEmission: Date;
    client: {
        nom: string;
        prenom?: string | null;
    };
    total_ttc: number;
};

export const columns: ColumnDef<CreditNote>[] = [
    {
        accessorKey: "numero",
        header: "Numéro",
        cell: ({ row }) => {
            const numero = row.getValue("numero") as string;
            return (
                <div className="flex items-center gap-2">
                    <DocumentTypeBadge type="AVOIR" />
                    <span className="font-medium text-[14px]">{numero}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "client",
        header: "Client",
        cell: ({ row }) => {
            const client = row.getValue("client") as {
                nom: string;
                prenom?: string | null;
            };
            const clientName = client.prenom
                ? `${client.nom} ${client.prenom}`
                : client.nom;
            return <div className="text-[14px]">{clientName}</div>;
        },
    },
    {
        accessorKey: "dateEmission",
        header: "Date d'émission",
        cell: ({ row }) => {
            const date = row.getValue("dateEmission") as Date;
            return (
                <div className="text-[14px] text-black/60">
                    {format(new Date(date), "dd MMM yyyy", { locale: fr })}
                </div>
            );
        },
    },
    {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
            const statut = row.getValue("statut") as string;
            return <DocumentStatusBadge status={statut} />;
        },
    },
    {
        accessorKey: "total_ttc",
        header: () => <div className="text-right">Montant TTC</div>,
        cell: ({ row }) => {
            const amount = row.getValue("total_ttc") as number;
            const formatted = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
            }).format(amount);
            return <div className="text-right font-medium text-[14px]">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const credit = row.original;
            const meta = table.options.meta as any;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => meta?.onView?.(credit.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => meta?.onDelete?.(credit.id)}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

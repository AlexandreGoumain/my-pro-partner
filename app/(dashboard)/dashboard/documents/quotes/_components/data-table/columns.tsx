"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, FileText, MoreHorizontal, Receipt, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface Quote {
    id: string;
    numero: string;
    dateEmission: Date;
    dateEcheance: Date | null;
    statut: "BROUILLON" | "ENVOYE" | "ACCEPTE" | "REFUSE" | "ANNULE";
    client: {
        nom: string;
        prenom: string | null;
        email: string | null;
    };
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    validite_jours: number;
}

interface QuoteHandlers {
    onView: (quote: Quote) => void;
    onEdit: (quote: Quote) => void;
    onDelete: (quote: Quote) => void;
    onConvertToInvoice: (quote: Quote) => void;
}

export const createColumns = (
    handlers: QuoteHandlers
): ColumnDef<Quote>[] => [
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
            const quote = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/5">
                        <FileText className="h-4 w-4 text-black/60" strokeWidth={2} />
                    </div>
                    <span className="font-medium text-[14px]">{quote.numero}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "client",
        header: "Client",
        cell: ({ row }) => {
            const client = row.original.client;
            const nomComplet = client.prenom
                ? `${client.nom} ${client.prenom}`
                : client.nom;

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
                    {format(new Date(row.original.dateEmission), "dd MMM yyyy", {
                        locale: fr,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "dateEcheance",
        header: "Validité",
        cell: ({ row }) => {
            const dateEcheance = row.original.dateEcheance;
            if (!dateEcheance) return <span className="text-black/40">-</span>;

            const isExpired = new Date(dateEcheance) < new Date();

            return (
                <div className="text-[14px]">
                    <span className={isExpired ? "text-red-600" : ""}>
                        {format(new Date(dateEcheance), "dd MMM yyyy", {
                            locale: fr,
                        })}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "total_ttc",
        header: "Montant TTC",
        cell: ({ row }) => {
            const amount = row.original.total_ttc;
            return (
                <div className="font-medium text-[14px]">
                    {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                    }).format(amount)}
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
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const quote = row.original;
            const canConvert = quote.statut === "ACCEPTE";

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-black/5"
                            >
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => handlers.onView(quote)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                                Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handlers.onEdit(quote)}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" strokeWidth={2} />
                                Modifier
                            </DropdownMenuItem>
                            {canConvert && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handlers.onConvertToInvoice(quote)}
                                        className="cursor-pointer"
                                    >
                                        <Receipt className="mr-2 h-4 w-4" strokeWidth={2} />
                                        Convertir en facture
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handlers.onDelete(quote)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" strokeWidth={2} />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

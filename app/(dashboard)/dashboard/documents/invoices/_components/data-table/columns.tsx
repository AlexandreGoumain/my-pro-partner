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
import { CreditCard, Edit, Eye, MoreHorizontal, Receipt, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface Invoice {
    id: string;
    numero: string;
    dateEmission: Date;
    dateEcheance: Date | null;
    statut: "BROUILLON" | "ENVOYE" | "ACCEPTE" | "PAYE" | "ANNULE";
    client: {
        nom: string;
        prenom: string | null;
        email: string | null;
    };
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    reste_a_payer: number;
}

interface InvoiceHandlers {
    onView: (invoice: Invoice) => void;
    onEdit: (invoice: Invoice) => void;
    onDelete: (invoice: Invoice) => void;
    onAddPayment: (invoice: Invoice) => void;
}

export const createColumns = (
    handlers: InvoiceHandlers
): ColumnDef<Invoice>[] => [
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
            const invoice = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black/5">
                        <Receipt className="h-4 w-4 text-black/60" strokeWidth={2} />
                    </div>
                    <span className="font-medium text-[14px]">{invoice.numero}</span>
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
        header: "Échéance",
        cell: ({ row }) => {
            const dateEcheance = row.original.dateEcheance;
            if (!dateEcheance) return <span className="text-black/40">-</span>;

            const isOverdue = new Date(dateEcheance) < new Date() && row.original.statut !== "PAYE";

            return (
                <div className="text-[14px]">
                    <span className={isOverdue ? "text-red-600 font-medium" : ""}>
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
        accessorKey: "reste_a_payer",
        header: "Reste à payer",
        cell: ({ row }) => {
            const reste = row.original.reste_a_payer;
            const isPaid = reste === 0;

            return (
                <div className={`font-medium text-[14px] ${isPaid ? "text-green-600" : ""}`}>
                    {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                    }).format(reste)}
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
            const invoice = row.original;
            const canAddPayment = invoice.statut !== "PAYE" && invoice.statut !== "ANNULE" && invoice.reste_a_payer > 0;

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
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem
                                onClick={() => handlers.onView(invoice)}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                                Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handlers.onEdit(invoice)}
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" strokeWidth={2} />
                                Modifier
                            </DropdownMenuItem>
                            {canAddPayment && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => handlers.onAddPayment(invoice)}
                                        className="cursor-pointer"
                                    >
                                        <CreditCard className="mr-2 h-4 w-4" strokeWidth={2} />
                                        Enregistrer un paiement
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handlers.onDelete(invoice)}
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

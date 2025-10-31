"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from "@/hooks/use-clients";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Mail, MapPin, MoreHorizontal, Phone, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientHandlers {
    onView: (client: Client) => void;
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
}

export const createColumns = (
    handlers: ClientHandlers
): ColumnDef<Client>[] => [
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
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nom",
        header: "Client",
        cell: ({ row }) => {
            const client = row.original;
            const nomComplet = client.prenom
                ? `${client.nom} ${client.prenom}`
                : client.nom;
            const initiales = client.prenom
                ? `${client.nom.charAt(0)}${client.prenom.charAt(0)}`
                : client.nom.substring(0, 2);

            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm font-medium">
                        {initiales.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium">{nomComplet}</div>
                        {client.email && (
                            <div className="text-sm text-black/40 truncate flex items-center gap-1.5">
                                <Mail className="h-3 w-3" strokeWidth={2} />
                                {client.email}
                            </div>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "telephone",
        header: "Téléphone",
        cell: ({ row }) => {
            const telephone = row.getValue("telephone") as string | null;
            return telephone ? (
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-black/40" strokeWidth={2} />
                    <span className="text-[14px]">{telephone}</span>
                </div>
            ) : (
                <span className="text-black/40 text-sm">-</span>
            );
        },
    },
    {
        accessorKey: "ville",
        header: "Localisation",
        cell: ({ row }) => {
            const client = row.original;
            const localisation = client.ville
                ? client.codePostal
                    ? `${client.codePostal} ${client.ville}`
                    : client.ville
                : null;

            return localisation ? (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-black/40" strokeWidth={2} />
                    <span className="text-[14px]">{localisation}</span>
                </div>
            ) : (
                <span className="text-black/40 text-sm">-</span>
            );
        },
    },
    {
        accessorKey: "pays",
        header: "Pays",
        cell: ({ row }) => {
            const pays = row.getValue("pays") as string;
            return (
                <Badge
                    variant="outline"
                    className="bg-black/2 text-black border-black/10"
                >
                    {pays}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Créé le",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as Date;
            return (
                <span className="text-[14px] text-black/60">
                    {format(new Date(date), "dd MMM yyyy", { locale: fr })}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const client = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-black/5"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlers.onView(client)}>
                            <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                            Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlers.onEdit(client)}>
                            <Edit className="mr-2 h-4 w-4" strokeWidth={2} />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handlers.onDelete(client)}
                            className="text-black/80"
                        >
                            <Trash2 className="mr-2 h-4 w-4" strokeWidth={2} />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

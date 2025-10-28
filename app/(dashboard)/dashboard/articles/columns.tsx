"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
    AlertTriangle,
    Edit,
    MoreHorizontal,
    Package,
    Trash2,
} from "lucide-react";

// This type is used to define the shape of our data.
export type Article = {
    id: string;
    reference: string;
    nom: string;
    description: string;
    prix: number;
    stock: number;
    seuilAlerte: number;
    categorie: string;
    statut: "ACTIF" | "INACTIF" | "RUPTURE";
    image?: string;
    tva: number;
};

const stockStatuses = {
    ACTIF: { label: "Actif", variant: "default" as const },
    INACTIF: { label: "Inactif", variant: "secondary" as const },
    RUPTURE: { label: "Rupture", variant: "destructive" as const },
};

export const columns: ColumnDef<Article>[] = [
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
        header: "Article",
        cell: ({ row }) => {
            const article = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {article.image ? (
                            <img
                                src={article.image}
                                alt={article.nom}
                                className="h-8 w-8 rounded object-cover"
                            />
                        ) : (
                            <Package className="h-5 w-5" />
                        )}
                    </div>
                    <div>
                        <div className="font-medium">{article.nom}</div>
                        <div className="text-sm text-muted-foreground">
                            {article.description}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "reference",
        header: "Référence",
        cell: ({ row }) => (
            <div className="font-mono text-sm">{row.getValue("reference")}</div>
        ),
    },
    {
        accessorKey: "categorie",
        header: "Catégorie",
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue("categorie")}</Badge>
        ),
    },
    {
        accessorKey: "prix",
        header: "Prix",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("prix"));
            const formatted = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number;
            const seuilAlerte = row.original.seuilAlerte;
            const isLowStock = stock <= seuilAlerte;

            return (
                <div className="flex items-center gap-2">
                    <span
                        className={`font-medium ${
                            isLowStock ? "text-orange-600" : ""
                        }`}
                    >
                        {stock}
                    </span>
                    {isLowStock && (
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue("statut") as keyof typeof stockStatuses;
            const statusConfig = stockStatuses[status];

            return (
                <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const article = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            Gérer le stock
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

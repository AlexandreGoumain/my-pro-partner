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
import { ARTICLE_STATUSES } from "@/lib/constants/article-statuses";
import { ArticleDisplay } from "@/lib/types/article";
import { ColumnDef } from "@tanstack/react-table";
import {
    AlertTriangle,
    Edit,
    MoreHorizontal,
    Package,
    Trash2,
} from "lucide-react";

export type Article = ArticleDisplay;

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
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        {article.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={article.image}
                                alt={article.nom}
                                className="w-10 h-10 rounded object-cover"
                            />
                        ) : (
                            <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium">{article.nom}</div>
                        <div className="text-sm text-muted-foreground truncate">
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
            <code className="text-sm">{row.getValue("reference")}</code>
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
            const prix = parseFloat(row.getValue("prix"));
            return <div className="font-semibold">{prix.toFixed(2)}€</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number;
            const isLowStock = stock <= row.original.seuilAlerte;

            return (
                <div className="flex items-center gap-2">
                    <span
                        className={
                            isLowStock
                                ? "font-semibold text-orange-600"
                                : "font-semibold"
                        }
                    >
                        {stock}
                    </span>
                    {isLowStock && (
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue("statut") as keyof typeof ARTICLE_STATUSES;
            const statusConfig = ARTICLE_STATUSES[status];

            return (
                <Badge variant={statusConfig.variant}>
                    {statusConfig.shortLabel}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Package className="w-4 h-4 mr-2" />
                        Gérer le stock
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

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
    Copy,
    Edit,
    Eye,
    MoreHorizontal,
    Package,
    Trash2,
} from "lucide-react";

export type Article = ArticleDisplay;

interface ArticleHandlers {
    onView: (article: Article) => void;
    onEdit: (article: Article) => void;
    onDuplicate: (article: Article) => void;
    onDelete: (article: Article) => void;
}

export const createColumns = (
    handlers: ArticleHandlers
): ColumnDef<Article>[] => [
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
                                ? "font-semibold text-black/70"
                                : "font-semibold"
                        }
                    >
                        {stock}
                    </span>
                    {isLowStock && (
                        <AlertTriangle className="w-4 h-4 text-black/60" />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "statut",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue(
                "statut"
            ) as keyof typeof ARTICLE_STATUSES;
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
        cell: ({ row }) => {
            const article = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => handlers.onView(article)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handlers.onEdit(article)}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handlers.onDuplicate(article)}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handlers.onDelete(article)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

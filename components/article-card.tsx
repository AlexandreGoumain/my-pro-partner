"use client";

import { Article } from "@/app/(dashboard)/dashboard/articles/columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getArticleStatusConfig } from "@/lib/constants/article-statuses";
import {
    AlertTriangle,
    Copy,
    Edit,
    Eye,
    MoreHorizontal,
    Package,
    Tag,
    Trash2,
} from "lucide-react";

interface ArticleCardProps {
    article: Article;
    onView?: (article: Article) => void;
    onEdit?: (article: Article) => void;
    onDuplicate?: (article: Article) => void;
    onDelete?: (article: Article) => void;
}

export function ArticleCard({
    article,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
}: ArticleCardProps) {
    const isLowStock = article.stock <= article.seuilAlerte;
    const isOutOfStock = article.statut === "RUPTURE" || article.stock === 0;
    const statusConfig = getArticleStatusConfig(article.statut);

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            <div className="relative aspect-video bg-muted overflow-hidden">
                <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                        src={article.image}
                        alt={article.nom}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <AvatarFallback className="rounded-none bg-muted">
                        <Package className="h-12 w-12 text-muted-foreground/30" />
                    </AvatarFallback>
                </Avatar>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                    <Badge
                        className={`${statusConfig.className} backdrop-blur-sm`}
                    >
                        {statusConfig.label}
                    </Badge>
                </div>

                {/* Stock warning */}
                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 backdrop-blur-sm">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Stock faible
                        </Badge>
                    </div>
                )}

                {/* Quick actions */}
                <div className="absolute bottom-3 inset-x-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 backdrop-blur-md bg-background/80 cursor-pointer"
                        onClick={() => onView?.(article)}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 backdrop-blur-md bg-background/80 cursor-pointer"
                        onClick={() => onEdit?.(article)}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            {article.nom}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Tag className="h-3 w-3" />
                            {article.reference}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView?.(article)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(article)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDuplicate?.(article)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete?.(article)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.categorie}</Badge>
                    <div className="flex items-center gap-1.5 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            Stock:
                        </span>
                        <span
                            className={`font-semibold ${
                                isLowStock ? "text-orange-600" : ""
                            }`}
                        >
                            {article.stock}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t">
                <div className="font-bold text-2xl">
                    {article.prix.toFixed(2)}€
                </div>
                <div className="text-xs text-muted-foreground">
                    TVA {article.tva}% incluse
                </div>
            </div>
        </Card>
    );
}

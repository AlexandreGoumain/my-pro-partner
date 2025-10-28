"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertTriangle,
    Copy,
    Edit,
    Eye,
    MoreHorizontal,
    Package,
    ShoppingCart,
    Tag,
    Trash2,
} from "lucide-react";
import { Article } from "@/app/(dashboard)/dashboard/articles/columns";

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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "ACTIF":
                return {
                    label: "Disponible",
                    variant: "default" as const,
                    className: "bg-green-500/10 text-green-700 border-green-500/20",
                };
            case "INACTIF":
                return {
                    label: "Inactif",
                    variant: "secondary" as const,
                    className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
                };
            case "RUPTURE":
                return {
                    label: "Rupture de stock",
                    variant: "destructive" as const,
                    className: "bg-red-500/10 text-red-700 border-red-500/20",
                };
            default:
                return {
                    label: status,
                    variant: "secondary" as const,
                    className: "",
                };
        }
    };

    const statusConfig = getStatusConfig(article.statut);

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 bg-card">
            {/* Header with Image */}
            <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden bg-muted">
                    {/* Image with zoom effect */}
                    <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                            src={article.image}
                            alt={article.nom}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        />
                        <AvatarFallback className="rounded-none bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                        </AvatarFallback>
                    </Avatar>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                        <Badge
                            className={`${statusConfig.className} backdrop-blur-sm shadow-sm`}
                        >
                            {statusConfig.label}
                        </Badge>
                    </div>

                    {/* Stock warning badge */}
                    {isLowStock && !isOutOfStock && (
                        <div className="absolute top-3 left-3">
                            <Badge
                                variant="outline"
                                className="bg-orange-500/10 text-orange-700 border-orange-500/20 backdrop-blur-sm"
                            >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Stock faible
                            </Badge>
                        </div>
                    )}

                    {/* Quick actions on hover */}
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 backdrop-blur-md bg-background/80 hover:bg-background/90"
                            onClick={() => onView?.(article)}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1 backdrop-blur-md bg-background/80 hover:bg-background/90"
                            onClick={() => onEdit?.(article)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-4 space-y-3">
                {/* Title and actions */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            {article.nom}
                        </CardTitle>
                        <CardDescription className="text-xs font-mono flex items-center gap-1.5">
                            <Tag className="h-3 w-3" />
                            {article.reference}
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
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
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.description}
                </p>

                {/* Category and Stock */}
                <div className="flex items-center justify-between pt-1">
                    <Badge variant="outline" className="font-normal">
                        {article.categorie}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            Stock:
                        </span>
                        <span
                            className={`text-sm font-semibold ${
                                isLowStock
                                    ? "text-orange-600"
                                    : "text-foreground"
                            }`}
                        >
                            {article.stock}
                        </span>
                    </div>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/50 mt-2">
                <div className="space-y-0.5">
                    <p className="text-2xl font-bold text-foreground">
                        {article.prix.toFixed(2)}€
                    </p>
                    <p className="text-xs text-muted-foreground">
                        TVA {article.tva}% incluse
                    </p>
                </div>
                <Button
                    size="sm"
                    className="gap-2"
                    disabled={isOutOfStock}
                    onClick={() => onEdit?.(article)}
                >
                    <ShoppingCart className="h-4 w-4" />
                    {isOutOfStock ? "Rupture" : "Commander"}
                </Button>
            </CardFooter>
        </Card>
    );
}

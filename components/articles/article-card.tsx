"use client";

import { type Article } from "@/lib/types/article";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo } from "react";
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
    Briefcase,
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

export const ArticleCard = memo(function ArticleCard({
    article,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
}: ArticleCardProps) {
    const isLowStock = article.stock <= article.seuilAlerte;
    const isOutOfStock = article.statut === "RUPTURE" || article.stock === 0;
    const statusConfig = getArticleStatusConfig(article.statut);
    const articleType =
        (article as Article & { type?: string }).type || "PRODUIT";
    const isService = articleType === "SERVICE";

    return (
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image */}
            <div className="relative aspect-video bg-black/5 overflow-hidden">
                <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                        src={article.image}
                        alt={article.nom}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <AvatarFallback className="rounded-none bg-black/5">
                        {isService ? (
                            <Briefcase className="h-12 w-12 text-black/40" strokeWidth={2} />
                        ) : (
                            <Package className="h-12 w-12 text-black/40" strokeWidth={2} />
                        )}
                    </AvatarFallback>
                </Avatar>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                    <Badge className="backdrop-blur-sm bg-black/90 text-white border-black/40 text-[12px] h-6 px-3 font-medium">
                        {isService ? (
                            <>
                                <Briefcase className="h-3 w-3 mr-1" strokeWidth={2} />
                                Service
                            </>
                        ) : (
                            <>
                                <Package className="h-3 w-3 mr-1" strokeWidth={2} />
                                Produit
                            </>
                        )}
                    </Badge>
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                    <Badge className={`${statusConfig.className} backdrop-blur-sm text-[12px] h-6 px-3 font-medium`}>
                        {statusConfig.label}
                    </Badge>
                </div>

                {/* Stock warning */}
                {isLowStock && !isOutOfStock && !isService && (
                    <div className="absolute bottom-14 left-3">
                        <Badge className="backdrop-blur-sm bg-black/80 text-white border-black/40 text-[12px] h-6 px-3 font-medium">
                            <AlertTriangle className="h-3 w-3 mr-1" strokeWidth={2} />
                            Stock faible
                        </Badge>
                    </div>
                )}

                {/* Quick actions */}
                <div className="absolute bottom-3 inset-x-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 backdrop-blur-md bg-white/90 hover:bg-white cursor-pointer border-black/10 text-[13px] font-medium h-9"
                        onClick={() => onView?.(article)}
                    >
                        <Eye className="h-4 w-4 mr-2" strokeWidth={2} />
                        Voir
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 backdrop-blur-md bg-white/90 hover:bg-white cursor-pointer border-black/10 text-[13px] font-medium h-9"
                        onClick={() => onEdit?.(article)}
                    >
                        <Edit className="h-4 w-4 mr-2" strokeWidth={2} />
                        Modifier
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-4 space-y-3">
                {/* Header */}
                <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black line-clamp-1 mb-1">
                            {article.nom}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[12px] text-black/60">
                            <Tag className="h-3 w-3" strokeWidth={2} />
                            {article.reference}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer hover:bg-black/5"
                            >
                                <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView?.(article)}>
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                                Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(article)}>
                                <Edit className="mr-2 h-4 w-4" strokeWidth={2} />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate?.(article)}>
                                <Copy className="mr-2 h-4 w-4" strokeWidth={2} />
                                Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete?.(article)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" strokeWidth={2} />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Description */}
                <p className="text-[13px] text-black/70 line-clamp-2">
                    {article.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between">
                    <Badge
                        variant="outline"
                        className="bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium"
                    >
                        {article.categorie}
                    </Badge>
                    {!isService && (
                        <div className="flex items-center gap-1.5">
                            <Package className="h-4 w-4 text-black/40" strokeWidth={2} />
                            <span className="text-[12px] text-black/60">Stock:</span>
                            <span className="text-[13px] font-semibold text-black">
                                {article.stock}
                            </span>
                        </div>
                    )}
                    {isService && (
                        <Badge className="bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium">
                            <Briefcase className="h-3 w-3 mr-1" strokeWidth={2} />
                            Prestation
                        </Badge>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="relative px-4 py-3 border-t border-black/[0.08]">
                <div className="text-[22px] font-bold tracking-[-0.02em] text-black">
                    {article.prix.toFixed(2)}€
                </div>
                <div className="text-[12px] text-black/60">
                    TVA {article.tva}% incluse
                </div>
            </div>
        </Card>
    );
});

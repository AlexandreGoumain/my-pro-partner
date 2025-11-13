import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ArrowLeft,
    Copy,
    Download,
    Edit,
    Eye,
    Archive,
    Share2,
    Trash2,
    MoreVertical,
    Package,
    Briefcase,
} from "lucide-react";
import { ArticleStatusBadge } from "./article-status-badge";

export interface ArticleDetailHeaderProps {
    nom: string;
    reference: string;
    categorie: string;
    type: string;
    statut: string;
    onBack: () => void;
    onDuplicate?: () => void;
    onEdit?: () => void;
    onExport?: () => void;
    onShare?: () => void;
    onToggleStatus?: () => void;
    onDelete?: () => void;
}

export function ArticleDetailHeader({
    nom,
    reference,
    categorie,
    type,
    statut,
    onBack,
    onDuplicate,
    onEdit,
    onExport,
    onShare,
    onToggleStatus,
    onDelete,
}: ArticleDetailHeaderProps) {
    const isService = type === "SERVICE";

    return (
        <div className="flex items-start justify-between">
            <div className="space-y-1">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="gap-2 -ml-2 mb-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour au catalogue
                </Button>
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {nom}
                    </h1>
                    <Badge
                        className={
                            isService
                                ? "bg-purple-500 text-white border-0"
                                : "bg-blue-500 text-white border-0"
                        }
                    >
                        {isService ? (
                            <>
                                <Briefcase className="h-3 w-3 mr-1" />
                                Service
                            </>
                        ) : (
                            <>
                                <Package className="h-3 w-3 mr-1" />
                                Produit
                            </>
                        )}
                    </Badge>
                    <ArticleStatusBadge statut={statut} />
                </div>
                <p className="text-[14px] text-black/60">
                    Réf. {reference} • {categorie}
                </p>
            </div>

            <div className="flex gap-2">
                {onDuplicate && (
                    <Button
                        variant="outline"
                        className="gap-2 border-black/10 hover:bg-black/5"
                        onClick={onDuplicate}
                    >
                        <Copy className="h-4 w-4" />
                        Dupliquer
                    </Button>
                )}
                {onEdit && (
                    <Button
                        variant="outline"
                        className="gap-2 border-black/10 hover:bg-black/5"
                        onClick={onEdit}
                    >
                        <Edit className="h-4 w-4" />
                        Modifier
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-black/10 hover:bg-black/5"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onExport && (
                            <DropdownMenuItem onClick={onExport}>
                                <Download className="h-4 w-4 mr-2" />
                                Exporter les données
                            </DropdownMenuItem>
                        )}
                        {onShare && (
                            <DropdownMenuItem onClick={onShare}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Partager
                            </DropdownMenuItem>
                        )}
                        {onToggleStatus && (
                            <DropdownMenuItem onClick={onToggleStatus}>
                                {statut === "ACTIF" ? (
                                    <>
                                        <Archive className="h-4 w-4 mr-2" />
                                        Désactiver
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Activer
                                    </>
                                )}
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onDelete && (
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={onDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

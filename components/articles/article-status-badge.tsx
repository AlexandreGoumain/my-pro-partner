import { Badge } from "@/components/ui/badge";
import { CheckCircle2, EyeOff, XCircle } from "lucide-react";
import { ArticleStatut } from "@/lib/types/article-detail";

export interface ArticleStatusBadgeProps {
    statut: string;
}

export function ArticleStatusBadge({ statut }: ArticleStatusBadgeProps) {
    switch (statut) {
        case "ACTIF":
            return (
                <Badge className="bg-green-500 gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Actif
                </Badge>
            );
        case "INACTIF":
            return (
                <Badge variant="secondary" className="gap-1.5">
                    <EyeOff className="h-3 w-3" />
                    Inactif
                </Badge>
            );
        case "RUPTURE":
            return (
                <Badge variant="destructive" className="gap-1.5">
                    <XCircle className="h-3 w-3" />
                    Rupture de stock
                </Badge>
            );
        default:
            return <Badge variant="outline">{statut}</Badge>;
    }
}

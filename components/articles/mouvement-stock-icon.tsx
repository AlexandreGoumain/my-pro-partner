import {
    TrendingUp,
    TrendingDown,
    RotateCcw,
    BarChart3,
    Package,
} from "lucide-react";
import { MouvementType } from "@/lib/types/article-detail";

export interface MouvementStockIconProps {
    type: MouvementType | string;
    className?: string;
}

export function MouvementStockIcon({
    type,
    className = "h-4 w-4",
}: MouvementStockIconProps) {
    switch (type) {
        case "ENTREE":
            return <TrendingUp className={`${className} text-green-600`} />;
        case "SORTIE":
            return <TrendingDown className={`${className} text-red-600`} />;
        case "AJUSTEMENT":
            return <RotateCcw className={`${className} text-blue-600`} />;
        case "INVENTAIRE":
            return <BarChart3 className={`${className} text-purple-600`} />;
        case "RETOUR":
            return <RotateCcw className={`${className} text-amber-600`} />;
        default:
            return <Package className={`${className} text-gray-600`} />;
    }
}

export function getMouvementLabel(type: string): string {
    const labels: Record<string, string> = {
        ENTREE: "Entrée",
        SORTIE: "Sortie",
        AJUSTEMENT: "Ajustement",
        INVENTAIRE: "Inventaire",
        RETOUR: "Retour",
    };
    return labels[type] || type;
}

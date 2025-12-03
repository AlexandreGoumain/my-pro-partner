import { Package, RotateCcw, Settings2, Wrench, type LucideIcon } from "lucide-react";
import type { ArticleType } from "@/lib/generated/prisma";

export interface ArticleTab {
    value: string;
    label: string;
    icon: LucideIcon;
    type?: ArticleType;
}

export const ARTICLE_TABS: ArticleTab[] = [
    {
        value: "all",
        label: "Tous",
        icon: Package,
    },
    {
        value: "PRODUIT",
        label: "Produits neufs",
        icon: Package,
        type: "PRODUIT",
    },
    {
        value: "SERVICE",
        label: "Services",
        icon: Settings2,
        type: "SERVICE",
    },
    {
        value: "OCCASION",
        label: "Occasion",
        icon: RotateCcw,
        type: "OCCASION",
    },
    {
        value: "PIECE",
        label: "Pièces détachées",
        icon: Wrench,
        type: "PIECE",
    },
] as const;

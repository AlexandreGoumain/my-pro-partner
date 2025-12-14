import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface GridSkeletonProps {
    /** Nombre d'items à afficher */
    itemCount?: number;
    /** Configuration des colonnes responsive */
    gridColumns?: {
        default?: 1 | 2 | 3 | 4 | 5 | 6;
        sm?: 1 | 2 | 3 | 4 | 5 | 6;
        md?: 1 | 2 | 3 | 4 | 5 | 6;
        lg?: 1 | 2 | 3 | 4 | 5 | 6;
        xl?: 1 | 2 | 3 | 4 | 5 | 6;
        "2xl"?: 1 | 2 | 3 | 4 | 5 | 6;
    };
    /** Espace entre les items */
    gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
    /** Composant skeleton personnalisé pour chaque item */
    itemSkeleton?: ReactNode;
    /** Hauteur par défaut si itemSkeleton n'est pas fourni */
    itemHeight?: string;
    /** Classes CSS additionnelles pour le conteneur */
    className?: string;
}

/**
 * Composant de skeleton générique pour les grilles de chargement
 *
 * Utilisation :
 * ```tsx
 * // Avec un skeleton personnalisé
 * <GridSkeleton
 *   itemCount={8}
 *   gridColumns={{ md: 2, lg: 3, xl: 4 }}
 *   itemSkeleton={<ArticleCardSkeleton />}
 * />
 *
 * // Avec une hauteur par défaut
 * <GridSkeleton
 *   itemCount={6}
 *   gridColumns={{ md: 2, lg: 3 }}
 *   itemHeight="h-[400px]"
 * />
 * ```
 */
export function GridSkeleton({
    itemCount = 6,
    gridColumns = { md: 2, lg: 3 },
    gap = 5,
    itemSkeleton,
    itemHeight = "h-48",
    className,
}: GridSkeletonProps) {
    return (
        <ResponsiveGrid columns={gridColumns} gap={gap} className={className}>
            {Array.from({ length: itemCount }).map((_, i) =>
                itemSkeleton ? (
                    <div key={i}>{itemSkeleton}</div>
                ) : (
                    <Skeleton key={i} className={cn("w-full", itemHeight)} />
                )
            )}
        </ResponsiveGrid>
    );
}

import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface GridSkeletonProps {
    /** Nombre d'items à afficher */
    itemCount?: number;
    /** Configuration des colonnes responsive */
    gridColumns?: {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
    /** Espace entre les items */
    gap?: number;
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

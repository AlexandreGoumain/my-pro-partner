import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ClientTabSkeletonProps {
    variant?: "dashboard" | "profile" | "documents" | "loyalty" | "custom";
    itemCount?: number;
    gridColumns?: 3 | 4;
    blocks?: Array<{ height: string; grid?: boolean; gridColumns?: 3 | 4 }>;
    className?: string;
}

/**
 * Composant de skeleton pour les onglets du portail client
 *
 * Variants disponibles :
 * - "dashboard": Banner + grille de 4 stats
 * - "profile": 3 blocs de hauteurs différentes
 * - "documents": Liste de 3 items
 * - "loyalty": Banner + grille de 3 stats + 2 sections
 * - "custom": Configuration personnalisée avec blocks
 */
export function ClientTabSkeleton({
    variant = "custom",
    itemCount = 3,
    gridColumns = 4,
    blocks = [],
    className,
}: ClientTabSkeletonProps) {
    if (variant === "dashboard") {
        return (
            <div className={cn("space-y-6", className)}>
                <Skeleton className="h-24 w-full" />
                <div className="grid gap-5 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (variant === "profile") {
        return (
            <div className={cn("space-y-6", className)}>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (variant === "documents") {
        return (
            <div className={cn("space-y-3", className)}>
                {Array.from({ length: itemCount }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        );
    }

    if (variant === "loyalty") {
        return (
            <div className={cn("space-y-6", className)}>
                <Skeleton className="h-24 w-full" />
                <div className="grid gap-5 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    // Custom variant
    if (blocks.length > 0) {
        return (
            <div className={cn("space-y-6", className)}>
                {blocks.map((block, i) =>
                    block.grid ? (
                        <div
                            key={i}
                            className={cn(
                                "grid gap-5",
                                block.gridColumns === 3
                                    ? "md:grid-cols-3"
                                    : "md:grid-cols-4"
                            )}
                        >
                            {Array.from({ length: itemCount }).map((_, j) => (
                                <Skeleton
                                    key={j}
                                    className={cn(block.height, "w-full")}
                                />
                            ))}
                        </div>
                    ) : (
                        <Skeleton key={i} className={cn(block.height, "w-full")} />
                    )
                )}
            </div>
        );
    }

    return null;
}

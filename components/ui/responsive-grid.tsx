import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface ResponsiveGridProps {
    children: ReactNode;
    columns?: {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
    gap?: number;
    className?: string;
}

/**
 * Grille responsive réutilisable avec colonnes configurables
 * Unifie tous les patterns de grilles répétitifs dans l'application
 *
 * @example
 * ```tsx
 * <ResponsiveGrid columns={{ md: 2, lg: 3, xl: 4 }} gap={4}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ResponsiveGrid>
 * ```
 */
export function ResponsiveGrid({
    children,
    columns = { md: 2, lg: 3 },
    gap = 4,
    className,
}: ResponsiveGridProps) {
    // Construire les classes de colonnes dynamiquement
    const gridColsClasses: string[] = [];

    if (columns.default) gridColsClasses.push(`grid-cols-${columns.default}`);
    if (columns.sm) gridColsClasses.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) gridColsClasses.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) gridColsClasses.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) gridColsClasses.push(`xl:grid-cols-${columns.xl}`);
    if (columns["2xl"]) gridColsClasses.push(`2xl:grid-cols-${columns["2xl"]}`);

    return (
        <div
            className={cn(
                "grid",
                `gap-${gap}`,
                ...gridColsClasses,
                className
            )}
        >
            {children}
        </div>
    );
}

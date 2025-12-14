import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Mapping explicite pour éviter le purge de Tailwind
// Les classes dynamiques comme `grid-cols-${n}` ne fonctionnent pas en production
const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
};

const smGridColsMap: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
};

const mdGridColsMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
};

const lgGridColsMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
};

const xlGridColsMap: Record<number, string> = {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
};

const xl2GridColsMap: Record<number, string> = {
    1: "2xl:grid-cols-1",
    2: "2xl:grid-cols-2",
    3: "2xl:grid-cols-3",
    4: "2xl:grid-cols-4",
    5: "2xl:grid-cols-5",
    6: "2xl:grid-cols-6",
};

const gapMap: Record<number, string> = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
};

export interface ResponsiveGridProps {
    children: ReactNode;
    columns?: {
        default?: 1 | 2 | 3 | 4 | 5 | 6;
        sm?: 1 | 2 | 3 | 4 | 5 | 6;
        md?: 1 | 2 | 3 | 4 | 5 | 6;
        lg?: 1 | 2 | 3 | 4 | 5 | 6;
        xl?: 1 | 2 | 3 | 4 | 5 | 6;
        "2xl"?: 1 | 2 | 3 | 4 | 5 | 6;
    };
    gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
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
    return (
        <div
            className={cn(
                "grid",
                gapMap[gap],
                columns.default && gridColsMap[columns.default],
                columns.sm && smGridColsMap[columns.sm],
                columns.md && mdGridColsMap[columns.md],
                columns.lg && lgGridColsMap[columns.lg],
                columns.xl && xlGridColsMap[columns.xl],
                columns["2xl"] && xl2GridColsMap[columns["2xl"]],
                className
            )}
        >
            {children}
        </div>
    );
}

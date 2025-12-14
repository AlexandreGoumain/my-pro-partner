import { cn } from "@/lib/utils";
import * as React from "react";
import { EmptyState } from "./empty-state";

// Mapping explicite pour éviter le purge de Tailwind
// Les classes dynamiques comme `grid-cols-${n}` ne fonctionnent pas en production
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

export interface GridProps<T> {
    items: T[];
    columns?: {
        sm?: 1 | 2 | 3 | 4 | 5 | 6;
        md?: 1 | 2 | 3 | 4 | 5 | 6;
        lg?: 1 | 2 | 3 | 4 | 5 | 6;
        xl?: 1 | 2 | 3 | 4 | 5 | 6;
    };
    gap?: "sm" | "md" | "lg";
    renderItem: (item: T, index: number) => React.ReactNode;
    emptyState?: React.ReactNode;
    emptyMessage?: string;
    isLoading?: boolean;
    skeletonCount?: number;
    renderSkeleton?: () => React.ReactNode;
    className?: string;
}

const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-5",
};

export function Grid<T>({
    items,
    columns = { md: 2, lg: 3 },
    gap = "md",
    renderItem,
    emptyState,
    emptyMessage = "Aucun élément trouvé",
    isLoading = false,
    skeletonCount = 6,
    renderSkeleton,
    className,
}: GridProps<T>) {
    const columnClasses = React.useMemo(() => {
        const classes = ["grid-cols-1"];

        if (columns.sm) classes.push(smGridColsMap[columns.sm]);
        if (columns.md) classes.push(mdGridColsMap[columns.md]);
        if (columns.lg) classes.push(lgGridColsMap[columns.lg]);
        if (columns.xl) classes.push(xlGridColsMap[columns.xl]);

        return classes.join(" ");
    }, [columns]);

    // Loading state
    if (isLoading) {
        return (
            <div
                className={cn(
                    "grid",
                    columnClasses,
                    gapClasses[gap],
                    className
                )}
            >
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <div key={i}>
                        {renderSkeleton ? (
                            renderSkeleton()
                        ) : (
                            <div className="h-48 bg-black/5 rounded-lg animate-pulse" />
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (items.length === 0) {
        if (emptyState) {
            return <>{emptyState}</>;
        }
        return <EmptyState title={emptyMessage} variant="inline" />;
    }

    // Grid with items
    return (
        <div className={cn("grid", columnClasses, gapClasses[gap], className)}>
            {items.map((item, index) => (
                <div key={index}>{renderItem(item, index)}</div>
            ))}
        </div>
    );
}

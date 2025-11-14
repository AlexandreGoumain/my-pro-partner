import { cn } from "@/lib/utils";
import * as React from "react";
import { InlineEmptyState } from "./inline-empty-state";

export interface GridProps<T> {
    items: T[];
    columns?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
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

        if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
        if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
        if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
        if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);

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
        return <InlineEmptyState message={emptyMessage} />;
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

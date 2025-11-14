import { cn } from "@/lib/utils";

export interface PageSkeletonProps {
    layout: "grid" | "list" | "dashboard" | "stats";
    headerWithAction?: boolean;
    statsCount?: number;
    gridColumns?: 2 | 3 | 4 | 5;
    itemCount?: number;
    className?: string;
}

export function PageSkeleton({
    layout,
    headerWithAction = true,
    statsCount = 4,
    gridColumns = 3,
    itemCount = 6,
    className,
}: PageSkeletonProps) {
    const gridColumnClasses = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-2 lg:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4",
        5: "md:grid-cols-2 lg:grid-cols-5",
    };

    if (layout === "stats") {
        return (
            <div className={cn("space-y-6", className)}>
                {/* Header */}
                {headerWithAction ? (
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                            <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                        </div>
                        <div className="h-11 w-28 bg-black/5 rounded-md animate-pulse" />
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                        <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                    </div>
                )}

                {/* Stats Grid */}
                <div
                    className={cn(
                        "grid gap-4 grid-cols-1",
                        gridColumnClasses[statsCount as 2 | 3 | 4 | 5] ||
                            gridColumnClasses[4]
                    )}
                >
                    {Array.from({ length: statsCount }).map((_, i) => (
                        <div
                            key={i}
                            className="h-32 bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (layout === "grid") {
        return (
            <div className={cn("space-y-6", className)}>
                {/* Header */}
                {headerWithAction ? (
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                            <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                        </div>
                        <div className="h-11 w-28 bg-black/5 rounded-md animate-pulse" />
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                        <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                    </div>
                )}

                {/* Grid Items */}
                <div
                    className={cn(
                        "grid gap-5 grid-cols-1",
                        gridColumnClasses[gridColumns]
                    )}
                >
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div
                            key={i}
                            className="h-48 bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (layout === "list") {
        return (
            <div className={cn("space-y-6", className)}>
                {/* Header */}
                {headerWithAction ? (
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                            <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                        </div>
                        <div className="h-11 w-28 bg-black/5 rounded-md animate-pulse" />
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                        <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                    </div>
                )}

                {/* List Items */}
                <div className="space-y-3">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div
                            key={i}
                            className="h-20 bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (layout === "dashboard") {
        return (
            <div className={cn("space-y-6", className)}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="h-9 w-60 bg-black/5 rounded-md animate-pulse" />
                        <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                    </div>
                    <div className="h-11 w-28 bg-black/5 rounded-md animate-pulse" />
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-32 bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                    <div className="h-96 bg-black/5 rounded-lg animate-pulse" />
                    <div className="h-96 bg-black/5 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    return null;
}

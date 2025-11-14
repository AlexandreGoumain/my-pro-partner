import { cn } from "@/lib/utils";

export interface PageSkeletonProps {
    layout:
        | "grid"
        | "list"
        | "dashboard"
        | "stats"
        | "stats-grid"
        | "form"
        | "table";
    headerWithAction?: boolean;
    headerActionsCount?: 1 | 2 | 3;
    statsCount?: number;
    gridColumns?: 2 | 3 | 4 | 5;
    itemCount?: number;
    itemHeight?: string;
    statsHeight?: string;
    withTabs?: boolean;
    tabsCount?: number;
    formSections?: number;
    className?: string;
}

/**
 * Composant de skeleton de chargement pour les pages
 *
 * Layouts disponibles :
 * - "stats": Header + grid de stats uniquement
 * - "stats-grid": Header + stats + grid d'items (stores, articles, etc.)
 * - "grid": Header + grid d'items
 * - "list": Header + liste d'items
 * - "table": Header + tableau
 * - "form": Header + tabs + formulaire (settings, etc.)
 * - "dashboard": Header + stats + content area
 */
export function PageSkeleton({
    layout,
    headerWithAction = true,
    headerActionsCount = 1,
    statsCount = 4,
    gridColumns = 3,
    itemCount = 6,
    itemHeight = "h-48",
    statsHeight = "h-32",
    withTabs = false,
    tabsCount = 4,
    formSections = 2,
    className,
}: PageSkeletonProps) {
    const gridColumnClasses = {
        2: "md:grid-cols-2",
        3: "md:grid-cols-2 lg:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-4",
        5: "md:grid-cols-2 lg:grid-cols-5",
    };

    // Composant réutilisable pour le header
    const Header = () => (
        <>
            {headerWithAction ? (
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="h-9 w-48 bg-black/5 rounded-md animate-pulse" />
                        <div className="h-5 w-64 bg-black/5 rounded-md animate-pulse" />
                    </div>
                    <div className="flex gap-3">
                        {Array.from({ length: headerActionsCount }).map(
                            (_, i) => (
                                <div
                                    key={i}
                                    className="h-11 w-36 bg-black/5 rounded-md animate-pulse"
                                />
                            )
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-1">
                    <div className="h-9 w-48 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-5 w-64 bg-black/5 rounded-md animate-pulse" />
                </div>
            )}
        </>
    );

    // Composant réutilisable pour la grille de stats
    const StatsGrid = () => (
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
                    className={cn(
                        "bg-black/5 rounded-lg animate-pulse",
                        statsHeight
                    )}
                />
            ))}
        </div>
    );

    // Composant réutilisable pour les tabs
    const Tabs = () => (
        <div className="flex items-center gap-2 border-b border-black/8">
            {Array.from({ length: tabsCount }).map((_, i) => (
                <div
                    key={i}
                    className="h-10 w-24 bg-black/5 rounded-none rounded-t-md animate-pulse"
                />
            ))}
        </div>
    );

    if (layout === "stats") {
        return (
            <div className={cn("space-y-6", className)}>
                <Header />
                <StatsGrid />
            </div>
        );
    }

    if (layout === "stats-grid") {
        return (
            <div className={cn("space-y-6", className)}>
                <Header />
                <StatsGrid />
                <div
                    className={cn(
                        "grid gap-5 grid-cols-1",
                        gridColumnClasses[gridColumns]
                    )}
                >
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "bg-black/5 rounded-lg animate-pulse",
                                itemHeight
                            )}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (layout === "grid") {
        return (
            <div className={cn("space-y-6", className)}>
                <Header />
                <div
                    className={cn(
                        "grid gap-5 grid-cols-1",
                        gridColumnClasses[gridColumns]
                    )}
                >
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "bg-black/5 rounded-lg animate-pulse",
                                itemHeight
                            )}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (layout === "list") {
        return (
            <div className={cn("space-y-6", className)}>
                <Header />
                <div className="space-y-3">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "bg-black/5 rounded-lg animate-pulse",
                                itemHeight
                            )}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (layout === "table") {
        return (
            <div className={cn("space-y-6", className)}>
                <Header />
                {/* Table header */}
                <div className="border border-black/8 rounded-lg overflow-hidden">
                    <div className="h-12 bg-black/5 border-b border-black/8 animate-pulse" />
                    {/* Table rows */}
                    <div className="divide-y divide-black/8">
                        {Array.from({ length: itemCount }).map((_, i) => (
                            <div
                                key={i}
                                className="h-16 bg-black/5 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (layout === "form") {
        return (
            <div className={cn("space-y-8", className)}>
                {/* Header centré pour les formulaires */}
                <div className="text-center space-y-1">
                    <div className="h-9 w-48 mx-auto bg-black/5 rounded-md animate-pulse" />
                    <div className="h-5 w-64 mx-auto bg-black/5 rounded-md animate-pulse" />
                </div>

                <div className="space-y-6">
                    {withTabs && <Tabs />}

                    {/* Form sections */}
                    <div className="space-y-8 mt-6">
                        {Array.from({ length: formSections }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="h-6 w-48 bg-black/5 rounded-md animate-pulse" />
                                <div className="h-4 w-96 bg-black/5 rounded-md animate-pulse" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {Array.from({
                                        length: i === 0 ? 4 : 2,
                                    }).map((_, j) => (
                                        <div key={j} className="space-y-2">
                                            <div className="h-4 w-32 bg-black/5 rounded-md animate-pulse" />
                                            <div className="h-11 w-full bg-black/5 rounded-md animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Save button */}
                    <div className="h-11 w-32 bg-black/5 rounded-md animate-pulse" />
                </div>
            </div>
        );
    }

    if (layout === "dashboard") {
        return (
            <div className={cn("space-y-6", className)}>
                <Header />
                <StatsGrid />
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

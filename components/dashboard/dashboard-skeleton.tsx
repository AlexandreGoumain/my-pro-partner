import { Card } from "@/components/ui/card";

// ============================================================================
// Skeleton Components
// ============================================================================

function SkeletonPulse({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-black/[0.06] rounded ${className || ""}`} />
    );
}

function CardSkeleton({ className }: { className?: string }) {
    return (
        <Card className={`p-6 bg-white border-black/[0.08] ${className || ""}`}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <SkeletonPulse className="h-4 w-24" />
                    <SkeletonPulse className="h-6 w-12 rounded-full" />
                </div>
                <SkeletonPulse className="h-10 w-32" />
                <SkeletonPulse className="h-16 w-full" />
                <div className="grid grid-cols-2 gap-4">
                    <SkeletonPulse className="h-8 w-full" />
                    <SkeletonPulse className="h-8 w-full" />
                </div>
            </div>
        </Card>
    );
}

function MetricCardSkeleton() {
    return (
        <Card className="p-6 bg-white border-black/[0.08]">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SkeletonPulse className="h-4 w-4" />
                        <SkeletonPulse className="h-3 w-20" />
                    </div>
                    <SkeletonPulse className="h-6 w-12 rounded-full" />
                </div>
                <SkeletonPulse className="h-9 w-24" />
                <SkeletonPulse className="h-3 w-32" />
            </div>
        </Card>
    );
}

function ListCardSkeleton() {
    return (
        <Card className="p-6 bg-white border-black/[0.08]">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <SkeletonPulse className="h-4 w-4" />
                    <SkeletonPulse className="h-4 w-32" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <SkeletonPulse className="h-8 w-8 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <SkeletonPulse className="h-3 w-3/4" />
                                <SkeletonPulse className="h-2 w-1/2" />
                            </div>
                            <SkeletonPulse className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}

// ============================================================================
// Main Skeleton Component
// ============================================================================

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <SkeletonPulse className="h-8 w-48" />
                    <SkeletonPulse className="h-4 w-32" />
                </div>
                <SkeletonPulse className="h-10 w-32 rounded-md" />
            </div>

            {/* Section 1: Hero */}
            <div className="grid gap-5 lg:grid-cols-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>

            {/* Section 2: KPIs Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
            </div>

            {/* Section 3: Analytics */}
            <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-5">
                    <CardSkeleton />
                    <ListCardSkeleton />
                </div>
                <div className="space-y-5">
                    <CardSkeleton />
                    <ListCardSkeleton />
                </div>
            </div>

            {/* Section 4: Actions & Activity */}
            <div className="grid gap-5 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-5">
                    <ListCardSkeleton />
                    <CardSkeleton />
                </div>
                <div className="lg:col-span-2">
                    <ListCardSkeleton />
                </div>
            </div>
        </div>
    );
}

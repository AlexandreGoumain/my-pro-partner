import { Skeleton } from "@/components/ui/skeleton";

export function SegmentCardSkeleton() {
    return (
        <div className="p-6 border border-black/8 shadow-sm rounded-lg bg-white space-y-4">
            <div className="flex items-start justify-between">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex gap-2">
                <Skeleton className="h-9 flex-1 rounded" />
                <Skeleton className="h-9 flex-1 rounded" />
            </div>
        </div>
    );
}

export function SegmentCardSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <SegmentCardSkeleton key={i} />
            ))}
        </div>
    );
}

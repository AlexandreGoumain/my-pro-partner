import { Skeleton } from "@/components/ui/skeleton";

export function DocumentsLoadingSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
            ))}
        </div>
    );
}

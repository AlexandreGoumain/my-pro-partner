import { PageSkeleton } from "@/components/ui/page-skeleton";

export interface DocumentDetailSkeletonProps {
    title: string;
}

/**
 * Reusable loading skeleton for document detail pages
 */
export function DocumentDetailSkeleton({ title }: DocumentDetailSkeletonProps) {
    return (
        <PageSkeleton
            layout="stats-grid"
            statsCount={3}
            itemCount={2}
            statsHeight="h-24"
            itemHeight="h-96"
        />
    );
}

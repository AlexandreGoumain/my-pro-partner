import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";

export interface DocumentDetailSkeletonProps {
    title: string;
}

/**
 * Reusable loading skeleton for document detail pages
 */
export function DocumentDetailSkeleton({ title }: DocumentDetailSkeletonProps) {
    return (
        <div className="space-y-6">
            <PageHeader title={title} description="Chargement..." />
            <LoadingState variant="card" />
        </div>
    );
}

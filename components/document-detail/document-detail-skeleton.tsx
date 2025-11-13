import { Card } from "@/components/ui/card";
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
            <Card className="p-12 border-black/8 shadow-sm">
                <div className="flex items-center justify-center">
                    <div className="text-[14px] text-black/40">Chargement...</div>
                </div>
            </Card>
        </div>
    );
}

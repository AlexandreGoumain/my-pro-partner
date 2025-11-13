import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";

export function SettingsPageSkeleton() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <PageHeader
                    title="Paramètres"
                    description="Configurez votre entreprise"
                />
            </div>

            <div className="space-y-6">
                {/* Tabs skeleton */}
                <div className="flex items-center gap-2 border-b border-black/8">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton
                            key={i}
                            className="h-10 w-24 rounded-none rounded-t-md"
                        />
                    ))}
                </div>

                {/* Content skeleton */}
                <div className="space-y-8 mt-6">
                    {/* Section 1 */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-96" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-11 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-96" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-11 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Save button skeleton */}
                <Skeleton className="h-11 w-32" />
            </div>
        </div>
    );
}

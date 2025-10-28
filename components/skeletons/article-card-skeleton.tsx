import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
    return (
        <Card className="overflow-hidden border-border/50">
            {/* Image skeleton */}
            <CardHeader className="p-0">
                <Skeleton className="aspect-video w-full" />
            </CardHeader>

            {/* Content skeleton */}
            <CardContent className="p-4 space-y-3">
                {/* Title and reference */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>

                {/* Category and stock */}
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </CardContent>

            {/* Footer skeleton */}
            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/50">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-9 w-28 rounded-md" />
            </CardFooter>
        </Card>
    );
}

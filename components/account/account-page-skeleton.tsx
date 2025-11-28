import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountPageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black/2 to-black/5">
            {/* Header Skeleton */}
            <div className="border-b border-black/10 bg-white/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {/* Profile Card Skeleton */}
                <Card className="border-black/10 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-3 w-64" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-11 w-full" />
                        </div>
                        X
                        <Skeleton className="h-11 w-48" />
                    </CardContent>
                </Card>

                {/* Security Card Skeleton */}
                <Card className="border-black/10 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-56" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-11 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-11 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-52" />
                            <Skeleton className="h-11 w-full" />
                        </div>
                        <Skeleton className="h-11 w-48" />
                    </CardContent>
                </Card>

                {/* Notifications Card Skeleton */}
                <Card className="border-black/10 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-72" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-64" />
                            </div>
                            <Skeleton className="h-6 w-11 rounded-full" />
                        </div>
                        <Separator className="bg-black/10" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-56" />
                            </div>
                            <Skeleton className="h-6 w-11 rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { Card } from "@/components/ui/card";

export function ClientDetailLoading() {
    return (
        <div className="space-y-6">
            <div className="h-10 w-64 bg-black/5 rounded animate-pulse" />
            <Card className="p-8 border-black/8 shadow-sm">
                <div className="space-y-4">
                    <div className="h-8 w-full bg-black/5 rounded animate-pulse" />
                    <div className="h-8 w-3/4 bg-black/5 rounded animate-pulse" />
                    <div className="h-8 w-1/2 bg-black/5 rounded animate-pulse" />
                </div>
            </Card>
        </div>
    );
}

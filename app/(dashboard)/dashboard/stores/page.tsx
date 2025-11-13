"use client";

import {
    StorePageActions,
    StoreStatsGrid,
    StoresGrid,
} from "@/components/stores";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoresPage } from "@/hooks/use-stores-page";
import { Store } from "lucide-react";
import { Suspense } from "react";

function StoresPageContent() {
    const handlers = useStoresPage();

    if (handlers.isLoading) {
        return <StoresPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Magasins"
                description="Gérez vos points de vente"
                actions={
                    <StorePageActions
                        onCreateStore={handlers.handleCreateWithLimitCheck}
                    />
                }
            />

            <StoreStatsGrid
                total={handlers.stats.total}
                active={handlers.stats.active}
                inactive={handlers.stats.inactive}
                totalRegisters={handlers.stats.totalRegisters}
            />

            {handlers.displayStores.length === 0 ? (
                <EmptyState
                    icon={Store}
                    title="Aucun magasin"
                    description="Créez votre premier point de vente pour commencer à gérer vos magasins"
                    action={{
                        label: "Créer un magasin",
                        onClick: handlers.handleCreateWithLimitCheck,
                    }}
                />
            ) : (
                <StoresGrid
                    stores={handlers.displayStores}
                    onEdit={handlers.handleEdit}
                />
            )}
        </div>
    );
}

function StoresPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-11 w-48" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[120px]" />
                ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-[240px]" />
                ))}
            </div>
        </div>
    );
}

export default function StoresPage() {
    return (
        <Suspense fallback={<StoresPageSkeleton />}>
            <StoresPageContent />
        </Suspense>
    );
}

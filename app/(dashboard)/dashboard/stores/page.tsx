"use client";

import {
    StorePageActions,
    StoreStatsGrid,
    StoresGrid,
} from "@/components/stores";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useStoresPage } from "@/hooks/use-stores-page";
import { Store } from "lucide-react";
import { Suspense } from "react";

function StoresPageContent() {
    const handlers = useStoresPage();

    if (handlers.isLoading) {
        return (
            <PageSkeleton
                layout="stats-grid"
                statsCount={4}
                gridColumns={3}
                itemCount={6}
                statsHeight="h-[120px]"
                itemHeight="h-[240px]"
            />
        );
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

export default function StoresPage() {
    return (
        <Suspense
            fallback={
                <PageSkeleton
                    layout="stats-grid"
                    statsCount={4}
                    gridColumns={3}
                    itemCount={6}
                    statsHeight="h-[120px]"
                    itemHeight="h-[240px]"
                />
            }
        >
            <StoresPageContent />
        </Suspense>
    );
}

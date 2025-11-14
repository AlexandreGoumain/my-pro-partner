"use client";

import { AutomationBuilderDialog } from "@/components/automation-builder-dialog";
import { AutomationStats, AutomationsList } from "@/components/automations";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { useAutomationsPage } from "@/hooks/use-automations-page";
import { Plus } from "lucide-react";

export default function AutomationsPage() {
    const {
        automations,
        isLoading,
        builderOpen,
        setBuilderOpen,
        editingAutomation,
        stats,
        handleToggle,
        handleDelete,
        handleEdit,
        handleCreate,
    } = useAutomationsPage();

    if (isLoading) {
        return (
            <PageSkeleton
                layout="stats-grid"
                statsCount={4}
                itemCount={5}
                statsHeight="h-24"
                itemHeight="h-32"
            />
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Automations"
                description="Configurez des règles automatiques pour vos segments"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Nouvelle automation
                    </PrimaryActionButton>
                }
            />

            {/* Stats */}
            <AutomationStats
                total={stats.total}
                active={stats.active}
                inactive={stats.inactive}
                totalExecutions={stats.totalExecutions}
            />

            {/* Automations List */}
            <AutomationsList
                automations={automations}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
            />

            {/* Automation Builder Dialog */}
            <AutomationBuilderDialog
                open={builderOpen}
                onOpenChange={setBuilderOpen}
                automation={editingAutomation}
            />
        </div>
    );
}

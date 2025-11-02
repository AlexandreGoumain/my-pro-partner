"use client";

import { AutomationBuilderDialog } from "@/components/automation-builder-dialog";
import { AutomationStats, AutomationsList } from "@/components/automations";
import { Button } from "@/components/ui/button";
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
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-[14px] text-black/40">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Automations
                    </h1>
                    <p className="text-[14px] text-black/60 mt-1">
                        Configurez des règles automatiques pour vos segments
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                >
                    <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                    Nouvelle automation
                </Button>
            </div>

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

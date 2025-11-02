import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
    useAutomations,
    useDeleteAutomation,
    useToggleAutomation,
    type Automation,
} from "@/hooks/use-automations";

export interface AutomationsPageHandlers {
    automations: Automation[];
    isLoading: boolean;
    builderOpen: boolean;
    setBuilderOpen: (open: boolean) => void;
    editingAutomation: Automation | null;
    setEditingAutomation: (automation: Automation | null) => void;

    stats: {
        total: number;
        active: number;
        inactive: number;
        totalExecutions: number;
    };

    handleToggle: (id: string, currentState: boolean) => Promise<void>;
    handleDelete: (id: string, nom: string) => Promise<void>;
    handleEdit: (automation: Automation) => void;
    handleCreate: () => void;
}

export function useAutomationsPage(): AutomationsPageHandlers {
    const [builderOpen, setBuilderOpen] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

    const { data, isLoading } = useAutomations();
    const deleteAutomation = useDeleteAutomation();
    const toggleAutomation = useToggleAutomation();

    const automations = data?.data || [];

    const stats = useMemo(
        () => ({
            total: automations.length,
            active: automations.filter((a) => a.actif).length,
            inactive: automations.filter((a) => !a.actif).length,
            totalExecutions: automations.reduce(
                (sum, a) => sum + a.nombreExecutions,
                0
            ),
        }),
        [automations]
    );

    const handleToggle = async (id: string, currentState: boolean) => {
        try {
            await toggleAutomation.mutateAsync({ id, actif: !currentState });
            toast.success(
                currentState ? "Automation désactivée" : "Automation activée"
            );
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la modification";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id: string, nom: string) => {
        if (!confirm(`Supprimer l'automation "${nom}" ?`)) return;

        try {
            await deleteAutomation.mutateAsync(id);
            toast.success("Automation supprimée");
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la suppression";
            toast.error(errorMessage);
        }
    };

    const handleEdit = (automation: Automation) => {
        setEditingAutomation(automation);
        setBuilderOpen(true);
    };

    const handleCreate = () => {
        setEditingAutomation(null);
        setBuilderOpen(true);
    };

    return {
        automations,
        isLoading,
        builderOpen,
        setBuilderOpen,
        editingAutomation,
        setEditingAutomation,
        stats,
        handleToggle,
        handleDelete,
        handleEdit,
        handleCreate,
    };
}

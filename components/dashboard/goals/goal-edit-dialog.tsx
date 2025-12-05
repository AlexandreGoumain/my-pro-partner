"use client";

import { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GoalList } from "./goal-list";
import { GoalForm } from "./goal-form";
import {
    useGoals,
    useCreateGoal,
    useUpdateGoal,
    useDeleteGoal,
    useToggleGoal,
} from "@/hooks/use-goals";
import type { GoalWithProgress, CreateGoalInput } from "@/lib/types/goals";
import { Plus, ChevronLeft, Loader2, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// ============================================================================
// Types
// ============================================================================

export interface GoalEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ViewMode = "list" | "create" | "edit";

// ============================================================================
// Component
// ============================================================================

export function GoalEditDialog({ open, onOpenChange }: GoalEditDialogProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [editingGoal, setEditingGoal] = useState<GoalWithProgress | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | undefined>(undefined);

    // Queries & Mutations
    const { data: goals = [], isLoading } = useGoals();
    const createGoal = useCreateGoal();
    const updateGoal = useUpdateGoal();
    const deleteGoal = useDeleteGoal();
    const toggleGoal = useToggleGoal();

    // Calculate stats
    const stats = useMemo(() => {
        const enabledGoals = goals.filter(g => g.enabled);
        const onTrackGoals = enabledGoals.filter(g => g.onTrack);
        const avgProgress = enabledGoals.length > 0
            ? Math.round(enabledGoals.reduce((sum, g) => sum + g.progress, 0) / enabledGoals.length)
            : 0;
        return {
            total: goals.length,
            enabled: enabledGoals.length,
            onTrack: onTrackGoals.length,
            avgProgress,
        };
    }, [goals]);

    // Reset state when dialog closes
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setTimeout(() => {
                setViewMode("list");
                setEditingGoal(null);
                setDeleteConfirmId(null);
            }, 150);
        }
        onOpenChange(isOpen);
    };

    // Handle create
    const handleCreate = async (data: CreateGoalInput) => {
        try {
            await createGoal.mutateAsync(data);
            toast.success("Objectif créé");
            setViewMode("list");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Erreur lors de la création"
            );
        }
    };

    // Handle update
    const handleUpdate = async (data: CreateGoalInput) => {
        if (!editingGoal) return;

        try {
            await updateGoal.mutateAsync({ id: editingGoal.id, data });
            toast.success("Objectif modifié");
            setEditingGoal(null);
            setViewMode("list");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Erreur lors de la modification"
            );
        }
    };

    // Handle toggle
    const handleToggle = async (id: string, enabled: boolean) => {
        setTogglingId(id);
        try {
            await toggleGoal.mutateAsync({ id, enabled });
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Erreur"
            );
        } finally {
            setTogglingId(undefined);
        }
    };

    // Handle edit
    const handleEdit = (goal: GoalWithProgress) => {
        setEditingGoal(goal);
        setViewMode("edit");
    };

    // Handle delete
    const handleDeleteConfirm = async () => {
        if (!deleteConfirmId) return;

        try {
            await deleteGoal.mutateAsync(deleteConfirmId);
            toast.success("Objectif supprimé");
            setDeleteConfirmId(null);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Erreur lors de la suppression"
            );
        }
    };

    // Handle back
    const handleBack = () => {
        setViewMode("list");
        setEditingGoal(null);
    };

    const isFormView = viewMode === "create" || viewMode === "edit";

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
                    {/* Header */}
                    <div className="relative">
                        {/* Background pattern for list view */}
                        {viewMode === "list" && (
                            <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-transparent" />
                        )}

                        <div className="relative px-6 pt-6 pb-5 pr-14">
                            <div className="flex items-start gap-3">
                                {isFormView && (
                                    <button
                                        onClick={handleBack}
                                        className="w-8 h-8 mt-0.5 -ml-1 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-black/60" />
                                    </button>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                                        {viewMode === "list" && "Objectifs"}
                                        {viewMode === "create" && "Nouvel objectif"}
                                        {viewMode === "edit" && "Modifier l'objectif"}
                                    </h2>
                                    <p className="text-[14px] text-black/50 mt-1 pr-2">
                                        {viewMode === "list" && "Suivez vos performances et atteignez vos cibles"}
                                        {viewMode === "create" && "Définissez un nouvel objectif à suivre"}
                                        {viewMode === "edit" && editingGoal?.label}
                                    </p>
                                </div>
                            </div>

                            {/* Add button - positioned below header on list view */}
                            {viewMode === "list" && (
                                <div className="mt-4">
                                    <Button
                                        onClick={() => setViewMode("create")}
                                        size="sm"
                                        className="h-9 px-4 bg-black hover:bg-black/90 text-[13px] font-medium shadow-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1.5" />
                                        Ajouter un objectif
                                    </Button>
                                </div>
                            )}

                            {/* Stats bar - only show when there are goals */}
                            {viewMode === "list" && goals.length > 0 && !isLoading && (
                                <div className="flex items-center gap-6 mt-5 pt-5 border-t border-black/[0.06]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center">
                                            <Target className="w-4 h-4 text-black/40" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-black/40 uppercase tracking-wide font-medium">Actifs</p>
                                            <p className="text-[15px] font-semibold text-black">{stats.enabled}<span className="text-black/30 font-normal">/{stats.total}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-black/40" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-black/40 uppercase tracking-wide font-medium">Sur la bonne voie</p>
                                            <p className="text-[15px] font-semibold text-black">{stats.onTrack}<span className="text-black/30 font-normal">/{stats.enabled}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-black/40" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-black/40 uppercase tracking-wide font-medium">Progression</p>
                                            <p className="text-[15px] font-semibold text-black">{stats.avgProgress}%</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-black/[0.06]" />

                    {/* Content */}
                    <div className="p-6 max-h-[55vh] overflow-y-auto bg-black/[0.015]">
                        {isLoading && viewMode === "list" ? (
                            <div className="py-16 flex flex-col items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-black/20" />
                            </div>
                        ) : viewMode === "list" ? (
                            goals.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-white border border-black/[0.06] shadow-sm flex items-center justify-center mb-5">
                                        <Target className="w-7 h-7 text-black/30" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-[16px] font-semibold text-black mb-2">
                                        Créez votre premier objectif
                                    </h3>
                                    <p className="text-[14px] text-black/50 max-w-[280px] mb-6">
                                        Définissez des objectifs de performance pour suivre votre progression et atteindre vos cibles.
                                    </p>
                                    <Button
                                        onClick={() => setViewMode("create")}
                                        className="h-10 px-5 bg-black hover:bg-black/90 text-[14px] font-medium shadow-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Créer un objectif
                                    </Button>
                                </div>
                            ) : (
                                <GoalList
                                    goals={goals}
                                    onToggle={handleToggle}
                                    onEdit={handleEdit}
                                    onDelete={(id) => setDeleteConfirmId(id)}
                                    togglingId={togglingId}
                                />
                            )
                        ) : viewMode === "create" ? (
                            <div className="bg-white rounded-xl border border-black/[0.06] p-5">
                                <GoalForm
                                    onSubmit={handleCreate}
                                    onCancel={handleBack}
                                    isLoading={createGoal.isPending}
                                />
                            </div>
                        ) : viewMode === "edit" && editingGoal ? (
                            <div className="bg-white rounded-xl border border-black/[0.06] p-5">
                                <GoalForm
                                    goal={editingGoal}
                                    onSubmit={handleUpdate}
                                    onCancel={handleBack}
                                    isLoading={updateGoal.isPending}
                                />
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog
                open={!!deleteConfirmId}
                onOpenChange={(open) => !open && setDeleteConfirmId(null)}
            >
                <AlertDialogContent className="sm:max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[16px]">
                            Supprimer cet objectif ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[14px]">
                            Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-2">
                        <AlertDialogCancel className="h-10 px-4 border-black/10 text-[14px]">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="h-10 px-4 bg-black hover:bg-black/90 text-[14px]"
                        >
                            {deleteGoal.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Supprimer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

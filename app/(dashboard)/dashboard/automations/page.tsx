"use client";

import { AutomationBuilderDialog } from "@/components/automation-builder-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
    useAutomations,
    useDeleteAutomation,
    useToggleAutomation,
} from "@/hooks/use-automations";
import {
    ArrowRight,
    Edit,
    MoreVertical,
    Pause,
    Play,
    Plus,
    Trash2,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const triggerTypeLabels: Record<string, string> = {
    NEW_CLIENT_IN_SEGMENT: "Nouveau client dans segment",
    CLIENT_MILESTONE: "Jalon client",
    SEGMENT_CHANGE: "Changement de segment",
    INACTIVITY: "Inactivité",
    SCHEDULED: "Planifié",
};

const actionTypeLabels: Record<string, string> = {
    SEND_EMAIL: "Envoyer email",
    ADD_TO_SEGMENT: "Ajouter au segment",
    REMOVE_FROM_SEGMENT: "Retirer du segment",
    ADD_POINTS: "Ajouter des points",
    SEND_SMS: "Envoyer SMS",
    CREATE_TASK: "Créer une tâche",
};

export default function AutomationsPage() {
    const [builderOpen, setBuilderOpen] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState<any>(null);

    const { data, isLoading } = useAutomations();
    const deleteAutomation = useDeleteAutomation();
    const toggleAutomation = useToggleAutomation();

    const automations = data?.data || [];

    const handleToggle = async (id: string, currentState: boolean) => {
        try {
            await toggleAutomation.mutateAsync({ id, actif: !currentState });
            toast.success(
                currentState ? "Automation désactivée" : "Automation activée"
            );
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la modification");
        }
    };

    const handleDelete = async (id: string, nom: string) => {
        if (!confirm(`Supprimer l'automation "${nom}" ?`)) return;

        try {
            await deleteAutomation.mutateAsync(id);
            toast.success("Automation supprimée");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la suppression");
        }
    };

    const handleEdit = (automation: any) => {
        setEditingAutomation(automation);
        setBuilderOpen(true);
    };

    const handleCreate = () => {
        setEditingAutomation(null);
        setBuilderOpen(true);
    };

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Total
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {automations.length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                                <Zap
                                    className="h-6 w-6 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Actives
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {automations.filter((a) => a.actif).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-green-500/10 flex items-center justify-center">
                                <Play
                                    className="h-6 w-6 text-green-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Inactives
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {automations.filter((a) => !a.actif).length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                                <Pause
                                    className="h-6 w-6 text-black/40"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[13px] text-black/60 mb-1">
                                    Exécutions
                                </p>
                                <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                    {automations.reduce(
                                        (sum, a) => sum + a.nombreExecutions,
                                        0
                                    )}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-md bg-black/5 flex items-center justify-center">
                                <ArrowRight
                                    className="h-6 w-6 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Automations List */}
            {automations.length === 0 ? (
                <Card className="border-black/10 shadow-sm">
                    <CardContent className="p-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-black/5 mx-auto mb-4 flex items-center justify-center">
                            <Zap
                                className="h-8 w-8 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <h3 className="text-[16px] font-medium text-black mb-2">
                            Aucune automation
                        </h3>
                        <p className="text-[14px] text-black/60 mb-6 max-w-md mx-auto">
                            Créez votre première automation pour automatiser vos
                            actions marketing
                        </p>
                        <Button
                            onClick={handleCreate}
                            className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                            Créer une automation
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {automations.map((automation) => (
                        <Card
                            key={automation.id}
                            className="border-black/10 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Switch
                                            checked={automation.actif}
                                            onCheckedChange={() =>
                                                handleToggle(
                                                    automation.id,
                                                    automation.actif
                                                )
                                            }
                                            className="data-[state=checked]:bg-black"
                                        />

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-[15px] font-medium text-black">
                                                    {automation.nom}
                                                </h3>
                                                {automation.actif ? (
                                                    <Badge className="bg-green-500/10 text-green-700 border-0 text-[12px] font-medium">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-black/5 text-black/60 border-0 text-[12px] font-medium">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>

                                            {automation.description && (
                                                <p className="text-[13px] text-black/60 mb-3">
                                                    {automation.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-6 text-[13px] text-black/60">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-black/80">
                                                        Déclencheur:
                                                    </span>
                                                    <span>
                                                        {triggerTypeLabels[
                                                            automation
                                                                .triggerType
                                                        ] ||
                                                            automation.triggerType}
                                                    </span>
                                                </div>

                                                <div className="h-4 w-px bg-black/10" />

                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-black/80">
                                                        Action:
                                                    </span>
                                                    <span>
                                                        {actionTypeLabels[
                                                            automation
                                                                .actionType
                                                        ] ||
                                                            automation.actionType}
                                                    </span>
                                                </div>

                                                <div className="h-4 w-px bg-black/10" />

                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-black/80">
                                                        Exécutions:
                                                    </span>
                                                    <span>
                                                        {
                                                            automation.nombreExecutions
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9 border-black/10 hover:bg-black/5"
                                            >
                                                <MoreVertical
                                                    className="h-4 w-4 text-black/60"
                                                    strokeWidth={2}
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-48"
                                        >
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleEdit(automation)
                                                }
                                                className="text-[14px]"
                                            >
                                                <Edit
                                                    className="h-4 w-4 mr-2 text-black/60"
                                                    strokeWidth={2}
                                                />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDelete(
                                                        automation.id,
                                                        automation.nom
                                                    )
                                                }
                                                className="text-[14px] text-red-600"
                                            >
                                                <Trash2
                                                    className="h-4 w-4 mr-2"
                                                    strokeWidth={2}
                                                />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Automation Builder Dialog */}
            <AutomationBuilderDialog
                open={builderOpen}
                onOpenChange={setBuilderOpen}
                automation={editingAutomation}
            />
        </div>
    );
}

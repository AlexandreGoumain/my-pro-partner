"use client";

import { SerieCard } from "@/components/settings/serie-card";
import { SerieDialogSimple } from "@/components/settings/serie-dialog-simple";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { SettingsSection } from "@/components/ui/settings-section";
import { SerieDocument } from "@/lib/types/settings";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSeries, useCreateSerie, useUpdateSerie, useDeleteSerie, useToggleSerie } from "@/hooks/use-series";

export function SeriesTab() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSerie, setEditingSerie] = useState<SerieDocument | null>(null);

    // React Query hooks
    const { data: series = [], isLoading } = useSeries();
    const createSerie = useCreateSerie();
    const updateSerie = useUpdateSerie();
    const deleteSerie = useDeleteSerie();
    const toggleSerie = useToggleSerie();

    const handleSave = async (data: Partial<SerieDocument>) => {
        try {
            if (editingSerie) {
                await updateSerie.mutateAsync({ id: editingSerie.id, data });
                toast.success("Série modifiée avec succès");
            } else {
                await createSerie.mutateAsync(data);
                toast.success("Série créée avec succès");
            }

            setDialogOpen(false);
            setEditingSerie(null);
        } catch (error: unknown) {
            console.error("Error saving serie:", error);
            toast.error((error as Error).message || "Impossible de sauvegarder la série");
            throw error;
        }
    };

    const handleEdit = (serie: SerieDocument) => {
        setEditingSerie(serie);
        setDialogOpen(true);
    };

    const handleDelete = async (serie: SerieDocument) => {
        if (
            !confirm(
                `Êtes-vous sûr de vouloir supprimer la série "${serie.nom}" ?`
            )
        ) {
            return;
        }

        try {
            await deleteSerie.mutateAsync(serie.id);
            toast.success("Série supprimée avec succès");
        } catch (error: unknown) {
            console.error("Error deleting serie:", error);
            toast.error((error as Error).message || "Impossible de supprimer la série");
        }
    };

    const handleToggleActive = async (serie: SerieDocument) => {
        try {
            await toggleSerie.mutateAsync({ id: serie.id, active: !serie.active });
            toast.success(serie.active ? "Série désactivée" : "Série activée");
        } catch (error) {
            console.error("Error toggling serie:", error);
            toast.error("Impossible de modifier la série");
        }
    };

    const handleCreate = () => {
        setEditingSerie(null);
        setDialogOpen(true);
    };

    if (isLoading) {
        return <LoadingState minHeight="sm" className="py-12" />;
    }

    return (
        <div className="space-y-6">
            <SettingsSection
                icon={FileText}
                title="Séries de documents"
                description="Créez des séries personnalisées pour organiser vos devis, factures et avoirs"
            >
                <div className="flex justify-end">
                    <Button
                        onClick={handleCreate}
                        className="h-10 px-4 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Créer une série
                    </Button>
                </div>

                {series.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="Aucune série de documents"
                        description="Créez votre première série pour organiser vos documents par type (produits, services, etc.)"
                        action={{
                            label: "Créer une série",
                            onClick: handleCreate,
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {series.map((serie) => (
                            <SerieCard
                                key={serie.id}
                                serie={serie}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleActive={handleToggleActive}
                            />
                        ))}
                    </div>
                )}
            </SettingsSection>

            <SerieDialogSimple
                open={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setEditingSerie(null);
                }}
                serie={editingSerie}
                onSave={handleSave}
            />
        </div>
    );
}

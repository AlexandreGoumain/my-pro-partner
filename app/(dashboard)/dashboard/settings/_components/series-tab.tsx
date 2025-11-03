"use client";

import { SerieCard } from "@/components/settings/serie-card";
import { SerieDialogSimple } from "@/components/settings/serie-dialog-simple";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SettingsSection } from "@/components/ui/settings-section";
import { SerieDocument } from "@/lib/types/settings";
import { FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SeriesTab() {
    const [series, setSeries] = useState<SerieDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSerie, setEditingSerie] = useState<SerieDocument | null>(
        null
    );

    useEffect(() => {
        fetchSeries();
    }, []);

    const fetchSeries = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/settings/series");
            if (!response.ok)
                throw new Error("Erreur lors du chargement des séries");

            const data = await response.json();
            setSeries(data.series || []);
        } catch (error) {
            console.error("Error fetching series:", error);
            toast.error("Impossible de charger les séries");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (data: Partial<SerieDocument>) => {
        try {
            const url = editingSerie
                ? `/api/settings/series/${editingSerie.id}`
                : "/api/settings/series";
            const method = editingSerie ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Erreur lors de la sauvegarde"
                );
            }

            toast.success(
                editingSerie
                    ? "Série modifiée avec succès"
                    : "Série créée avec succès"
            );
            fetchSeries();
            setDialogOpen(false);
            setEditingSerie(null);
        } catch (error: any) {
            console.error("Error saving serie:", error);
            toast.error(error.message || "Impossible de sauvegarder la série");
            throw error; // Relance l'erreur pour empêcher la fermeture du dialogue
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
            const response = await fetch(`/api/settings/series/${serie.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Erreur lors de la suppression"
                );
            }

            toast.success("Série supprimée avec succès");
            fetchSeries();
        } catch (error: any) {
            console.error("Error deleting serie:", error);
            toast.error(error.message || "Impossible de supprimer la série");
        }
    };

    const handleToggleActive = async (serie: SerieDocument) => {
        try {
            const response = await fetch(`/api/settings/series/${serie.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !serie.active }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour");
            }

            toast.success(serie.active ? "Série désactivée" : "Série activée");
            fetchSeries();
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
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-[14px] text-black/40">Chargement...</div>
            </div>
        );
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

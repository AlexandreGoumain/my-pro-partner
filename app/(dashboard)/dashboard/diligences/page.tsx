"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataStateRenderer } from "@/components/ui/data-state-renderer";
import { FilterBar } from "@/components/ui/filter-bar";
import { NoAccessState } from "@/components/ui/no-access-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatsGrid } from "@/components/ui/stats-grid";
import { useDiligencesPage } from "@/hooks/use-diligences-page";
import { TYPE_DILIGENCE, TYPE_DILIGENCE_LABELS } from "@/lib/types/juridique";
import { Calendar, Clock, Euro, FileText, Plus, User } from "lucide-react";

export default function DiligencesPage() {
    const {
        hasAccess,
        handleTypeChange,
        handleFactureeChange,
        diligences,
        isLoading,
        error,
        stats,
        navigateToAffaire,
        formatDuree,
        formatMontant,
    } = useDiligencesPage();

    if (!hasAccess) {
        return <NoAccessState icon={Clock} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Diligences"
                description="Suivez le temps passé sur vos affaires juridiques"
                actions={
                    <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Saisir une diligence
                    </Button>
                }
            />

            {/* Stats */}
            <StatsGrid
                stats={[
                    {
                        icon: FileText,
                        label: "Non facturées",
                        value: stats.nonFacturees,
                    },
                    {
                        icon: Clock,
                        label: "Temps non facturé",
                        value: formatDuree(stats.totalMinutes),
                    },
                    {
                        icon: Euro,
                        label: "Montant à facturer",
                        value: formatMontant(stats.totalMontant),
                    },
                ]}
                columns={3}
            />

            {/* Filters */}
            <FilterBar
                filters={[
                    {
                        type: "select",
                        value: "ALL",
                        onChange: handleTypeChange,
                        placeholder: "Tous les types",
                        options: [
                            { value: "ALL", label: "Tous les types" },
                            ...TYPE_DILIGENCE.map((type) => ({
                                value: type,
                                label: TYPE_DILIGENCE_LABELS[type],
                            })),
                        ],
                        className: "w-[200px]",
                    },
                    {
                        type: "select",
                        value: "ALL",
                        onChange: handleFactureeChange,
                        placeholder: "Toutes",
                        options: [
                            { value: "ALL", label: "Toutes" },
                            { value: "false", label: "Non facturées" },
                            { value: "true", label: "Facturées" },
                        ],
                        className: "w-[180px]",
                    },
                ]}
            />

            {/* Content */}
            <DataStateRenderer
                isLoading={isLoading}
                error={error}
                data={diligences}
                errorMessage="Erreur lors du chargement des diligences"
                emptyState={{
                    icon: Clock,
                    title: "Aucune diligence",
                    description: "Aucune diligence enregistrée",
                }}
            >
                {(data) => (
                    <div className="space-y-2">
                        {data.map((diligence) => (
                            <Card
                                key={diligence.id}
                                className="p-4 border-black/8 hover:border-black/15 transition-colors cursor-pointer"
                                onClick={() =>
                                    navigateToAffaire(diligence.affaireId)
                                }
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] px-1.5 py-0"
                                            >
                                                {
                                                    TYPE_DILIGENCE_LABELS[
                                                        diligence.type
                                                    ]
                                                }
                                            </Badge>
                                            {!diligence.facturee &&
                                                diligence.facturable && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] px-1.5 py-0 bg-black/5"
                                                    >
                                                        À facturer
                                                    </Badge>
                                                )}
                                            {diligence.facturee && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] px-1.5 py-0 bg-black/5 text-black/40"
                                                >
                                                    Facturée
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-[14px] text-black mb-1 line-clamp-2">
                                            {diligence.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-[12px] text-black/40">
                                            <span className="font-mono">
                                                {diligence.affaire?.reference}
                                            </span>
                                            <span className="text-black/20">
                                                •
                                            </span>
                                            <span className="truncate max-w-[200px]">
                                                {diligence.affaire?.intitule}
                                            </span>
                                            {diligence.user && (
                                                <>
                                                    <span className="text-black/20">
                                                        •
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        <span>
                                                            {diligence.user
                                                                .name ||
                                                                diligence.user
                                                                    .email}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-[12px] text-black/40 mb-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {new Date(
                                                    diligence.date
                                                ).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </span>
                                        </div>
                                        <div className="text-[15px] font-medium text-black">
                                            {formatDuree(diligence.duree)}
                                        </div>
                                        {diligence.facturable && (
                                            <div className="text-[12px] text-black/40">
                                                {formatMontant(
                                                    diligence.montant
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </DataStateRenderer>
        </div>
    );
}

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText, Plus, User, Calendar,
    AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBaux, useBauxExpiring, type BailWithRelations, type BauxFilters } from "@/hooks/immobilier/use-baux";
import { useLoyersImpayes } from "@/hooks/gestion-locative/use-loyers";
import { CreateBailDialog } from "@/components/gestion-locative";

const TYPE_BAIL_OPTIONS = [
    { value: "ALL", label: "Tous les types" },
    { value: "HABITATION_VIDE", label: "Habitation vide" },
    { value: "HABITATION_MEUBLEE", label: "Habitation meublée" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "PROFESSIONNEL", label: "Professionnel" },
    { value: "MIXTE", label: "Mixte" },
    { value: "SAISONNIER", label: "Saisonnier" },
];

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "EN_COURS", label: "En cours" },
    { value: "PREAVIS", label: "En préavis" },
    { value: "TERMINE", label: "Terminé" },
    { value: "RESILIE", label: "Résilié" },
];

const TYPE_BAIL_LABELS: Record<string, string> = {
    HABITATION_VIDE: "Habitation vide",
    HABITATION_MEUBLEE: "Meublé",
    COMMERCIAL: "Commercial",
    PROFESSIONNEL: "Professionnel",
    MIXTE: "Mixte",
    SAISONNIER: "Saisonnier",
};

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    EN_COURS: { label: "En cours", variant: "default" },
    PREAVIS: { label: "En préavis", variant: "secondary" },
    TERMINE: { label: "Terminé", variant: "outline" },
    RESILIE: { label: "Résilié", variant: "destructive" },
};

function BailCard({ bail, onView, onEdit }: {
    bail: BailWithRelations;
    onView: (b: BailWithRelations) => void;
    onEdit: (b: BailWithRelations) => void;
}) {
    const statutConfig = STATUT_CONFIG[bail.statut] || STATUT_CONFIG.EN_COURS;
    const loyerTotal = Number(bail.loyerCC) || (Number(bail.loyerHC) + Number(bail.provisions));

    const dateDebut = bail.dateDebut ? new Date(bail.dateDebut) : new Date();
    const dateFin = bail.dateFin ? new Date(bail.dateFin) : new Date(dateDebut);
    if (!bail.dateFin) {
        dateFin.setMonth(dateFin.getMonth() + (bail.dureeMois || 36));
    }

    const now = new Date();
    const monthsRemaining = Math.ceil(
        (dateFin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const isExpiringSoon = monthsRemaining <= 3 && monthsRemaining > 0;

    return (
        <Card
            className="p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
            onClick={() => onView(bail)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{bail.reference}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black">
                        {bail.bien?.titre || "Bien non défini"}
                    </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">
                    {TYPE_BAIL_LABELS[bail.typeBail] || bail.typeBail}
                </Badge>
            </div>

            {/* Locataire */}
            {bail.locataire && (
                <div className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
                    <User className="w-4 h-4 text-black/40" />
                    <span>{bail.locataire.prenom} {bail.locataire.nom}</span>
                </div>
            )}

            {/* Loyer */}
            <div className="bg-black/[0.02] rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-black/40">Loyer mensuel</span>
                    <span className="text-[16px] font-bold text-black">
                        {loyerTotal.toLocaleString("fr-FR")} €
                    </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-black/40">
                    <span>
                        HC: {Number(bail.loyerHC).toLocaleString("fr-FR")} € + provisions: {Number(bail.provisions || 0)} €
                    </span>
                </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4 text-[12px] text-black/40 mb-3">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Début: {dateDebut.toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span>Fin: {dateFin.toLocaleDateString("fr-FR")}</span>
                </div>
            </div>

            {/* Alertes */}
            {isExpiringSoon && bail.statut === "EN_COURS" && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg p-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-[12px] text-amber-700">
                        Expire dans {monthsRemaining} mois
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8 flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(bail);
                    }}
                >
                    Voir détails
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(bail);
                    }}
                >
                    Modifier
                </Button>
            </div>
        </Card>
    );
}

function BauxPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<BauxFilters>({
        typeBail: "ALL",
        statut: "ALL",
        search: "",
    });
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: baux = [], isLoading } = useBaux(filters);
    const { data: bauxExpiring = [] } = useBauxExpiring();
    const { data: loyersImpayes = [] } = useLoyersImpayes();

    const handleFilterChange = useCallback(
        (key: keyof BauxFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value as any }));
        },
        []
    );

    const handleView = useCallback((bail: BailWithRelations) => {
        router.push(`/dashboard/baux/${bail.id}`);
    }, [router]);

    const handleEdit = useCallback((bail: BailWithRelations) => {
        router.push(`/dashboard/baux/${bail.id}/edit`);
    }, [router]);

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    // Stats
    const actifsCount = baux.filter((b) => b.statut === "EN_COURS").length;
    const totalLoyers = baux
        .filter((b) => b.statut === "EN_COURS")
        .reduce((acc, b) => acc + Number(b.loyerCC || 0), 0);
    const enPreavisCount = baux.filter((b) => b.statut === "PREAVIS").length;

    // Count unique bails with unpaid loyers
    const bauxAvecImpayes = new Set(loyersImpayes.map(l => l.bailId)).size;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestion des baux"
                description="Gérez vos contrats de location et suivez les échéances"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouveau bail
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Baux actifs</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {actifsCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Loyers mensuels</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalLoyers.toLocaleString("fr-FR")} €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">En préavis</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-amber-600">
                        {enPreavisCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Avec impayés</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        bauxAvecImpayes > 0 ? "text-red-600" : "text-black"
                    )}>
                        {bauxAvecImpayes}
                    </p>
                </Card>
            </div>

            {/* Alert for expiring baux */}
            {bauxExpiring.length > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                        <p className="text-[14px] font-medium text-amber-800">
                            {bauxExpiring.length} bail{bauxExpiring.length > 1 ? "x" : ""} expire{bauxExpiring.length > 1 ? "nt" : ""} dans les 90 prochains jours
                        </p>
                        <p className="text-[13px] text-amber-700">
                            Pensez à préparer les renouvellements ou les états des lieux de sortie.
                        </p>
                    </div>
                </div>
            )}

            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: (value) => handleFilterChange("search", value),
                        placeholder: "Rechercher par référence, bien, locataire...",
                        className: "flex-1",
                    },
                    {
                        type: "select",
                        value: filters.typeBail || "ALL",
                        onChange: (value) => handleFilterChange("typeBail", value),
                        options: TYPE_BAIL_OPTIONS,
                        label: "Type de bail",
                    },
                    {
                        type: "select",
                        value: filters.statut || "ALL",
                        onChange: (value) => handleFilterChange("statut", value),
                        options: STATUT_OPTIONS,
                        label: "Statut",
                    },
                ]}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[320px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : baux.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="Aucun bail"
                    description={
                        filters.search ||
                        filters.typeBail !== "ALL" ||
                        filters.statut !== "ALL"
                            ? "Aucun bail ne correspond à vos critères"
                            : "Créez votre premier contrat de location"
                    }
                    action={
                        filters.search ||
                        filters.typeBail !== "ALL" ||
                        filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Créer un bail",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {baux.map((bail) => (
                        <BailCard
                            key={bail.id}
                            bail={bail}
                            onView={handleView}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            <CreateBailDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </div>
    );
}

export default function BauxPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <BauxPageContent />
        </SuspensePage>
    );
}

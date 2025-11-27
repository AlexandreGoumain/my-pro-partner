"use client";

import { EntretienDialog } from "@/components/flotte/entretien-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import {
    useDeleteEntretienVehicule,
    useEntretiensVehicules,
} from "@/hooks/use-entretiens-vehicules";
import { useFlotte } from "@/hooks/use-flotte";
import type {
    EntretienVehicule,
    TypeEntretienVehicule,
} from "@/lib/types/flotte";
import { TYPE_ENTRETIEN_LABELS } from "@/lib/types/flotte";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Calendar,
    Car,
    Euro,
    Filter,
    Gauge,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
    Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function EntretiensPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedEntretien, setSelectedEntretien] =
        useState<EntretienVehicule | null>(null);
    const [filterVehicule, setFilterVehicule] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");

    const { data: camionnettes = [] } = useFlotte();
    const { data: entretiens = [], isLoading } = useEntretiensVehicules({
        camionnetteId: filterVehicule !== "all" ? filterVehicule : undefined,
        type: filterType !== "all" ? filterType : undefined,
    });
    const deleteEntretien = useDeleteEntretienVehicule();

    // Stats
    const stats = useMemo(() => {
        const total = entretiens.length;
        const coutTotal = entretiens.reduce(
            (acc, e) => acc + (Number(e.cout) || 0),
            0
        );
        const thisMonth = entretiens.filter((e) => {
            const date = new Date(e.dateEntretien);
            const now = new Date();
            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );
        }).length;
        return { total, coutTotal, thisMonth };
    }, [entretiens]);

    const handleCreate = () => {
        setSelectedEntretien(null);
        setDialogOpen(true);
    };

    const handleEdit = (entretien: EntretienVehicule) => {
        setSelectedEntretien(entretien);
        setDialogOpen(true);
    };

    const handleDelete = (entretien: EntretienVehicule) => {
        setSelectedEntretien(entretien);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedEntretien) return;

        deleteEntretien.mutate(selectedEntretien.id, {
            onSuccess: () => {
                toast.success("Entretien supprimé", {
                    description: "L'entretien a été supprimé",
                });
                setDeleteDialogOpen(false);
                setSelectedEntretien(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer l'entretien",
                });
            },
        });
    };

    const getTypeColor = (type: TypeEntretienVehicule) => {
        switch (type) {
            case "CONTROLE_TECHNIQUE":
                return "bg-red-100 text-red-700";
            case "REVISION":
                return "bg-blue-100 text-blue-700";
            case "VIDANGE":
                return "bg-amber-100 text-amber-700";
            case "PNEUS":
                return "bg-slate-100 text-slate-700";
            case "FREINS":
                return "bg-orange-100 text-orange-700";
            case "REPARATION":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <RouteGuard capability="stock_camionnette">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Entretiens véhicules"
                    description="Suivi des entretiens et réparations de votre flotte"
                    actions={
                        <PrimaryActionButton onClick={handleCreate}>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvel entretien
                        </PrimaryActionButton>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={Wrench}
                        label="Total entretiens"
                        value={stats.total}
                        description="entretiens enregistrés"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Ce mois"
                        value={stats.thisMonth}
                        description="entretiens ce mois"
                    />
                    <StatCard
                        icon={Euro}
                        label="Coût total"
                        value={`${stats.coutTotal.toLocaleString("fr-FR")} €`}
                        description="dépenses d'entretien"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[13px] text-black/50">
                        <Filter className="w-4 h-4" strokeWidth={2} />
                        <span>Filtres :</span>
                    </div>
                    <Select
                        value={filterVehicule}
                        onValueChange={setFilterVehicule}
                    >
                        <SelectTrigger className="w-[200px] h-10">
                            <SelectValue placeholder="Tous les véhicules" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Tous les véhicules
                            </SelectItem>
                            {camionnettes.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.immatriculation}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px] h-10">
                            <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les types</SelectItem>
                            {Object.entries(TYPE_ENTRETIEN_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Entretiens List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <>
                            {[...Array(3)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-[100px] rounded-xl"
                                />
                            ))}
                        </>
                    ) : entretiens.length === 0 ? (
                        <EmptyState
                            icon={Wrench}
                            title="Aucun entretien"
                            description="Enregistrez le premier entretien d'un véhicule"
                            action={{
                                label: "Ajouter un entretien",
                                onClick: handleCreate,
                                icon: Plus,
                            }}
                            variant="dashed"
                        />
                    ) : (
                        entretiens.map((entretien) => (
                            <div
                                key={entretien.id}
                                className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center">
                                            <Wrench
                                                className="w-6 h-6 text-black/60"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getTypeColor(entretien.type)}`}
                                                >
                                                    {
                                                        TYPE_ENTRETIEN_LABELS[
                                                            entretien.type
                                                        ]
                                                    }
                                                </span>
                                                <span className="text-[14px] text-black/40">
                                                    {format(
                                                        new Date(
                                                            entretien.dateEntretien
                                                        ),
                                                        "d MMMM yyyy",
                                                        { locale: fr }
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Car
                                                    className="w-4 h-4 text-black/40"
                                                    strokeWidth={2}
                                                />
                                                <span className="text-[15px] font-medium text-black font-mono">
                                                    {
                                                        entretien.camionnette
                                                            ?.immatriculation
                                                    }
                                                </span>
                                                {entretien.camionnette
                                                    ?.marque && (
                                                    <span className="text-[13px] text-black/50">
                                                        {
                                                            entretien
                                                                .camionnette
                                                                .marque
                                                        }{" "}
                                                        {
                                                            entretien
                                                                .camionnette
                                                                .modele
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            {entretien.description && (
                                                <p className="text-[13px] text-black/50 mt-1 line-clamp-1">
                                                    {entretien.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            {entretien.cout && (
                                                <p className="text-[16px] font-semibold text-black">
                                                    {Number(
                                                        entretien.cout
                                                    ).toLocaleString(
                                                        "fr-FR"
                                                    )}{" "}
                                                    €
                                                </p>
                                            )}
                                            {entretien.kilometrage && (
                                                <div className="flex items-center gap-1 text-[12px] text-black/40 mt-1">
                                                    <Gauge
                                                        className="w-3 h-3"
                                                        strokeWidth={2}
                                                    />
                                                    <span>
                                                        {entretien.kilometrage.toLocaleString(
                                                            "fr-FR"
                                                        )}{" "}
                                                        km
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleEdit(entretien)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDelete(entretien)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {(entretien.prestataire ||
                                    entretien.dateProchain) && (
                                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-black/5 text-[13px] text-black/50">
                                        {entretien.prestataire && (
                                            <span>
                                                Prestataire :{" "}
                                                {entretien.prestataire}
                                            </span>
                                        )}
                                        {entretien.dateProchain && (
                                            <span>
                                                Prochain :{" "}
                                                {format(
                                                    new Date(
                                                        entretien.dateProchain
                                                    ),
                                                    "d MMM yyyy",
                                                    { locale: fr }
                                                )}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Create/Edit Dialog */}
                <EntretienDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={() => setDialogOpen(false)}
                    entretien={selectedEntretien}
                    camionnettes={camionnettes}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={confirmDelete}
                    title="Supprimer cet entretien ?"
                    description="Cette action est irréversible. L'entretien sera définitivement supprimé."
                    confirmLabel="Supprimer"
                    isLoading={deleteEntretien.isPending}
                />
            </div>
        </RouteGuard>
    );
}

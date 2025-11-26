"use client";

import { EquipementCard } from "@/components/equipements/equipement-card";
import { EquipementDialog } from "@/components/equipements/equipement-dialog";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
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
    useDeleteEquipement,
    useEquipements,
    useEquipementsStats,
} from "@/hooks/use-equipements";
import {
    STATUT_EQUIPEMENT,
    STATUT_EQUIPEMENT_LABELS,
    type EquipementClient,
    type StatutEquipement,
} from "@/lib/types/equipement";
import {
    EQUIPEMENTS_PAR_METIER,
    TYPE_EQUIPEMENT_LABELS,
    type TypeEquipement,
} from "@/lib/types/intervention";
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle,
    Filter,
    Package,
    Plus,
    Search,
    Wrench,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function EquipementsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEquipement, setSelectedEquipement] =
        useState<EquipementClient | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [equipementToDelete, setEquipementToDelete] =
        useState<EquipementClient | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<TypeEquipement | "ALL">("ALL");
    const [statutFilter, setStatutFilter] = useState<StatutEquipement | "ALL">(
        "ALL"
    );
    const [controleUrgent, setControleUrgent] = useState(false);

    // Build filters object
    const filters = useMemo(
        () => ({
            type: typeFilter !== "ALL" ? typeFilter : undefined,
            statut: statutFilter !== "ALL" ? statutFilter : undefined,
            controleUrgent: controleUrgent || undefined,
        }),
        [typeFilter, statutFilter, controleUrgent]
    );

    // Fetch data
    const { data: equipements = [], isLoading } = useEquipements(filters);
    const { data: stats } = useEquipementsStats();
    const deleteEquipement = useDeleteEquipement();

    // Filter by search query locally
    const filteredEquipements = useMemo(() => {
        if (!searchQuery) return equipements;

        const query = searchQuery.toLowerCase();
        return equipements.filter(
            (eq) =>
                eq.marque.toLowerCase().includes(query) ||
                eq.modele?.toLowerCase().includes(query) ||
                eq.numeroSerie?.toLowerCase().includes(query) ||
                eq.client?.nom.toLowerCase().includes(query) ||
                eq.client?.prenom?.toLowerCase().includes(query) ||
                eq.client?.ville?.toLowerCase().includes(query) ||
                TYPE_EQUIPEMENT_LABELS[eq.type].toLowerCase().includes(query)
        );
    }, [equipements, searchQuery]);

    const handleEdit = (equipement: EquipementClient) => {
        setSelectedEquipement(equipement);
        setDialogOpen(true);
    };

    const handleDelete = (equipement: EquipementClient) => {
        setEquipementToDelete(equipement);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!equipementToDelete) return;

        try {
            await deleteEquipement.mutateAsync(equipementToDelete.id);
            toast.success("Équipement supprimé");
            setDeleteDialogOpen(false);
            setEquipementToDelete(null);
        } catch {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedEquipement(null);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setTypeFilter("ALL");
        setStatutFilter("ALL");
        setControleUrgent(false);
    };

    // Get equipment types for filter
    const equipementTypes = EQUIPEMENTS_PAR_METIER.CHAUFFAGE;

    return (
        <RouteGuard capability="domicile">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Parc Équipements"
                    description="Suivi du parc équipements installés chez vos clients"
                    actions={
                        <Button
                            onClick={() => setDialogOpen(true)}
                            className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvel équipement
                        </Button>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Package}
                        label="Total équipements"
                        value={stats?.total ?? 0}
                        description="équipements enregistrés"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="En service"
                        value={stats?.enService ?? 0}
                        badge={{
                            text: stats?.total
                                ? `${Math.round(((stats?.enService ?? 0) / stats.total) * 100)}%`
                                : "0%",
                            className: "bg-emerald-100 text-emerald-700",
                        }}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Contrôles urgents"
                        value={(stats?.controlesAVenir ?? 0) + (stats?.controlesEnRetard ?? 0)}
                        description={`dont ${stats?.controlesEnRetard ?? 0} en retard`}
                        badge={
                            (stats?.controlesEnRetard ?? 0) > 0
                                ? {
                                      text: "Action requise",
                                      className: "bg-red-100 text-red-700",
                                  }
                                : undefined
                        }
                    />
                    <StatCard
                        icon={XCircle}
                        label="En panne"
                        value={(stats?.enPanne ?? 0) + (stats?.aRemplacer ?? 0)}
                        description={`${stats?.enPanne ?? 0} pannes, ${stats?.aRemplacer ?? 0} à remplacer`}
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                            strokeWidth={2}
                        />
                        <Input
                            placeholder="Rechercher par marque, modèle, client, ville..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-11 border-black/10 bg-white"
                        />
                    </div>

                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(value as TypeEquipement | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[200px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les types</SelectItem>
                            {equipementTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {TYPE_EQUIPEMENT_LABELS[type as TypeEquipement]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={statutFilter}
                        onValueChange={(value) =>
                            setStatutFilter(value as StatutEquipement | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les statuts</SelectItem>
                            {STATUT_EQUIPEMENT.map((statut) => (
                                <SelectItem key={statut} value={statut}>
                                    {STATUT_EQUIPEMENT_LABELS[statut]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant={controleUrgent ? "default" : "outline"}
                        className={
                            controleUrgent
                                ? "h-11 px-4 bg-orange-500 hover:bg-orange-600"
                                : "h-11 px-4 border-black/10 hover:bg-black/5"
                        }
                        onClick={() => setControleUrgent(!controleUrgent)}
                    >
                        <AlertCircle className="w-4 h-4 mr-2" strokeWidth={2} />
                        Contrôles urgents
                    </Button>

                    <Button
                        variant="outline"
                        className="h-11 px-6 border-black/10 hover:bg-black/5"
                        onClick={resetFilters}
                    >
                        <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                        Réinitialiser
                    </Button>
                </div>

                {/* Equipements List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <>
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-[160px] rounded-xl" />
                            ))}
                        </>
                    ) : filteredEquipements.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-black/8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black/5 flex items-center justify-center">
                                <Wrench
                                    className="w-8 h-8 text-black/30"
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-[16px] font-semibold text-black mb-1">
                                Aucun équipement trouvé
                            </h3>
                            <p className="text-[14px] text-black/40 mb-4">
                                {searchQuery ||
                                typeFilter !== "ALL" ||
                                statutFilter !== "ALL" ||
                                controleUrgent
                                    ? "Essayez de modifier vos filtres"
                                    : "Commencez par enregistrer votre premier équipement"}
                            </p>
                            {!searchQuery &&
                                typeFilter === "ALL" &&
                                statutFilter === "ALL" &&
                                !controleUrgent && (
                                    <Button
                                        onClick={() => setDialogOpen(true)}
                                        className="bg-black hover:bg-black/90"
                                    >
                                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                                        Ajouter un équipement
                                    </Button>
                                )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredEquipements.map((equipement) => (
                                <EquipementCard
                                    key={equipement.id}
                                    equipement={equipement}
                                    onEdit={() => handleEdit(equipement)}
                                    onDelete={() => handleDelete(equipement)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Add/Edit Dialog */}
                <EquipementDialog
                    open={dialogOpen}
                    onOpenChange={handleDialogClose}
                    equipement={selectedEquipement}
                    onSuccess={() => {
                        handleDialogClose();
                    }}
                />

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'équipement</AlertDialogTitle>
                            <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet équipement ?
                                {equipementToDelete && (
                                    <span className="block mt-2 font-medium text-black">
                                        {TYPE_EQUIPEMENT_LABELS[equipementToDelete.type]} -{" "}
                                        {equipementToDelete.marque}
                                    </span>
                                )}
                                Cette action est irréversible.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </RouteGuard>
    );
}

"use client";

import { CreateAbonnementDialog } from "@/components/fitness/create-abonnement-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { useAbonnements, useFitnessStats } from "@/hooks/use-fitness";
import {
    STATUT_ABONNEMENT_LABELS,
    type StatutAbonnementFitness,
} from "@/lib/types/fitness";
import { getAbonnementFitnessStatusColor } from "@/lib/utils/badge-colors";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    AlertTriangle,
    Calendar,
    CreditCard,
    Plus,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";

export default function AbonnementsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statutFilter, setStatutFilter] = useState<
        StatutAbonnementFitness | "ALL"
    >("ALL");
    const [page, setPage] = useState(1);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: stats } = useFitnessStats();
    const { data: abonnementsData, isLoading } = useAbonnements({
        page,
        limit: 20,
        search: searchQuery,
        statut: statutFilter === "ALL" ? undefined : statutFilter,
    });

    return (
        <RouteGuard capability="abonnements_fitness">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Abonnements"
                    description="Gestion des abonnements des membres"
                    actions={
                        <PrimaryActionButton
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvel abonnement
                        </PrimaryActionButton>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={CreditCard}
                        label="Total abonnements"
                        value={stats?.totalAbonnements || 0}
                    />
                    <StatCard
                        icon={Users}
                        label="Actifs"
                        value={stats?.abonnementsActifs || 0}
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Expirés"
                        value={stats?.abonnementsExpires || 0}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Revenus mensuels"
                        value={`${(stats?.revenusMensuels || 0).toLocaleString()}€`}
                    />
                </div>

                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher par membre, numéro..."
                        className="flex-1"
                    />

                    <Select
                        value={statutFilter}
                        onValueChange={(value) =>
                            setStatutFilter(
                                value as StatutAbonnementFitness | "ALL"
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Tous les statuts
                            </SelectItem>
                            {Object.entries(STATUT_ABONNEMENT_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Liste des abonnements */}
                <div className="space-y-3">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[100px] rounded-xl"
                            />
                        ))
                    ) : abonnementsData?.data &&
                      abonnementsData.data.length > 0 ? (
                        abonnementsData.data.map((abonnement) => (
                            <Card
                                key={abonnement.id}
                                className="border-black/8 hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-[16px] font-semibold text-black">
                                                    {abonnement.client?.prenom}{" "}
                                                    {abonnement.client?.nom}
                                                </h3>
                                                <Badge
                                                    className={getAbonnementFitnessStatusColor(
                                                        abonnement.statut
                                                    )}
                                                >
                                                    {
                                                        STATUT_ABONNEMENT_LABELS[
                                                            abonnement.statut
                                                        ]
                                                    }
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-[13px] text-black/50">
                                                <span className="flex items-center gap-1">
                                                    <CreditCard
                                                        className="w-3.5 h-3.5"
                                                        strokeWidth={2}
                                                    />
                                                    {
                                                        abonnement
                                                            .typeAbonnement?.nom
                                                    }
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar
                                                        className="w-3.5 h-3.5"
                                                        strokeWidth={2}
                                                    />
                                                    Depuis{" "}
                                                    {format(
                                                        new Date(
                                                            abonnement.dateDebut
                                                        ),
                                                        "d MMM yyyy",
                                                        { locale: fr }
                                                    )}
                                                </span>
                                                {abonnement.dateFin && (
                                                    <span>
                                                        Fin:{" "}
                                                        {format(
                                                            new Date(
                                                                abonnement.dateFin
                                                            ),
                                                            "d MMM yyyy",
                                                            { locale: fr }
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] text-black/40 mb-1">
                                                N° {abonnement.numero}
                                            </p>
                                            {abonnement.seancesRestantes !==
                                                null && (
                                                <p className="text-[14px] font-medium">
                                                    {
                                                        abonnement.seancesRestantes
                                                    }{" "}
                                                    séances restantes
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <EmptyState
                            icon={CreditCard}
                            title="Aucun abonnement"
                            description="Créez votre premier abonnement"
                            action={{
                                label: "Nouvel abonnement",
                                onClick: () => setCreateDialogOpen(true),
                                icon: Plus,
                            }}
                            variant="dashed"
                        />
                    )}
                </div>

                {/* Pagination */}
                {abonnementsData?.pagination &&
                    abonnementsData.pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Précédent
                            </Button>
                            <span className="flex items-center px-4 text-[14px] text-black/60">
                                Page {page} sur{" "}
                                {abonnementsData.pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    page ===
                                    abonnementsData.pagination.totalPages
                                }
                                onClick={() => setPage(page + 1)}
                            >
                                Suivant
                            </Button>
                        </div>
                    )}

                {/* Dialog de création */}
                <CreateAbonnementDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                />
            </div>
        </RouteGuard>
    );
}

"use client";

import { Badge } from "@/components/ui/badge";
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
import { useCours, useFitnessStats } from "@/hooks/use-fitness";
import {
    CATEGORIES_COURS,
    NIVEAU_COURS_LABELS,
    type NiveauCours,
} from "@/lib/types/fitness";
import { getNiveauCoursColor } from "@/lib/utils/badge-colors";
import { Clock, DoorOpen, Dumbbell, Plus, User, Users } from "lucide-react";
import { useState } from "react";

export default function CoursPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categorieFilter, setCategorieFilter] = useState<string>("ALL");
    const [niveauFilter, setNiveauFilter] = useState<NiveauCours | "ALL">(
        "ALL"
    );

    const { data: stats } = useFitnessStats();
    const { data: cours, isLoading } = useCours({
        search: searchQuery,
        categorie: categorieFilter === "ALL" ? undefined : categorieFilter,
        niveau: niveauFilter === "ALL" ? undefined : niveauFilter,
        actif: true,
    });

    return (
        <RouteGuard capability="cours_collectifs">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Cours collectifs"
                    description="Gérez vos cours et activités"
                    actions={
                        <PrimaryActionButton>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouveau cours
                        </PrimaryActionButton>
                    }
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        icon={Dumbbell}
                        label="Cours actifs"
                        value={stats?.coursActifs || 0}
                    />
                    <StatCard
                        icon={Clock}
                        label="Séances cette semaine"
                        value={stats?.seancesSemaine || 0}
                    />
                    <StatCard
                        icon={Users}
                        label="Taux remplissage"
                        value={`${stats?.tauxRemplissageCours || 0}%`}
                    />
                </div>

                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher un cours..."
                        className="flex-1"
                    />

                    <Select
                        value={categorieFilter}
                        onValueChange={setCategorieFilter}
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Toutes catégories
                            </SelectItem>
                            {CATEGORIES_COURS.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={niveauFilter}
                        onValueChange={(value) =>
                            setNiveauFilter(value as NiveauCours | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous niveaux</SelectItem>
                            {Object.entries(NIVEAU_COURS_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Liste des cours */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[200px] rounded-xl"
                            />
                        ))
                    ) : cours && cours.length > 0 ? (
                        cours.map((item) => (
                            <Card
                                key={item.id}
                                className="border-black/8 hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                            >
                                <div
                                    className="h-2"
                                    style={{
                                        backgroundColor: item.couleur || "#000",
                                    }}
                                />
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-[16px] font-semibold text-black">
                                            {item.nom}
                                        </h3>
                                        <Badge
                                            className={getNiveauCoursColor(
                                                item.niveau
                                            )}
                                        >
                                            {NIVEAU_COURS_LABELS[item.niveau]}
                                        </Badge>
                                    </div>

                                    {item.description && (
                                        <p className="text-[13px] text-black/50 mb-4 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 text-[13px] text-black/60">
                                        <div className="flex items-center gap-2">
                                            <Clock
                                                className="w-3.5 h-3.5"
                                                strokeWidth={2}
                                            />
                                            <span>{item.dureeMinutes} min</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users
                                                className="w-3.5 h-3.5"
                                                strokeWidth={2}
                                            />
                                            <span>
                                                {item.capaciteMax} places max
                                            </span>
                                        </div>
                                        {item.instructeur && (
                                            <div className="flex items-center gap-2">
                                                <User
                                                    className="w-3.5 h-3.5"
                                                    strokeWidth={2}
                                                />
                                                <span>
                                                    {item.instructeur.prenom}{" "}
                                                    {item.instructeur.nom}
                                                </span>
                                            </div>
                                        )}
                                        {item.salle && (
                                            <div className="flex items-center gap-2">
                                                <DoorOpen
                                                    className="w-3.5 h-3.5"
                                                    strokeWidth={2}
                                                />
                                                <span>{item.salle.nom}</span>
                                            </div>
                                        )}
                                    </div>

                                    {item._count && (
                                        <div className="mt-4 pt-3 border-t border-black/5">
                                            <span className="text-[12px] text-black/40">
                                                {item._count.seances} séances
                                                planifiées
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <EmptyState
                                icon={Dumbbell}
                                title="Aucun cours"
                                description="Créez votre premier cours collectif"
                                action={{
                                    label: "Nouveau cours",
                                    onClick: () => {},
                                    icon: Plus,
                                }}
                                variant="dashed"
                            />
                        </div>
                    )}
                </div>
            </div>
        </RouteGuard>
    );
}

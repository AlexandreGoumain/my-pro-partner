"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { RouteGuard } from "@/components/ui/route-guard";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { useFitnessStats, usePresences } from "@/hooks/use-fitness";
import { TYPE_ACCES_LABELS, type TypeAccesFitness } from "@/lib/types/fitness";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Calendar,
    Clock,
    DoorClosed,
    DoorOpen,
    MapPin,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";

export default function PresencesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<TypeAccesFitness | "ALL">(
        "ALL"
    );
    const [dateFilter, setDateFilter] = useState<string>("today");

    // Calcul des dates en fonction du filtre
    const getDateRange = () => {
        const now = new Date();
        switch (dateFilter) {
            case "today":
                return { debut: startOfDay(now), fin: endOfDay(now) };
            case "yesterday":
                const yesterday = subDays(now, 1);
                return {
                    debut: startOfDay(yesterday),
                    fin: endOfDay(yesterday),
                };
            case "week":
                return {
                    debut: startOfDay(subDays(now, 7)),
                    fin: endOfDay(now),
                };
            case "month":
                return {
                    debut: startOfDay(subDays(now, 30)),
                    fin: endOfDay(now),
                };
            default:
                return { debut: startOfDay(now), fin: endOfDay(now) };
        }
    };

    const dateRange = getDateRange();

    const { data: stats } = useFitnessStats();
    const { data: presencesData, isLoading } = usePresences({
        dateDebut: dateRange.debut.toISOString(),
        dateFin: dateRange.fin.toISOString(),
        typeAcces: typeFilter === "ALL" ? undefined : typeFilter,
    });

    const presences = presencesData?.data || [];

    // Filtrer par recherche
    const filteredPresences = presences.filter((presence) => {
        if (!searchQuery) return true;
        const search = searchQuery.toLowerCase();
        const client = presence.client;
        return (
            client?.nom?.toLowerCase().includes(search) ||
            client?.prenom?.toLowerCase().includes(search) ||
            client?.email?.toLowerCase().includes(search)
        );
    });

    const getTypeIcon = (type: TypeAccesFitness) => {
        switch (type) {
            case "ENTREE":
                return (
                    <DoorOpen
                        className="w-3.5 h-3.5 text-green-600"
                        strokeWidth={2}
                    />
                );
            case "SORTIE":
                return (
                    <DoorClosed
                        className="w-3.5 h-3.5 text-black/40"
                        strokeWidth={2}
                    />
                );
            case "COURS":
                return (
                    <Users
                        className="w-3.5 h-3.5 text-blue-600"
                        strokeWidth={2}
                    />
                );
            case "ESPACE_PREMIUM":
                return (
                    <MapPin
                        className="w-3.5 h-3.5 text-yellow-600"
                        strokeWidth={2}
                    />
                );
        }
    };

    return (
        <RouteGuard capability="presences_fitness">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Historique des présences"
                    description="Consultez les entrées et sorties de vos membres"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Users}
                        label="Présents maintenant"
                        value={stats?.presencesJour || 0}
                    />
                    <StatCard
                        icon={Calendar}
                        label="Cette semaine"
                        value={stats?.presencesSemaine || 0}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Ce mois"
                        value={stats?.presencesMois || 0}
                    />
                    <StatCard
                        icon={Clock}
                        label="Moyenne / jour"
                        value={stats?.moyennePresencesJour || 0}
                    />
                </div>

                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Rechercher un membre..."
                        className="flex-1 max-w-none"
                    />

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">
                                Aujourd&apos;hui
                            </SelectItem>
                            <SelectItem value="yesterday">Hier</SelectItem>
                            <SelectItem value="week">
                                7 derniers jours
                            </SelectItem>
                            <SelectItem value="month">
                                30 derniers jours
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(value as TypeAccesFitness | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Type d'accès" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les types</SelectItem>
                            {Object.entries(TYPE_ACCES_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Liste des présences */}
                <Card className="border-black/8">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-4">
                                <GridSkeleton
                                    itemCount={8}
                                    gridColumns={{ default: 1 }}
                                    gap={3}
                                    itemHeight="h-16"
                                />
                            </div>
                        ) : filteredPresences &&
                          filteredPresences.length > 0 ? (
                            <div className="divide-y divide-black/5">
                                {filteredPresences.map((presence) => (
                                    <div
                                        key={presence.id}
                                        className="flex items-center justify-between p-4 hover:bg-black/2 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Type icon */}
                                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                                {getTypeIcon(
                                                    presence.typeAcces
                                                )}
                                            </div>

                                            {/* Client info */}
                                            <div>
                                                <p className="text-[14px] font-medium text-black">
                                                    {presence.client?.prenom}{" "}
                                                    {presence.client?.nom}
                                                </p>
                                                <div className="flex items-center gap-3 text-[12px] text-black/50">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-black/5 text-black/60 border-0 text-[11px]"
                                                    >
                                                        {
                                                            TYPE_ACCES_LABELS[
                                                                presence
                                                                    .typeAcces
                                                            ]
                                                        }
                                                    </Badge>
                                                    {presence.salle && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin
                                                                className="w-3 h-3"
                                                                strokeWidth={2}
                                                            />
                                                            {presence.salle.nom}
                                                        </span>
                                                    )}
                                                    {presence.methodCheckin && (
                                                        <span className="text-black/30">
                                                            via{" "}
                                                            {
                                                                presence.methodCheckin
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Heure */}
                                        <div className="text-right">
                                            <p className="text-[14px] font-medium text-black">
                                                {format(
                                                    new Date(
                                                        presence.heureEntree
                                                    ),
                                                    "HH:mm"
                                                )}
                                            </p>
                                            <p className="text-[12px] text-black/40">
                                                {format(
                                                    new Date(
                                                        presence.heureEntree
                                                    ),
                                                    "d MMM",
                                                    { locale: fr }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Clock}
                                title="Aucune présence"
                                description="Aucune entrée enregistrée pour cette période"
                                variant="minimal"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </RouteGuard>
    );
}

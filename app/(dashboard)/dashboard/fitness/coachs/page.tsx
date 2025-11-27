"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { SearchBar } from "@/components/ui/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveEmployes } from "@/hooks/use-employes";
import { SPECIALITES_COACH } from "@/lib/types/fitness";
import {
    Award,
    Calendar,
    Dumbbell,
    Mail,
    Phone,
    Plus,
    User,
} from "lucide-react";
import { useState } from "react";

export default function CoachsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Récupérer les employés actifs
    const { data: employes, isLoading } = useActiveEmployes();

    // Filtrer pour n'avoir que les coachs (avec spécialités)
    const coachs = employes?.filter(
        (e) => e.specialites && e.specialites.length > 0
    );

    // Filtrer par recherche
    const filteredCoachs = coachs?.filter((coach) => {
        if (!searchQuery) return true;
        const search = searchQuery.toLowerCase();
        return (
            coach.nom?.toLowerCase().includes(search) ||
            coach.prenom?.toLowerCase().includes(search) ||
            coach.email?.toLowerCase().includes(search)
        );
    });

    const getSpecialiteLabel = (value: string) => {
        const spec = SPECIALITES_COACH.find((s) => s.value === value);
        return spec?.label || value;
    };

    const getInitials = (prenom: string, nom: string) => {
        return `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase();
    };

    return (
        <RouteGuard capability="cours_collectifs">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Coachs & Instructeurs"
                    description="Gérez votre équipe de coachs"
                    actions={
                        <PrimaryActionButton>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouveau coach
                        </PrimaryActionButton>
                    }
                />

                {/* Recherche */}
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher un coach..."
                />

                {/* Liste des coachs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[250px] rounded-xl"
                            />
                        ))
                    ) : filteredCoachs && filteredCoachs.length > 0 ? (
                        filteredCoachs.map((coach) => (
                            <Card
                                key={coach.id}
                                className="border-black/8 hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <CardContent className="p-5">
                                    {/* Header avec avatar */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <Avatar className="w-14 h-14 border-2 border-black/5">
                                            <AvatarFallback
                                                className="text-[16px] font-medium"
                                                style={{
                                                    backgroundColor:
                                                        coach.couleur ||
                                                        "#f5f5f5",
                                                    color: coach.couleur
                                                        ? "#fff"
                                                        : "#000",
                                                }}
                                            >
                                                {getInitials(
                                                    coach.prenom,
                                                    coach.nom
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="text-[16px] font-semibold text-black">
                                                {coach.prenom} {coach.nom}
                                            </h3>
                                            {coach.poste && (
                                                <p className="text-[13px] text-black/50">
                                                    {coach.poste}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {coach.bio && (
                                        <p className="text-[13px] text-black/50 mb-4 line-clamp-2">
                                            {coach.bio}
                                        </p>
                                    )}

                                    {/* Spécialités */}
                                    {coach.specialites &&
                                        coach.specialites.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {coach.specialites
                                                        .slice(0, 4)
                                                        .map((spec: string) => (
                                                            <Badge
                                                                key={spec}
                                                                variant="secondary"
                                                                className="bg-black/5 text-black/60 border-0 text-[11px]"
                                                            >
                                                                {getSpecialiteLabel(
                                                                    spec
                                                                )}
                                                            </Badge>
                                                        ))}
                                                    {coach.specialites.length >
                                                        4 && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-black/5 text-black/40 border-0 text-[11px]"
                                                        >
                                                            +
                                                            {coach.specialites
                                                                .length - 4}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Certifications */}
                                    {coach.certifications && (
                                        <div className="flex items-center gap-2 mb-3 text-[12px] text-black/50">
                                            <Award
                                                className="w-3.5 h-3.5"
                                                strokeWidth={2}
                                            />
                                            <span className="line-clamp-1">
                                                {coach.certifications}
                                            </span>
                                        </div>
                                    )}

                                    {/* Contact */}
                                    <div className="space-y-1.5 text-[12px] text-black/50">
                                        {coach.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail
                                                    className="w-3.5 h-3.5"
                                                    strokeWidth={2}
                                                />
                                                <span className="line-clamp-1">
                                                    {coach.email}
                                                </span>
                                            </div>
                                        )}
                                        {coach.telephone && (
                                            <div className="flex items-center gap-2">
                                                <Phone
                                                    className="w-3.5 h-3.5"
                                                    strokeWidth={2}
                                                />
                                                <span>{coach.telephone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    {coach._count && (
                                        <div className="mt-4 pt-3 border-t border-black/5 flex gap-4 text-[12px] text-black/40">
                                            <span className="flex items-center gap-1">
                                                <Dumbbell
                                                    className="w-3 h-3"
                                                    strokeWidth={2}
                                                />
                                                {coach._count.coursAssignes ||
                                                    0}{" "}
                                                cours
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar
                                                    className="w-3 h-3"
                                                    strokeWidth={2}
                                                />
                                                {coach._count.seancesAnimees ||
                                                    0}{" "}
                                                séances
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <EmptyState
                                icon={User}
                                title="Aucun coach"
                                description="Ajoutez des coachs à votre équipe"
                                action={{
                                    label: "Nouveau coach",
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

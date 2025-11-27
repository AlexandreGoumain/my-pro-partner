"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { useSallesFitness } from "@/hooks/use-fitness";
import { TYPE_SALLE_LABELS, type TypeSalleFitness } from "@/lib/types/fitness";
import { Crown, DoorOpen, Dumbbell, Plus, SquareM, Users } from "lucide-react";
import { useState } from "react";

export default function SallesPage() {
    const [typeFilter, setTypeFilter] = useState<TypeSalleFitness | "ALL">(
        "ALL"
    );

    const { data: salles, isLoading } = useSallesFitness({
        type: typeFilter === "ALL" ? undefined : typeFilter,
        actif: true,
    });

    return (
        <RouteGuard capability="salles_fitness">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Salles & Zones"
                    description="Gérez les espaces de votre salle de sport"
                    actions={
                        <PrimaryActionButton>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvelle salle
                        </PrimaryActionButton>
                    }
                />

                {/* Filtre */}
                <div className="flex gap-3">
                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(value as TypeSalleFitness | "ALL")
                        }
                    >
                        <SelectTrigger className="w-[200px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Type de salle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les types</SelectItem>
                            {Object.entries(TYPE_SALLE_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Liste des salles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[180px] rounded-xl"
                            />
                        ))
                    ) : salles && salles.length > 0 ? (
                        salles.map((salle) => (
                            <Card
                                key={salle.id}
                                className="border-black/8 hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                            >
                                <div
                                    className="h-2"
                                    style={{
                                        backgroundColor:
                                            salle.couleur || "#000",
                                    }}
                                />
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-[16px] font-semibold text-black flex items-center gap-2">
                                                {salle.nom}
                                                {salle.premium && (
                                                    <Crown
                                                        className="w-4 h-4 text-yellow-500"
                                                        strokeWidth={2}
                                                    />
                                                )}
                                            </h3>
                                            <Badge
                                                variant="secondary"
                                                className="mt-1 bg-black/5 text-black/60 border-0"
                                            >
                                                {TYPE_SALLE_LABELS[salle.type]}
                                            </Badge>
                                        </div>
                                    </div>

                                    {salle.description && (
                                        <p className="text-[13px] text-black/50 mb-4 line-clamp-2">
                                            {salle.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 text-[13px] text-black/60">
                                        {salle.capacite > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Users
                                                    className="w-3.5 h-3.5"
                                                    strokeWidth={2}
                                                />
                                                <span>
                                                    Capacité: {salle.capacite}{" "}
                                                    personnes
                                                </span>
                                            </div>
                                        )}
                                        {salle.surface && (
                                            <div className="flex items-center gap-2">
                                                <SquareM
                                                    className="w-3.5 h-3.5"
                                                    strokeWidth={2}
                                                />
                                                <span>{salle.surface} m²</span>
                                            </div>
                                        )}
                                        {salle.equipements && (
                                            <div className="flex items-center gap-2">
                                                <Dumbbell
                                                    className="w-3.5 h-3.5"
                                                    strokeWidth={2}
                                                />
                                                <span className="line-clamp-1">
                                                    {salle.equipements}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {salle._count && (
                                        <div className="mt-4 pt-3 border-t border-black/5 flex gap-4 text-[12px] text-black/40">
                                            <span>
                                                {salle._count.cours} cours
                                            </span>
                                            <span>
                                                {salle._count.seances} séances
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <EmptyState
                                icon={DoorOpen}
                                title="Aucune salle"
                                description="Configurez les espaces de votre salle de sport"
                                action={{
                                    label: "Nouvelle salle",
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

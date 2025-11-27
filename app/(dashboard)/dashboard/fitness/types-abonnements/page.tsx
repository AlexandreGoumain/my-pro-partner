"use client";

import { CreateTypeAbonnementDialog } from "@/components/fitness/create-type-abonnement-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useTypesAbonnements } from "@/hooks/use-fitness";
import {
    PERIODICITE_LABELS,
    type PeriodiciteFitness,
} from "@/lib/types/fitness";
import { formatCurrency } from "@/lib/utils/format";
import {
    Calendar,
    CreditCard,
    Crown,
    Dumbbell,
    GripVertical,
    Infinity,
    Plus,
    Users,
} from "lucide-react";
import { useState } from "react";

export default function TypesAbonnementsPage() {
    const [showInactifs, setShowInactifs] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: types, isLoading } = useTypesAbonnements({
        actif: showInactifs ? undefined : true,
    });

    const getPeriodiciteIcon = (periodicite: PeriodiciteFitness) => {
        if (periodicite === "ILLIMITE") {
            return <Infinity className="w-3.5 h-3.5" strokeWidth={2} />;
        }
        return <Calendar className="w-3.5 h-3.5" strokeWidth={2} />;
    };

    return (
        <RouteGuard capability="abonnements_fitness">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Types d'abonnements"
                    description="Gérez vos formules et tarifs"
                    actions={
                        <PrimaryActionButton
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvelle formule
                        </PrimaryActionButton>
                    }
                />

                {/* Filtres */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="show-inactifs"
                            checked={showInactifs}
                            onCheckedChange={setShowInactifs}
                        />
                        <label
                            htmlFor="show-inactifs"
                            className="text-[13px] text-black/60 cursor-pointer"
                        >
                            Afficher les formules inactives
                        </label>
                    </div>
                </div>

                {/* Liste des types */}
                <div className="space-y-3">
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[140px] rounded-xl"
                            />
                        ))
                    ) : types && types.length > 0 ? (
                        types.map((type) => (
                            <Card
                                key={type.id}
                                className={`border-black/8 hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer ${
                                    !type.actif ? "opacity-50" : ""
                                }`}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Drag handle */}
                                        <div className="pt-1 cursor-grab">
                                            <GripVertical
                                                className="w-4 h-4 text-black/20"
                                                strokeWidth={2}
                                            />
                                        </div>

                                        {/* Color indicator */}
                                        <div
                                            className="w-1.5 h-full min-h-[100px] rounded-full"
                                            style={{
                                                backgroundColor:
                                                    type.couleur || "#000",
                                            }}
                                        />

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-[16px] font-semibold text-black flex items-center gap-2">
                                                        {type.nom}
                                                        {type.accesZonesPremium && (
                                                            <Crown
                                                                className="w-4 h-4 text-yellow-500"
                                                                strokeWidth={2}
                                                            />
                                                        )}
                                                        {!type.actif && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-black/5 text-black/40 border-0"
                                                            >
                                                                Inactif
                                                            </Badge>
                                                        )}
                                                    </h3>
                                                    {type.description && (
                                                        <p className="text-[13px] text-black/50 mt-1 line-clamp-2">
                                                            {type.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Prix */}
                                                <div className="text-right">
                                                    <p className="text-[24px] font-bold text-black tracking-tight">
                                                        {formatCurrency(
                                                            type.prix
                                                        )}
                                                    </p>
                                                    <p className="text-[12px] text-black/40">
                                                        {
                                                            PERIODICITE_LABELS[
                                                                type.periodicite
                                                            ]
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-4 text-[13px] text-black/60">
                                                <div className="flex items-center gap-2">
                                                    {getPeriodiciteIcon(
                                                        type.periodicite
                                                    )}
                                                    {type.accesIllimite ? (
                                                        <span>
                                                            Accès illimité
                                                        </span>
                                                    ) : type.nombreSeances ? (
                                                        <span>
                                                            {type.nombreSeances}{" "}
                                                            séances
                                                        </span>
                                                    ) : type.nombreAccesSemaine ? (
                                                        <span>
                                                            {
                                                                type.nombreAccesSemaine
                                                            }
                                                            x / semaine
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            {type.dureeJours}{" "}
                                                            jours
                                                        </span>
                                                    )}
                                                </div>

                                                {type.accesCours && (
                                                    <div className="flex items-center gap-2">
                                                        <Dumbbell
                                                            className="w-3.5 h-3.5"
                                                            strokeWidth={2}
                                                        />
                                                        <span>
                                                            Cours inclus
                                                        </span>
                                                    </div>
                                                )}

                                                {type.engagementMois > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar
                                                            className="w-3.5 h-3.5"
                                                            strokeWidth={2}
                                                        />
                                                        <span>
                                                            Engagement{" "}
                                                            {
                                                                type.engagementMois
                                                            }{" "}
                                                            mois
                                                        </span>
                                                    </div>
                                                )}

                                                {type.fraisInscription > 0 && (
                                                    <span className="text-black/40">
                                                        +{" "}
                                                        {formatCurrency(
                                                            type.fraisInscription
                                                        )}{" "}
                                                        frais d&apos;inscription
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            {type._count && (
                                                <div className="mt-4 pt-3 border-t border-black/5">
                                                    <div className="flex items-center gap-2 text-[12px] text-black/40">
                                                        <Users
                                                            className="w-3.5 h-3.5"
                                                            strokeWidth={2}
                                                        />
                                                        <span>
                                                            {
                                                                type._count
                                                                    .abonnements
                                                            }{" "}
                                                            abonnés actifs
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <EmptyState
                            icon={CreditCard}
                            title="Aucune formule"
                            description="Créez vos premières formules d'abonnement"
                            action={{
                                label: "Nouvelle formule",
                                onClick: () => setCreateDialogOpen(true),
                                icon: Plus,
                            }}
                            variant="dashed"
                        />
                    )}
                </div>

                {/* Dialog de création */}
                <CreateTypeAbonnementDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                />
            </div>
        </RouteGuard>
    );
}

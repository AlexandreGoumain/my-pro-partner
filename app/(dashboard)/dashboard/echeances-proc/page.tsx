"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataStateRenderer } from "@/components/ui/data-state-renderer";
import { NoAccessState } from "@/components/ui/no-access-state";
import { PageHeader } from "@/components/ui/page-header";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StatsGrid } from "@/components/ui/stats-grid";
import { useCapabilities } from "@/hooks/use-capabilities";
import { useEcheancesProc } from "@/hooks/use-echeances-proc";
import {
    STATUT_ECHEANCE_PROCEDURALE_COLORS,
    STATUT_ECHEANCE_PROCEDURALE_LABELS,
    TYPE_ECHEANCE_PROCEDURALE,
    TYPE_ECHEANCE_PROCEDURALE_LABELS,
    type EcheanceProceduraleFilters,
    type TypeEcheanceProcedurale,
} from "@/lib/types/juridique";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Calendar,
    CalendarClock,
    Clock,
    Gavel,
    MapPin,
    Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EcheancesProcPage() {
    const router = useRouter();
    const { hasCapability } = useCapabilities();

    // Check capability
    const hasAccess = hasCapability("projets");

    // State
    const [filters, setFilters] = useState<
        EcheanceProceduraleFilters & { periode?: string }
    >({ periode: "avenir" });

    // Data
    const { data, isLoading, error } = useEcheancesProc(
        hasAccess ? filters : undefined,
        { enabled: hasAccess }
    );

    const echeances = data?.echeances || [];
    const stats = data?.stats || {
        cetteSemaine: 0,
        enRetard: 0,
        audiencesCeMois: 0,
    };

    // Filter handlers
    const handlePeriodeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            periode: value === "ALL" ? undefined : value,
        }));
    };

    const handleTypeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            type:
                value === "ALL"
                    ? undefined
                    : (value as TypeEcheanceProcedurale),
        }));
    };

    if (!hasAccess) {
        return <NoAccessState icon={CalendarClock} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Échéances procédurales"
                description="Suivez vos audiences, délais et échéances importantes"
                actions={
                    <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle échéance
                    </Button>
                }
            />

            {/* Stats */}
            <StatsGrid
                stats={[
                    {
                        icon: Clock,
                        label: "Cette semaine",
                        value: stats.cetteSemaine,
                    },
                    {
                        icon: AlertCircle,
                        label: "En retard",
                        value: stats.enRetard,
                        iconBgClassName: "bg-red-50",
                        iconClassName: "text-red-500",
                        valueClassName: "text-red-600",
                    },
                    {
                        icon: Gavel,
                        label: "Audiences ce mois",
                        value: stats.audiencesCeMois,
                    },
                ]}
                columns={3}
            />

            {/* Filters */}
            <div className="flex items-center gap-4">
                <Select
                    value={filters.periode || "ALL"}
                    onValueChange={handlePeriodeChange}
                >
                    <SelectTrigger className="w-[180px] h-10 border-black/10">
                        <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Toutes</SelectItem>
                        <SelectItem value="avenir">À venir</SelectItem>
                        <SelectItem value="semaine">Cette semaine</SelectItem>
                        <SelectItem value="mois">Ce mois</SelectItem>
                        <SelectItem value="passe">Passées</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-[200px] h-10 border-black/10">
                        <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les types</SelectItem>
                        {TYPE_ECHEANCE_PROCEDURALE.map((type) => (
                            <SelectItem key={type} value={type}>
                                {TYPE_ECHEANCE_PROCEDURALE_LABELS[type]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Content */}
            <DataStateRenderer
                isLoading={isLoading}
                error={error}
                data={echeances}
                errorMessage="Erreur lors du chargement des échéances"
                emptyState={{
                    icon: CalendarClock,
                    title: "Aucune échéance",
                    description:
                        "Aucune échéance procédurale pour cette période",
                }}
            >
                {(data) => (
                    <div className="space-y-3">
                        {data.map((echeance) => {
                            const dateEcheance = new Date(
                                echeance.dateEcheance
                            );
                            const isOverdue =
                                dateEcheance < new Date() &&
                                !["EFFECTUEE", "ANNULEE"].includes(
                                    echeance.statut
                                );

                            return (
                                <Card
                                    key={echeance.id}
                                    className={cn(
                                        "p-4 border-black/8 hover:border-black/15 transition-colors cursor-pointer",
                                        isOverdue &&
                                            "border-red-200 bg-red-50/30"
                                    )}
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/affaires/${echeance.affaireId}`
                                        )
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
                                                        TYPE_ECHEANCE_PROCEDURALE_LABELS[
                                                            echeance.type
                                                        ]
                                                    }
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] px-1.5 py-0",
                                                        STATUT_ECHEANCE_PROCEDURALE_COLORS[
                                                            echeance.statut
                                                        ]
                                                    )}
                                                >
                                                    {
                                                        STATUT_ECHEANCE_PROCEDURALE_LABELS[
                                                            echeance.statut
                                                        ]
                                                    }
                                                </Badge>
                                                {isOverdue && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] px-1.5 py-0 bg-red-50 text-red-600 border-red-200"
                                                    >
                                                        En retard
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-[15px] font-medium text-black mb-1">
                                                {echeance.libelle}
                                            </h3>
                                            <div className="flex items-center gap-3 text-[13px] text-black/50">
                                                <span className="font-mono text-black/40">
                                                    {
                                                        echeance.affaire
                                                            ?.reference
                                                    }
                                                </span>
                                                <span className="text-black/20">
                                                    •
                                                </span>
                                                <span>
                                                    {echeance.affaire?.intitule}
                                                </span>
                                                <span className="text-black/20">
                                                    •
                                                </span>
                                                <span>
                                                    {
                                                        echeance.affaire?.client
                                                            ?.nom
                                                    }
                                                </span>
                                            </div>
                                            {echeance.lieu && (
                                                <div className="flex items-center gap-1 mt-2 text-[12px] text-black/40">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{echeance.lieu}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-[12px] text-black/40">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {dateEcheance.toLocaleDateString(
                                                        "fr-FR",
                                                        {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "short",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            {echeance.heureDebut && (
                                                <div className="text-[14px] font-medium text-black mt-1">
                                                    {echeance.heureDebut}
                                                    {echeance.heureFin &&
                                                        ` - ${echeance.heureFin}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </DataStateRenderer>
        </div>
    );
}

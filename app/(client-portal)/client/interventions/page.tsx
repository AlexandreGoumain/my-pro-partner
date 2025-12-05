"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useClientInterventions } from "@/hooks/use-client-interventions";
import { InterventionCard } from "@/components/client/interventions/intervention-card";
import { EmptyState } from "@/components/ui/empty-state";

type StatusFilter = "all" | "active" | "completed";

export default function ClientInterventionsPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");

    // Fetch interventions based on filter
    const { data: interventions, isLoading, error } = useClientInterventions({
        active: statusFilter === "active",
    });

    // Filter completed interventions client-side if needed
    const filteredInterventions = interventions?.filter((intervention) => {
        if (statusFilter === "completed") {
            return ["TERMINEE", "FACTUREE"].includes(intervention.statut);
        }
        if (statusFilter === "active") {
            return !["TERMINEE", "FACTUREE", "ANNULEE"].includes(intervention.statut);
        }
        return true;
    });

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                    Mes interventions
                </h1>
                <p className="text-[14px] text-black/50 mt-1">
                    Suivez l'avancement de vos interventions
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 text-[13px] text-black/50">
                    <Filter className="w-4 h-4" />
                    <span>Afficher :</span>
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                >
                    <SelectTrigger className="w-[180px] h-9 text-[13px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">En cours</SelectItem>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="completed">Terminées</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-32 bg-black/5 animate-pulse rounded-lg"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-[14px] text-black/50">
                        Erreur lors du chargement des interventions
                    </p>
                </div>
            ) : filteredInterventions && filteredInterventions.length > 0 ? (
                <div className="space-y-3">
                    {filteredInterventions.map((intervention) => (
                        <InterventionCard
                            key={intervention.id}
                            intervention={intervention}
                            onClick={() => router.push(`/client/interventions/${intervention.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Wrench}
                    title={
                        statusFilter === "active"
                            ? "Aucune intervention en cours"
                            : statusFilter === "completed"
                            ? "Aucune intervention terminée"
                            : "Aucune intervention"
                    }
                    description={
                        statusFilter === "active"
                            ? "Vous n'avez pas d'intervention en cours pour le moment"
                            : "Vous n'avez pas encore d'interventions"
                    }
                />
            )}
        </div>
    );
}

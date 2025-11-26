"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PRIORITE_LABELS, TYPE_INTERVENTION_LABELS } from "@/lib/types/intervention";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

export interface InterventionNonPlanifiee {
    id: string;
    client: {
        nom: string;
        prenom?: string | null;
    };
    typeIntervention: string;
    priorite: string;
    description: string;
    adresse: string;
    codePostal: string;
    ville: string;
    dureeEstimeeH?: number | null;
    createdAt: string;
}

interface SelectInterventionsStepProps {
    interventions: InterventionNonPlanifiee[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    isLoading?: boolean;
}

export function SelectInterventionsStep({
    interventions,
    selectedIds,
    onSelectionChange,
    isLoading,
}: SelectInterventionsStepProps) {
    const [search, setSearch] = useState("");

    const filteredInterventions = useMemo(() => {
        if (!search) return interventions;
        const s = search.toLowerCase();
        return interventions.filter(
            (i) =>
                i.client.nom.toLowerCase().includes(s) ||
                i.client.prenom?.toLowerCase().includes(s) ||
                i.ville.toLowerCase().includes(s) ||
                i.description.toLowerCase().includes(s)
        );
    }, [interventions, search]);

    const toggleIntervention = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((i) => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const toggleAll = () => {
        if (selectedIds.length === filteredInterventions.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(filteredInterventions.map((i) => i.id));
        }
    };

    const getPrioriteColor = (priorite: string) => {
        switch (priorite) {
            case "URGENTE":
                return "text-red-600 bg-red-50";
            case "HAUTE":
                return "text-orange-600 bg-orange-50";
            case "NORMALE":
                return "text-black/60 bg-black/5";
            case "BASSE":
                return "text-black/40 bg-black/5";
            default:
                return "text-black/60 bg-black/5";
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">
                    Sélectionner les interventions
                </h3>
                <p className="text-[13px] text-black/50">
                    Choisissez les interventions à inclure dans cette tournée
                </p>
            </div>

            {/* Search & Select All */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <Input
                        placeholder="Rechercher par client, ville..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 pl-9"
                    />
                </div>
                <button
                    type="button"
                    onClick={toggleAll}
                    className="text-[13px] text-black/60 hover:text-black"
                >
                    {selectedIds.length === filteredInterventions.length
                        ? "Tout désélectionner"
                        : "Tout sélectionner"}
                </button>
            </div>

            {/* Selected count */}
            <div className="text-[13px] text-black/60">
                {selectedIds.length} intervention
                {selectedIds.length > 1 ? "s" : ""} sélectionnée
                {selectedIds.length > 1 ? "s" : ""}
            </div>

            {/* Interventions List */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {isLoading ? (
                    <div className="text-center py-8 text-black/40">
                        Chargement...
                    </div>
                ) : filteredInterventions.length === 0 ? (
                    <div className="text-center py-8 text-black/40">
                        Aucune intervention non planifiée
                    </div>
                ) : (
                    filteredInterventions.map((intervention) => {
                        const isSelected = selectedIds.includes(intervention.id);
                        return (
                            <div
                                key={intervention.id}
                                onClick={() => toggleIntervention(intervention.id)}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-all",
                                    isSelected
                                        ? "border-black bg-black/[0.02]"
                                        : "border-black/10 hover:border-black/20"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        checked={isSelected}
                                        className="mt-0.5"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[14px] font-medium text-black">
                                                {intervention.client.prenom}{" "}
                                                {intervention.client.nom}
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-[11px] font-medium px-2 py-0.5 rounded-full",
                                                    getPrioriteColor(
                                                        intervention.priorite
                                                    )
                                                )}
                                            >
                                                {PRIORITE_LABELS[
                                                    intervention.priorite as keyof typeof PRIORITE_LABELS
                                                ] || intervention.priorite}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-black/70 mb-2 line-clamp-1">
                                            {TYPE_INTERVENTION_LABELS[
                                                intervention.typeIntervention as keyof typeof TYPE_INTERVENTION_LABELS
                                            ] || intervention.typeIntervention}{" "}
                                            - {intervention.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-[12px] text-black/50">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {intervention.ville}
                                            </span>
                                            {intervention.dureeEstimeeH && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {intervention.dureeEstimeeH}h
                                                </span>
                                            )}
                                            {intervention.priorite ===
                                                "URGENTE" && (
                                                <span className="flex items-center gap-1 text-red-500">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Urgent
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

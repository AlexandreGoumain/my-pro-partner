"use client";

import { Button } from "@/components/ui/button";
import { InitialsBox } from "@/components/ui/icon-box";
import { Input } from "@/components/ui/input";
import { TYPE_INTERVENTION_LABELS } from "@/lib/types/intervention";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Clock, MapPin } from "lucide-react";
import type { InterventionNonPlanifiee } from "./select-interventions-step";

interface InterventionAvecHoraire extends InterventionNonPlanifiee {
    heureDebut: string;
}

interface OrganiserTourneeStepProps {
    interventions: InterventionAvecHoraire[];
    onReorder: (interventions: InterventionAvecHoraire[]) => void;
    onHeureChange: (id: string, heure: string) => void;
    heureDebutTournee: string;
}

export function OrganiserTourneeStep({
    interventions,
    onReorder,
    onHeureChange,
    heureDebutTournee,
}: OrganiserTourneeStepProps) {
    const moveUp = (index: number) => {
        if (index === 0) return;
        const newOrder = [...interventions];
        [newOrder[index - 1], newOrder[index]] = [
            newOrder[index],
            newOrder[index - 1],
        ];
        onReorder(newOrder);
    };

    const moveDown = (index: number) => {
        if (index === interventions.length - 1) return;
        const newOrder = [...interventions];
        [newOrder[index], newOrder[index + 1]] = [
            newOrder[index + 1],
            newOrder[index],
        ];
        onReorder(newOrder);
    };

    // Calculate total duration
    const totalDuration = interventions.reduce(
        (sum, i) => sum + (i.dureeEstimeeH || 1),
        0
    );

    const getPrioriteColor = (priorite: string) => {
        switch (priorite) {
            case "URGENTE":
                return "border-l-red-500";
            case "HAUTE":
                return "border-l-orange-500";
            default:
                return "border-l-black/20";
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">
                    Organiser la tournée
                </h3>
                <p className="text-[13px] text-black/50">
                    Ordonnez les interventions et définissez les horaires
                </p>
            </div>

            {/* Summary */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-black/[0.02] border border-black/10">
                <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-black/50">Interventions:</span>
                    <span className="font-medium">{interventions.length}</span>
                </div>
                <div className="w-px h-4 bg-black/10" />
                <div className="flex items-center gap-2 text-[13px]">
                    <Clock className="w-4 h-4 text-black/40" />
                    <span className="text-black/50">Durée totale:</span>
                    <span className="font-medium">{totalDuration}h</span>
                </div>
            </div>

            {/* Interventions Order */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {interventions.map((intervention, index) => (
                    <div
                        key={intervention.id}
                        className={cn(
                            "p-3 rounded-lg border border-black/10 bg-white border-l-4",
                            getPrioriteColor(intervention.priorite)
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {/* Order controls */}
                            <div className="flex flex-col gap-0.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                >
                                    <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => moveDown(index)}
                                    disabled={
                                        index === interventions.length - 1
                                    }
                                >
                                    <ArrowDown className="w-3 h-3" />
                                </Button>
                            </div>

                            {/* Order number */}
                            <InitialsBox
                                initials={String(index + 1)}
                                size="sm"
                                bgColor="bg-black"
                                textColor="text-white"
                            />

                            {/* Intervention info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[14px] font-medium">
                                        {intervention.client.prenom}{" "}
                                        {intervention.client.nom}
                                    </span>
                                    <span className="text-[12px] text-black/50">
                                        {TYPE_INTERVENTION_LABELS[
                                            intervention.typeIntervention as keyof typeof TYPE_INTERVENTION_LABELS
                                        ] || intervention.typeIntervention}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-[12px] text-black/50">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {intervention.ville}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {intervention.dureeEstimeeH || 1}h
                                    </span>
                                </div>
                            </div>

                            {/* Time input */}
                            <div className="flex items-center gap-2">
                                <Input
                                    type="time"
                                    value={intervention.heureDebut}
                                    onChange={(e) =>
                                        onHeureChange(
                                            intervention.id,
                                            e.target.value
                                        )
                                    }
                                    className="h-9 w-[100px]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {interventions.length === 0 && (
                <div className="text-center py-8 text-black/40">
                    Aucune intervention sélectionnée
                </div>
            )}
        </div>
    );
}

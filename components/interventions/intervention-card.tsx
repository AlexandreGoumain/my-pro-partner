"use client";

import {
    PRIORITE_LABELS,
    STATUT_LABELS,
    TYPE_INTERVENTION_ICONS,
    type PrioriteIntervention,
    type StatutIntervention,
    type TypeIntervention,
} from "@/lib/types/intervention";
import { MapPin } from "lucide-react";

interface InterventionWithRelations {
    id: string;
    numero: string;
    typeIntervention: TypeIntervention;
    priorite: PrioriteIntervention;
    statut: StatutIntervention;
    description: string;
    ville: string;
    datePrevisionnelle?: string | null;
    coutTotal: number;
    client: {
        prenom?: string | null;
        nom?: string | null;
    };
    plombier?: {
        name: string | null;
    } | null;
}

export interface InterventionCardProps {
    intervention: InterventionWithRelations;
    onClick?: () => void;
    getPriorityBadgeColor: (priorite: PrioriteIntervention) => string;
    getStatutBadgeColor: (statut: StatutIntervention) => string;
}

export function InterventionCard({
    intervention,
    onClick,
    getPriorityBadgeColor,
    getStatutBadgeColor,
}: InterventionCardProps) {
    return (
        <div
            onClick={onClick}
            className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="text-[24px]">
                        {TYPE_INTERVENTION_ICONS[intervention.typeIntervention]}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-[16px] font-semibold text-black">
                                {intervention.numero}
                            </h3>
                            <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${getPriorityBadgeColor(intervention.priorite)}`}
                            >
                                {PRIORITE_LABELS[intervention.priorite]}
                            </span>
                        </div>
                        <p className="text-[13px] text-black/60 mt-0.5">
                            {intervention.client.prenom || ""} {intervention.client.nom || ""}
                        </p>
                    </div>
                </div>
                <span
                    className={`px-3 py-1 rounded-lg text-[12px] font-medium ${getStatutBadgeColor(intervention.statut)}`}
                >
                    {STATUT_LABELS[intervention.statut]}
                </span>
            </div>

            <p className="text-[14px] text-black/70 mb-3 line-clamp-2">
                {intervention.description}
            </p>

            <div className="flex items-center justify-between text-[13px] text-black/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>{intervention.ville}</span>
                    </div>
                    {intervention.plombier && (
                        <div className="flex items-center gap-1.5">
                            <span>👤</span>
                            <span>{intervention.plombier.name}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {intervention.datePrevisionnelle && (
                        <span>
                            {new Date(
                                intervention.datePrevisionnelle
                            ).toLocaleDateString("fr-FR")}
                        </span>
                    )}
                    <span className="font-semibold text-black">
                        {intervention.coutTotal.toFixed(2)} €
                    </span>
                </div>
            </div>
        </div>
    );
}

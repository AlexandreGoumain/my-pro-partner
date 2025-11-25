"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PRIORITE_LABELS, type Intervention, type PrioriteIntervention } from "@/lib/types/intervention";
import { MapPin, GripVertical } from "lucide-react";

interface DraggableInterventionProps {
    intervention: Intervention & { dureeEstimeeH?: number };
    isDragging?: boolean;
}

export function DraggableIntervention({ intervention, isDragging }: DraggableInterventionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: intervention.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.5 : 1,
    };

    const getPriorityColor = (priorite: PrioriteIntervention) => {
        switch (priorite) {
            case "CRITIQUE":
                return "border-l-4 border-l-red-500 bg-red-50";
            case "URGENTE":
                return "border-l-4 border-l-orange-500 bg-orange-50";
            case "NORMALE":
                return "border-l-4 border-l-gray-300 bg-white";
        }
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-4 rounded-lg ${getPriorityColor(intervention.priorite)} hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${isDragging || isSortableDragging ? "shadow-lg ring-2 ring-black/20" : ""}`}
        >
            <div className="flex items-start gap-3">
                <div
                    {...attributes}
                    {...listeners}
                    className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing touch-none"
                >
                    <GripVertical className="w-4 h-4 text-black/30" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {intervention.datePrevisionnelle && (
                            <span className="text-[14px] font-semibold text-black">
                                {formatTime(intervention.datePrevisionnelle)}
                            </span>
                        )}
                        <span className="text-[13px] text-black/40">•</span>
                        <span className="text-[13px] text-black/60">
                            {intervention.numero}
                        </span>
                        <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                intervention.priorite === "CRITIQUE"
                                    ? "bg-red-200 text-red-800"
                                    : intervention.priorite === "URGENTE"
                                      ? "bg-orange-200 text-orange-800"
                                      : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {PRIORITE_LABELS[intervention.priorite]}
                        </span>
                        {intervention.dureeEstimeeH && (
                            <>
                                <span className="text-[13px] text-black/40">•</span>
                                <span className="text-[13px] text-black/50">
                                    {intervention.dureeEstimeeH}h
                                </span>
                            </>
                        )}
                    </div>
                    <p className="text-[14px] text-black mb-2 line-clamp-1">
                        {intervention.client.prenom} {intervention.client.nom} -{" "}
                        {intervention.description}
                    </p>
                    <div className="flex items-center gap-2 text-[13px] text-black/50">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                        <span className="truncate">
                            {intervention.adresse}, {intervention.ville}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
    key: string;
    label: string;
    description?: string;
}

interface InterventionTimelineProps {
    currentStatus: string;
    className?: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
    {
        key: "DEMANDE",
        label: "Demande reçue",
        description: "Votre demande a été enregistrée",
    },
    {
        key: "VALIDEE",
        label: "Validée",
        description: "La demande a été validée par notre équipe",
    },
    {
        key: "PLANIFIEE",
        label: "Planifiée",
        description: "Un rendez-vous a été fixé",
    },
    {
        key: "EN_ROUTE",
        label: "En route",
        description: "Le technicien est en chemin",
    },
    {
        key: "EN_COURS",
        label: "En cours",
        description: "L'intervention est en cours",
    },
    {
        key: "TERMINEE",
        label: "Terminée",
        description: "L'intervention est terminée",
    },
];

const STATUS_ORDER: Record<string, number> = {
    DEMANDE: 0,
    VALIDEE: 1,
    PLANIFIEE: 2,
    EN_ROUTE: 3,
    EN_COURS: 4,
    EN_ATTENTE_PIECES: 4,
    TERMINEE: 5,
    FACTUREE: 6,
    ANNULEE: -1,
};

export function InterventionTimeline({ currentStatus, className }: InterventionTimelineProps) {
    const currentIndex = STATUS_ORDER[currentStatus] ?? 0;
    const isCancelled = currentStatus === "ANNULEE";

    if (isCancelled) {
        return (
            <div className={cn("bg-black/[0.02] rounded-lg p-4", className)}>
                <p className="text-[14px] text-black/50">
                    Cette intervention a été annulée.
                </p>
            </div>
        );
    }

    return (
        <div className={cn("relative", className)}>
            {TIMELINE_STEPS.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isPending = index > currentIndex;

                return (
                    <div key={step.key} className="flex items-start gap-4 pb-6 last:pb-0">
                        {/* Line */}
                        {index < TIMELINE_STEPS.length - 1 && (
                            <div
                                className={cn(
                                    "absolute left-[11px] w-0.5 h-[calc(100%-24px)] top-6",
                                    index < currentIndex ? "bg-black" : "bg-black/10"
                                )}
                                style={{
                                    top: `${index * 72 + 24}px`,
                                    height: "48px",
                                }}
                            />
                        )}

                        {/* Dot */}
                        <div
                            className={cn(
                                "relative z-10 flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-all",
                                isCompleted && "bg-black",
                                isCurrent && "bg-black",
                                isPending && "bg-black/10"
                            )}
                        >
                            {isCompleted ? (
                                <Check className="w-3.5 h-3.5 text-white" />
                            ) : isCurrent ? (
                                <Circle className="w-2.5 h-2.5 text-white fill-white" />
                            ) : (
                                <Circle className="w-2.5 h-2.5 text-black/30" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                            <div
                                className={cn(
                                    "text-[14px] font-medium transition-all",
                                    isPending ? "text-black/30" : "text-black"
                                )}
                            >
                                {step.label}
                            </div>
                            {step.description && (
                                <div
                                    className={cn(
                                        "text-[13px] mt-0.5 transition-all",
                                        isPending ? "text-black/20" : "text-black/50"
                                    )}
                                >
                                    {step.description}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

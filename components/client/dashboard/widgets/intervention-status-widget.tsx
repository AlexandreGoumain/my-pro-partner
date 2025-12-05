"use client";

import { useRouter } from "next/navigation";
import { Wrench, ChevronRight, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ActiveIntervention {
    id: string;
    numero: string;
    typeIntervention: string;
    statut: string;
    priorite: string;
    datePrevisionnelle?: string;
    plombier?: {
        name: string;
    };
}

interface InterventionStatusWidgetProps {
    interventions: ActiveIntervention[];
    className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    DEMANDE: { label: "Demande reçue", className: "bg-black/5 text-black/60" },
    VALIDEE: { label: "Validée", className: "bg-black/10 text-black" },
    PLANIFIEE: { label: "Planifiée", className: "bg-black/10 text-black" },
    EN_ROUTE: { label: "En route", className: "bg-black text-white" },
    EN_COURS: { label: "En cours", className: "bg-black text-white" },
    EN_ATTENTE_PIECES: { label: "Attente pièces", className: "bg-black/10 text-black/70" },
};

export function InterventionStatusWidget({ interventions, className }: InterventionStatusWidgetProps) {
    const router = useRouter();

    return (
        <div className={cn("border border-black/8 rounded-lg p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-medium text-black">
                    Interventions en cours
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/client/interventions")}
                    className="text-[13px] text-black/50 hover:text-black"
                >
                    Voir tout
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {interventions.length > 0 ? (
                <div className="space-y-3">
                    {interventions.map((intervention) => {
                        const statusConfig = STATUS_CONFIG[intervention.statut] || STATUS_CONFIG.DEMANDE;
                        const isUrgent = intervention.priorite === "URGENTE" || intervention.priorite === "CRITIQUE";

                        return (
                            <button
                                key={intervention.id}
                                onClick={() => router.push(`/client/interventions/${intervention.id}`)}
                                className="w-full text-left p-3 bg-black/[0.02] rounded-lg hover:bg-black/[0.04] transition-all"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] font-medium text-black">
                                                {intervention.numero}
                                            </span>
                                            {isUrgent && (
                                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                            )}
                                        </div>
                                        <div className="text-[12px] text-black/50 mt-1 capitalize">
                                            {intervention.typeIntervention.toLowerCase().replace(/_/g, " ")}
                                        </div>
                                        {intervention.datePrevisionnelle && (
                                            <div className="flex items-center gap-1 text-[12px] text-black/40 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                Prévu le {format(new Date(intervention.datePrevisionnelle), "d MMM", { locale: fr })}
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap",
                                            statusConfig.className
                                        )}
                                    >
                                        {statusConfig.label}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-3 flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((step) => {
                                        const currentStep = {
                                            DEMANDE: 1,
                                            VALIDEE: 2,
                                            PLANIFIEE: 3,
                                            EN_ROUTE: 4,
                                            EN_COURS: 5,
                                            EN_ATTENTE_PIECES: 5,
                                        }[intervention.statut] || 1;

                                        return (
                                            <div
                                                key={step}
                                                className={cn(
                                                    "h-1 flex-1 rounded-full",
                                                    step <= currentStep ? "bg-black" : "bg-black/10"
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-6">
                    <Wrench className="w-8 h-8 text-black/20 mx-auto mb-2" />
                    <p className="text-[13px] text-black/40">
                        Aucune intervention en cours
                    </p>
                </div>
            )}
        </div>
    );
}

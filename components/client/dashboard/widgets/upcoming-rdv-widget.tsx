"use client";

import { useRouter } from "next/navigation";
import { Calendar, Clock, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface UpcomingRdv {
    id: string;
    date: string;
    heure: string;
    statut: string;
    prestation?: {
        nom: string;
        duree: number;
    };
    employe?: {
        prenom: string;
        nom: string;
    };
}

interface UpcomingRdvWidgetProps {
    rdvList: UpcomingRdv[];
    className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    EN_ATTENTE: { label: "En attente", className: "bg-black/5 text-black/60" },
    CONFIRME: { label: "Confirmé", className: "bg-black/10 text-black" },
};

export function UpcomingRdvWidget({ rdvList, className }: UpcomingRdvWidgetProps) {
    const router = useRouter();

    return (
        <div className={cn("border border-black/8 rounded-lg p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-medium text-black">
                    Prochains rendez-vous
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/client/rdv")}
                    className="text-[13px] text-black/50 hover:text-black"
                >
                    Voir tout
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {rdvList.length > 0 ? (
                <div className="space-y-3">
                    {rdvList.map((rdv) => {
                        const statusConfig = STATUS_CONFIG[rdv.statut] || STATUS_CONFIG.EN_ATTENTE;
                        const rdvDate = new Date(rdv.date);

                        return (
                            <button
                                key={rdv.id}
                                onClick={() => router.push(`/client/rdv/${rdv.id}`)}
                                className="w-full text-left p-3 bg-black/[0.02] rounded-lg hover:bg-black/[0.04] transition-all"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[14px] font-medium text-black truncate">
                                            {rdv.prestation?.nom || "Rendez-vous"}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-[12px] text-black/50">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(rdvDate, "EEE d MMM", { locale: fr })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {rdv.heure}
                                            </span>
                                        </div>
                                        {rdv.employe && (
                                            <div className="text-[12px] text-black/40 mt-1">
                                                avec {rdv.employe.prenom} {rdv.employe.nom}
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] font-medium px-2 py-0.5 rounded",
                                            statusConfig.className
                                        )}
                                    >
                                        {statusConfig.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-black/20 mx-auto mb-2" />
                    <p className="text-[13px] text-black/40 mb-3">
                        Aucun rendez-vous à venir
                    </p>
                    <Button
                        size="sm"
                        onClick={() => router.push("/client/rdv/nouveau")}
                        className="bg-black hover:bg-black/90 text-white"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Prendre RDV
                    </Button>
                </div>
            )}
        </div>
    );
}

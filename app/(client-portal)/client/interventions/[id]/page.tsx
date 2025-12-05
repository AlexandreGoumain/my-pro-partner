"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Wrench,
    User,
    FileText,
    AlertCircle,
    Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientInterventionDetail } from "@/hooks/use-client-interventions";
import { InterventionTimeline } from "@/components/client/interventions/intervention-timeline";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
    NORMALE: { label: "Normale", className: "text-black/40" },
    URGENTE: { label: "Urgente", className: "text-amber-600" },
    CRITIQUE: { label: "Critique", className: "text-red-600" },
};

export default function InterventionDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { data: intervention, isLoading, error } = useClientInterventionDetail(id);

    if (isLoading) {
        return (
            <div className="max-w-2xl">
                <div className="h-8 w-48 bg-black/5 animate-pulse rounded mb-8" />
                <div className="space-y-4">
                    <div className="h-32 bg-black/5 animate-pulse rounded-lg" />
                    <div className="h-64 bg-black/5 animate-pulse rounded-lg" />
                </div>
            </div>
        );
    }

    if (error || !intervention) {
        return (
            <div className="max-w-2xl">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/client/interventions")}
                    className="mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <div className="text-center py-12">
                    <p className="text-[14px] text-black/50">
                        Intervention non trouvée
                    </p>
                </div>
            </div>
        );
    }

    const priorityConfig = PRIORITY_CONFIG[intervention.priorite] || PRIORITY_CONFIG.NORMALE;

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/client/interventions")}
                    className="h-9 w-9"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                            {intervention.numero}
                        </h1>
                        {intervention.priorite !== "NORMALE" && (
                            <span className={cn("flex items-center gap-1 text-[12px] font-medium", priorityConfig.className)}>
                                <AlertCircle className="w-3 h-3" />
                                {priorityConfig.label}
                            </span>
                        )}
                    </div>
                    <p className="text-[13px] text-black/50 capitalize">
                        {intervention.typeIntervention.toLowerCase().replace(/_/g, " ")}
                    </p>
                </div>
            </div>

            {/* Status Timeline */}
            <div className="border border-black/8 rounded-lg p-5 mb-6">
                <h2 className="text-[14px] font-medium text-black mb-4">
                    Suivi de l'intervention
                </h2>
                <InterventionTimeline currentStatus={intervention.statut} />
            </div>

            {/* Details */}
            <div className="border border-black/8 rounded-lg p-5 mb-6">
                <h2 className="text-[14px] font-medium text-black mb-4">
                    Détails
                </h2>

                <div className="space-y-4">
                    {/* Description */}
                    <div>
                        <div className="text-[13px] text-black/50 mb-1">Description du problème</div>
                        <div className="text-[14px] text-black">
                            {intervention.description}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-black/60" />
                        </div>
                        <div>
                            <div className="text-[13px] text-black/50">Adresse</div>
                            <div className="text-[14px] text-black">
                                {intervention.adresse}
                                {intervention.complementAdresse && `, ${intervention.complementAdresse}`}
                            </div>
                            <div className="text-[14px] text-black">
                                {intervention.codePostal} {intervention.ville}
                            </div>
                        </div>
                    </div>

                    {/* Equipment */}
                    {intervention.equipement && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                                <Wrench className="w-4 h-4 text-black/60" />
                            </div>
                            <div>
                                <div className="text-[13px] text-black/50">Équipement</div>
                                <div className="text-[14px] text-black capitalize">
                                    {intervention.equipement.toLowerCase().replace(/_/g, " ")}
                                    {intervention.marqueEquipement && ` - ${intervention.marqueEquipement}`}
                                    {intervention.modeleEquipement && ` ${intervention.modeleEquipement}`}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-black/60" />
                        </div>
                        <div>
                            <div className="text-[13px] text-black/50">Dates</div>
                            <div className="text-[14px] text-black">
                                Demande le {format(new Date(intervention.dateDemande), "d MMMM yyyy", { locale: fr })}
                            </div>
                            {intervention.datePrevisionnelle && (
                                <div className="text-[14px] text-black">
                                    Prévu le {format(new Date(intervention.datePrevisionnelle), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                                </div>
                            )}
                            {intervention.dateFin && (
                                <div className="text-[14px] text-black/60">
                                    Terminé le {format(new Date(intervention.dateFin), "d MMMM yyyy", { locale: fr })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Duration */}
                    {(intervention.dureeEstimeeH || intervention.dureeReelleH) && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 text-black/60" />
                            </div>
                            <div>
                                <div className="text-[13px] text-black/50">Durée</div>
                                <div className="text-[14px] text-black">
                                    {intervention.dureeReelleH
                                        ? `${intervention.dureeReelleH}h (réalisé)`
                                        : `${intervention.dureeEstimeeH}h (estimé)`}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Technician */}
            {intervention.plombier && (
                <div className="border border-black/8 rounded-lg p-5 mb-6">
                    <h2 className="text-[14px] font-medium text-black mb-4">
                        Technicien assigné
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                            {intervention.plombier.image ? (
                                <img
                                    src={intervention.plombier.image}
                                    alt={intervention.plombier.name || ""}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-black/40" />
                            )}
                        </div>
                        <div>
                            <div className="text-[14px] font-medium text-black">
                                {intervention.plombier.name}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Diagnostic */}
            {intervention.diagnosticEffectue && intervention.diagnosticDetail && (
                <div className="border border-black/8 rounded-lg p-5 mb-6">
                    <h2 className="text-[14px] font-medium text-black mb-3">
                        Diagnostic
                    </h2>
                    <p className="text-[14px] text-black/70">
                        {intervention.diagnosticDetail}
                    </p>
                </div>
            )}

            {/* Work done */}
            {intervention.travailEffectue && (
                <div className="border border-black/8 rounded-lg p-5 mb-6">
                    <h2 className="text-[14px] font-medium text-black mb-3">
                        Travaux effectués
                    </h2>
                    <p className="text-[14px] text-black/70">
                        {intervention.travailEffectue}
                    </p>
                </div>
            )}

            {/* Warranty */}
            {intervention.garantieMois && (
                <div className="bg-black/[0.02] rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-black/60 flex-shrink-0 mt-0.5" />
                    <div>
                        <div className="text-[14px] font-medium text-black">
                            Garantie {intervention.garantieMois} mois
                        </div>
                        {intervention.dateFinGarantie && (
                            <div className="text-[13px] text-black/50">
                                Jusqu'au {format(new Date(intervention.dateFinGarantie), "d MMMM yyyy", { locale: fr })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Linked document */}
            {intervention.document && (
                <div className="border border-black/8 rounded-lg p-5 mb-6">
                    <h2 className="text-[14px] font-medium text-black mb-3">
                        Document associé
                    </h2>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-black/60" />
                            </div>
                            <div>
                                <div className="text-[14px] font-medium text-black">
                                    {intervention.document.type === "DEVIS" ? "Devis" : "Facture"} {intervention.document.numero}
                                </div>
                                <div className="text-[13px] text-black/50">
                                    {Number(intervention.document.totalTTC).toFixed(2)}€ TTC
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/client/documents/${intervention.document!.id}`)}
                        >
                            Voir
                        </Button>
                    </div>
                </div>
            )}

            {/* Cost */}
            {Number(intervention.coutTotal) > 0 && (
                <div className="bg-black/[0.02] rounded-lg p-5">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] text-black/60">Coût total</span>
                        <span className="text-[18px] font-semibold text-black">
                            {Number(intervention.coutTotal).toFixed(2)}€
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

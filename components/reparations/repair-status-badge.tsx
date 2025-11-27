"use client";

import { createStatusBadge } from "@/components/ui/status-badge";
import { type StatutReparation } from "@/lib/generated/prisma/client";

const REPAIR_STATUS_CONFIG: Record<
    StatutReparation,
    { label: string; className: string }
> = {
    DEPOSE: {
        label: "Déposé",
        className: "bg-black/5 text-black/60 border-black/10",
    },
    DIAGNOSTIC: {
        label: "En diagnostic",
        className: "bg-black/10 text-black/80 border-black/20",
    },
    DEVIS_ENVOYE: {
        label: "Devis envoyé",
        className: "bg-black/10 text-black/80 border-black/20",
    },
    ATTENTE_PIECES: {
        label: "Attente pièces",
        className: "bg-black/5 text-black/60 border-black/10",
    },
    EN_COURS: {
        label: "En cours",
        className: "bg-black/90 text-white border-black",
    },
    PRETE: { label: "Prête", className: "bg-black text-white border-black" },
    LIVREE: {
        label: "Livrée",
        className: "bg-black/10 text-black/60 border-black/10",
    },
    ANNULEE: {
        label: "Annulée",
        className: "bg-black/5 text-black/40 border-black/10",
    },
    ABANDONNEE: {
        label: "Abandonnée",
        className: "bg-black/5 text-black/40 border-black/10",
    },
};

const BaseRepairStatusBadge = createStatusBadge(REPAIR_STATUS_CONFIG);

interface RepairStatusBadgeProps {
    statut: StatutReparation;
    className?: string;
}

export function RepairStatusBadge({
    statut,
    className,
}: RepairStatusBadgeProps) {
    return <BaseRepairStatusBadge status={statut} className={className} />;
}

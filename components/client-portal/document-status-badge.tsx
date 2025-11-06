import { Badge } from "@/components/ui/badge";

interface DocumentStatusBadgeProps {
    statut: string;
}

const STATUT_COLORS: Record<string, string> = {
    BROUILLON: "bg-black/5 text-black/60",
    ENVOYE: "bg-black/10 text-black/80",
    ACCEPTE: "bg-black text-white",
    REFUSE: "bg-black/5 text-black/60",
    PAYE: "bg-black text-white",
    ANNULE: "bg-black/5 text-black/40",
};

const STATUT_LABELS: Record<string, string> = {
    BROUILLON: "Brouillon",
    ENVOYE: "Envoyé",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    PAYE: "Payé",
    ANNULE: "Annulé",
};

/**
 * Reusable document status badge component
 */
export function DocumentStatusBadge({ statut }: DocumentStatusBadgeProps) {
    const colorClass = STATUT_COLORS[statut] || "bg-black/5 text-black/60";
    const label = STATUT_LABELS[statut] || statut;

    return (
        <Badge className={`border-0 text-[11px] h-6 px-3 ${colorClass}`}>
            {label}
        </Badge>
    );
}

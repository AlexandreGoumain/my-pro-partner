import { createStatusBadge } from "@/components/ui/status-badge";

export type DocumentStatus =
    | "BROUILLON"
    | "ENVOYE"
    | "ACCEPTE"
    | "REFUSE"
    | "PAYE"
    | "ANNULE";

const DOCUMENT_STATUS_CONFIG: Record<
    DocumentStatus,
    { label: string; className: string }
> = {
    BROUILLON: {
        label: "Brouillon",
        className: "bg-black/5 text-black/60 border-black/10",
    },
    ENVOYE: {
        label: "Envoyé",
        className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    },
    ACCEPTE: {
        label: "Accepté",
        className: "bg-green-500/10 text-green-700 border-green-500/20",
    },
    REFUSE: {
        label: "Refusé",
        className: "bg-red-500/10 text-red-700 border-red-500/20",
    },
    PAYE: {
        label: "Payé",
        className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    },
    ANNULE: {
        label: "Annulé",
        className: "bg-black/5 text-black/40 border-black/10",
    },
};

const BaseDocumentStatusBadge = createStatusBadge(DOCUMENT_STATUS_CONFIG);

export interface DocumentStatusBadgeProps {
    status: DocumentStatus;
    className?: string;
}

export function DocumentStatusBadge({
    status,
    className,
}: DocumentStatusBadgeProps) {
    return <BaseDocumentStatusBadge status={status} className={className} />;
}

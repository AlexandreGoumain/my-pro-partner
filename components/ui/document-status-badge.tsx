import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DocumentStatus =
    | "BROUILLON"
    | "ENVOYE"
    | "ACCEPTE"
    | "REFUSE"
    | "PAYE"
    | "ANNULE";

export interface DocumentStatusBadgeProps {
    status: DocumentStatus;
    className?: string;
}

const statusConfig: Record<
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

export function DocumentStatusBadge({
    status,
    className,
}: DocumentStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge
            variant="outline"
            className={cn(
                "text-[12px] font-medium px-2.5 py-0.5 rounded-full",
                config.className,
                className
            )}
        >
            {config.label}
        </Badge>
    );
}

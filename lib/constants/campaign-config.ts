import {
    Calendar,
    Clock,
    Send,
    CheckCircle2,
    XCircle,
    Mail,
    MessageSquare,
    Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CampaignStatus =
    | "DRAFT"
    | "SCHEDULED"
    | "SENDING"
    | "SENT"
    | "CANCELLED";
export type CampaignType = "EMAIL" | "SMS" | "NOTIFICATION";

export interface StatusConfig {
    label: string;
    color: string;
    icon: LucideIcon;
}

export const STATUS_CONFIG: Record<CampaignStatus, StatusConfig> = {
    DRAFT: {
        label: "Brouillon",
        color: "bg-black/5 text-black/60",
        icon: Clock,
    },
    SCHEDULED: {
        label: "Planifiée",
        color: "bg-blue-500/10 text-blue-700",
        icon: Calendar,
    },
    SENDING: {
        label: "En cours",
        color: "bg-yellow-500/10 text-yellow-700",
        icon: Send,
    },
    SENT: {
        label: "Envoyée",
        color: "bg-green-500/10 text-green-700",
        icon: CheckCircle2,
    },
    CANCELLED: {
        label: "Annulée",
        color: "bg-red-500/10 text-red-700",
        icon: XCircle,
    },
};

export const TYPE_ICONS: Record<CampaignType, LucideIcon> = {
    EMAIL: Mail,
    SMS: MessageSquare,
    NOTIFICATION: Bell,
};

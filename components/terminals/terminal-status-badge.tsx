import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import type { Terminal } from "@/lib/types/pos";

interface TerminalStatusBadgeProps {
    status: Terminal["status"];
}

const STATUS_CONFIG = {
    ONLINE: {
        icon: Wifi,
        variant: "default" as const,
        label: "En ligne",
    },
    OFFLINE: {
        icon: WifiOff,
        variant: "secondary" as const,
        label: "Hors ligne",
    },
    BUSY: {
        icon: RefreshCw,
        variant: "default" as const,
        label: "Occupé",
    },
    ERROR: {
        icon: AlertCircle,
        variant: "destructive" as const,
        label: "Erreur",
    },
} as const;

export function TerminalStatusBadge({ status }: TerminalStatusBadgeProps) {
    const { icon: Icon, variant, label } = STATUS_CONFIG[status];

    return (
        <Badge variant={variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {label}
        </Badge>
    );
}

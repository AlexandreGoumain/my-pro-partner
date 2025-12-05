"use client";

import { useRouter } from "next/navigation";
import {
    Bell,
    Check,
    FileText,
    Calendar,
    Wrench,
    Gift,
    CreditCard,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientNotifications } from "@/hooks/use-client-notifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

// Map notification types to icons and routes
const NOTIFICATION_CONFIG: Record<
    string,
    { icon: typeof Bell; route?: string; color?: string; label: string }
> = {
    // Documents
    NOUVEAU_DOCUMENT: {
        icon: FileText,
        route: "/client/documents",
        label: "Document",
    },
    PAIEMENT_RECU: {
        icon: CreditCard,
        route: "/client/documents",
        label: "Paiement",
    },

    // Fidélité
    POINTS_EXPIRATION: {
        icon: Gift,
        route: "/client/fidelite",
        color: "text-amber-600",
        label: "Fidélité",
    },
    NIVEAU_FIDELITE: {
        icon: Gift,
        route: "/client/fidelite",
        label: "Fidélité",
    },

    // RDV
    RDV_CONFIRME: {
        icon: Calendar,
        route: "/client/rdv",
        label: "Rendez-vous",
    },
    RDV_RAPPEL: {
        icon: Calendar,
        route: "/client/rdv",
        color: "text-amber-600",
        label: "Rappel RDV",
    },
    RDV_ANNULE: {
        icon: Calendar,
        route: "/client/rdv",
        color: "text-red-500",
        label: "RDV annulé",
    },
    RDV_MODIFIE: {
        icon: Calendar,
        route: "/client/rdv",
        label: "RDV modifié",
    },

    // Interventions
    INTERVENTION_PLANIFIEE: {
        icon: Wrench,
        route: "/client/interventions",
        label: "Intervention",
    },
    INTERVENTION_EN_ROUTE: {
        icon: Wrench,
        route: "/client/interventions",
        label: "Intervention",
    },
    INTERVENTION_EN_COURS: {
        icon: Wrench,
        route: "/client/interventions",
        label: "Intervention",
    },
    INTERVENTION_TERMINEE: {
        icon: Wrench,
        route: "/client/interventions",
        label: "Intervention",
    },
    INTERVENTION_ANNULEE: {
        icon: Wrench,
        route: "/client/interventions",
        color: "text-red-500",
        label: "Intervention annulée",
    },

    // Réparations
    REPARATION_DEPOSEE: { icon: Wrench, label: "Réparation" },
    REPARATION_DIAGNOSTIC: { icon: Wrench, label: "Diagnostic" },
    REPARATION_PRETE: { icon: Wrench, label: "Réparation prête" },
    REPARATION_RETARD: {
        icon: Wrench,
        color: "text-amber-600",
        label: "Retard",
    },
    REPARATION_LIVREE: { icon: Wrench, label: "Réparation livrée" },

    // General
    GENERAL: { icon: Bell, label: "Notification" },
};

// Group notifications by date
function groupNotificationsByDate(
    notifications: Array<{
        id: string;
        type: string;
        titre: string;
        message?: string | null;
        lue: boolean;
        metadata?: Record<string, unknown>;
        createdAt: string;
    }>
) {
    const groups: Record<string, typeof notifications> = {};

    notifications.forEach((notification) => {
        const date = new Date(notification.createdAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let key: string;
        if (date.toDateString() === today.toDateString()) {
            key = "Aujourd'hui";
        } else if (date.toDateString() === yesterday.toDateString()) {
            key = "Hier";
        } else {
            key = format(date, "EEEE d MMMM", { locale: fr });
        }

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(notification);
    });

    return groups;
}

export default function ClientNotificationsPage() {
    const router = useRouter();
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
        useClientNotifications();

    const handleNotificationClick = async (
        notificationId: string,
        type: string,
        metadata?: Record<string, unknown>
    ) => {
        // Mark as read
        await markAsRead(notificationId);

        // Navigate to relevant page
        const config = NOTIFICATION_CONFIG[type];
        if (config?.route) {
            if (metadata?.rdvId && type.startsWith("RDV_")) {
                router.push(`/client/rdv/${metadata.rdvId}`);
            } else if (metadata?.interventionId && type.startsWith("INTERVENTION_")) {
                router.push(`/client/interventions/${metadata.interventionId}`);
            } else if (metadata?.documentId) {
                router.push(`/client/documents/${metadata.documentId}`);
            } else {
                router.push(config.route);
            }
        }
    };

    const groupedNotifications = groupNotificationsByDate(notifications);

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                        Notifications
                    </h1>
                    <p className="text-[14px] text-black/50 mt-1">
                        {unreadCount > 0
                            ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
                            : "Toutes vos notifications sont lues"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        onClick={markAllAsRead}
                        className="h-10 px-4 text-[13px] border-black/10"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-20 bg-black/5 animate-pulse rounded-lg"
                        />
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16 border border-black/8 rounded-lg">
                    <Bell className="w-12 h-12 text-black/20 mx-auto mb-4" />
                    <h3 className="text-[16px] font-medium text-black mb-2">
                        Aucune notification
                    </h3>
                    <p className="text-[14px] text-black/50">
                        Vous n'avez pas encore reçu de notifications
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedNotifications).map(([dateLabel, notifs]) => (
                        <div key={dateLabel}>
                            <h2 className="text-[13px] font-medium text-black/40 uppercase tracking-wide mb-3">
                                {dateLabel}
                            </h2>
                            <div className="space-y-2">
                                {notifs.map((notification) => {
                                    const config =
                                        NOTIFICATION_CONFIG[notification.type] ||
                                        NOTIFICATION_CONFIG.GENERAL;
                                    const Icon = config.icon;
                                    const hasLink = !!config.route;

                                    return (
                                        <button
                                            key={notification.id}
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification.id,
                                                    notification.type,
                                                    notification.metadata as Record<string, unknown>
                                                )
                                            }
                                            className={cn(
                                                "w-full text-left flex items-start gap-4 p-4 rounded-lg transition-all",
                                                notification.lue
                                                    ? "bg-white hover:bg-black/[0.02]"
                                                    : "bg-black/[0.03] hover:bg-black/[0.05]",
                                                hasLink && "cursor-pointer"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                                    notification.lue ? "bg-black/5" : "bg-black/10"
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "w-5 h-5",
                                                        config.color || "text-black/60"
                                                    )}
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p
                                                                className={cn(
                                                                    "text-[14px]",
                                                                    notification.lue
                                                                        ? "text-black/70"
                                                                        : "text-black font-medium"
                                                                )}
                                                            >
                                                                {notification.titre}
                                                            </p>
                                                            {!notification.lue && (
                                                                <span className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        {notification.message && (
                                                            <p className="text-[13px] text-black/50 mt-1">
                                                                {notification.message}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="text-[11px] text-black/30 px-2 py-0.5 bg-black/5 rounded">
                                                                {config.label}
                                                            </span>
                                                            <span className="text-[12px] text-black/30">
                                                                {formatDistanceToNow(
                                                                    new Date(notification.createdAt),
                                                                    { addSuffix: true, locale: fr }
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {hasLink && (
                                                        <ChevronRight className="w-5 h-5 text-black/20 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, FileText, Calendar, Wrench, Gift, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientNotifications } from "@/hooks/use-client-notifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// Map notification types to icons and routes
const NOTIFICATION_CONFIG: Record<string, { icon: typeof Bell; route?: string; color?: string }> = {
    // Documents
    NOUVEAU_DOCUMENT: { icon: FileText, route: "/client/documents" },
    PAIEMENT_RECU: { icon: CreditCard, route: "/client/documents" },

    // Fidélité
    POINTS_EXPIRATION: { icon: Gift, route: "/client/fidelite", color: "text-amber-600" },
    NIVEAU_FIDELITE: { icon: Gift, route: "/client/fidelite" },

    // RDV
    RDV_CONFIRME: { icon: Calendar, route: "/client/rdv" },
    RDV_RAPPEL: { icon: Calendar, route: "/client/rdv", color: "text-amber-600" },
    RDV_ANNULE: { icon: Calendar, route: "/client/rdv", color: "text-red-500" },
    RDV_MODIFIE: { icon: Calendar, route: "/client/rdv" },

    // Interventions
    INTERVENTION_PLANIFIEE: { icon: Wrench, route: "/client/interventions" },
    INTERVENTION_EN_ROUTE: { icon: Wrench, route: "/client/interventions" },
    INTERVENTION_EN_COURS: { icon: Wrench, route: "/client/interventions" },
    INTERVENTION_TERMINEE: { icon: Wrench, route: "/client/interventions" },
    INTERVENTION_ANNULEE: { icon: Wrench, route: "/client/interventions", color: "text-red-500" },

    // Réparations
    REPARATION_DEPOSEE: { icon: Wrench },
    REPARATION_DIAGNOSTIC: { icon: Wrench },
    REPARATION_PRETE: { icon: Wrench },
    REPARATION_RETARD: { icon: Wrench, color: "text-amber-600" },
    REPARATION_LIVREE: { icon: Wrench },

    // General
    GENERAL: { icon: Bell },
};

export function NotificationBell() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, refresh } =
        useClientNotifications();

    // Poll for new notifications every 30 seconds when dropdown is closed
    useEffect(() => {
        if (isOpen) return;

        const interval = setInterval(() => {
            refresh();
        }, 30000);

        return () => clearInterval(interval);
    }, [isOpen, refresh]);

    // Refresh when opening dropdown
    const handleOpenChange = useCallback(
        (open: boolean) => {
            setIsOpen(open);
            if (open) {
                refresh();
            }
        },
        [refresh]
    );

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
            // If we have a specific ID in metadata, navigate to detail page
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

        setIsOpen(false);
    };

    const displayedNotifications = notifications.slice(0, 5);

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full"
                >
                    <Bell className="h-5 w-5 text-black/60" strokeWidth={2} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-black text-white text-[10px] font-medium flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="text-[14px] font-medium">Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                markAllAsRead();
                            }}
                            className="h-7 text-[12px] text-black/50 hover:text-black"
                        >
                            <Check className="w-3 h-3 mr-1" />
                            Tout marquer lu
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isLoading ? (
                    <div className="p-4 text-center">
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
                    </div>
                ) : displayedNotifications.length === 0 ? (
                    <div className="p-6 text-center">
                        <Bell className="w-8 h-8 text-black/20 mx-auto mb-2" />
                        <p className="text-[13px] text-black/40">
                            Aucune notification
                        </p>
                    </div>
                ) : (
                    <>
                        {displayedNotifications.map((notification) => {
                            const config = NOTIFICATION_CONFIG[notification.type] || NOTIFICATION_CONFIG.GENERAL;
                            const Icon = config.icon;

                            return (
                                <DropdownMenuItem
                                    key={notification.id}
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification.id,
                                            notification.type,
                                            notification.metadata as Record<string, unknown>
                                        )
                                    }
                                    className={cn(
                                        "flex items-start gap-3 p-3 cursor-pointer",
                                        !notification.lue && "bg-black/[0.02]"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                            notification.lue ? "bg-black/5" : "bg-black/10"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "w-4 h-4",
                                                config.color || "text-black/60"
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p
                                                className={cn(
                                                    "text-[13px] leading-tight",
                                                    notification.lue
                                                        ? "text-black/60"
                                                        : "text-black font-medium"
                                                )}
                                            >
                                                {notification.titre}
                                            </p>
                                            {!notification.lue && (
                                                <span className="w-2 h-2 rounded-full bg-black flex-shrink-0 mt-1" />
                                            )}
                                        </div>
                                        {notification.message && (
                                            <p className="text-[12px] text-black/40 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                        )}
                                        <p className="text-[11px] text-black/30 mt-1">
                                            {formatDistanceToNow(new Date(notification.createdAt), {
                                                addSuffix: true,
                                                locale: fr,
                                            })}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}

                        {notifications.length > 5 && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        router.push("/client/notifications");
                                        setIsOpen(false);
                                    }}
                                    className="justify-center text-[13px] text-black/50 hover:text-black"
                                >
                                    Voir toutes les notifications
                                </DropdownMenuItem>
                            </>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

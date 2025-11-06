import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface Notification {
    id: string;
    type: string;
    titre: string;
    message?: string | null;
    lue: boolean;
    metadata?: any;
    createdAt: string;
    lueAt?: string | null;
}

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refresh: () => Promise<void>;
}

/**
 * Custom hook for managing client notifications
 */
export function useNotifications(): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch("/api/client/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch notifications");

            const data = await res.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Erreur lors du chargement des notifications");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = useCallback(
        async (notificationId: string) => {
            try {
                const token = localStorage.getItem("clientToken");
                if (!token) return;

                const res = await fetch(`/api/client/notifications/${notificationId}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to mark as read");

                // Update local state
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === notificationId
                            ? { ...notif, lue: true, lueAt: new Date().toISOString() }
                            : notif
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
                toast.error("Erreur lors de la mise à jour");
            }
        },
        []
    );

    const markAllAsRead = useCallback(async () => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch("/api/client/notifications", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to mark all as read");

            // Update local state
            setNotifications((prev) =>
                prev.map((notif) => ({
                    ...notif,
                    lue: true,
                    lueAt: new Date().toISOString(),
                }))
            );
            setUnreadCount(0);

            toast.success("Toutes les notifications ont été marquées comme lues");
        } catch (error) {
            console.error("Failed to mark all as read:", error);
            toast.error("Erreur lors de la mise à jour");
        }
    }, []);

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    };
}

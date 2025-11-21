import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Notification {
    id: string;
    type: string;
    titre: string;
    message?: string | null;
    lue: boolean;
    metadata?: Record<string, unknown>;
    createdAt: string;
    lueAt?: string | null;
}

interface NotificationsResponse {
    notifications: Notification[];
    unreadCount: number;
}

/**
 * Query keys pour les notifications client
 */
export const notificationKeys = {
    all: ["client-notifications"] as const,
    list: () => ["client-notifications", "list"] as const,
    unreadCount: () => ["client-notifications", "unread-count"] as const,
};

/**
 * Fonction helper pour récupérer le token client
 */
function getClientToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("clientToken");
}

/**
 * Hook pour récupérer les notifications du client
 * Utilise React Query avec cache automatique
 */
export function useNotifications() {
    return useQuery({
        queryKey: notificationKeys.list(),
        queryFn: async (): Promise<NotificationsResponse> => {
            const token = getClientToken();
            if (!token) {
                throw new Error("No client token found");
            }

            const res = await fetch("/api/client/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }

            return res.json();
        },
        enabled: !!getClientToken(), // Ne lance la requête que si le token existe
        // Rafraîchit automatiquement toutes les 30 secondes pour les nouvelles notifications
        refetchInterval: 30000,
        staleTime: 10000, // Considère les données comme fraîches pendant 10s
    });
}

/**
 * Hook pour récupérer seulement le nombre de notifications non lues
 * Optimisé pour les indicateurs de badge
 */
export function useUnreadCount() {
    const { data } = useNotifications();
    return data?.unreadCount ?? 0;
}

/**
 * Hook pour marquer une notification comme lue
 * Invalide automatiquement le cache après mutation
 */
export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationId: string) => {
            const token = getClientToken();
            if (!token) {
                throw new Error("No client token found");
            }

            const res = await fetch(
                `/api/client/notifications/${notificationId}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to mark as read");
            }

            return res.json();
        },
        // Optimistic update : met à jour le cache immédiatement
        onMutate: async (notificationId) => {
            // Annule les requêtes en cours pour éviter les conflits
            await queryClient.cancelQueries({
                queryKey: notificationKeys.list(),
            });

            // Sauvegarde l'état précédent pour rollback en cas d'erreur
            const previousData =
                queryClient.getQueryData<NotificationsResponse>(
                    notificationKeys.list()
                );

            // Met à jour optimistiquement le cache
            if (previousData) {
                queryClient.setQueryData<NotificationsResponse>(
                    notificationKeys.list(),
                    {
                        ...previousData,
                        notifications: previousData.notifications.map(
                            (notif) =>
                                notif.id === notificationId
                                    ? {
                                          ...notif,
                                          lue: true,
                                          lueAt: new Date().toISOString(),
                                      }
                                    : notif
                        ),
                        unreadCount: Math.max(0, previousData.unreadCount - 1),
                    }
                );
            }

            return { previousData };
        },
        // En cas d'erreur, rollback vers l'état précédent
        onError: (error, _, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    notificationKeys.list(),
                    context.previousData
                );
            }
            console.error("Failed to mark notification as read:", error);
            toast.error("Erreur lors de la mise à jour");
        },
        // En cas de succès, invalide le cache pour être sûr d'avoir les bonnes données
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}

/**
 * Hook pour marquer toutes les notifications comme lues
 * Invalide automatiquement le cache après mutation
 */
export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const token = getClientToken();
            if (!token) {
                throw new Error("No client token found");
            }

            const res = await fetch("/api/client/notifications", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to mark all as read");
            }

            return res.json();
        },
        // Optimistic update : met à jour le cache immédiatement
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: notificationKeys.list(),
            });

            const previousData =
                queryClient.getQueryData<NotificationsResponse>(
                    notificationKeys.list()
                );

            if (previousData) {
                queryClient.setQueryData<NotificationsResponse>(
                    notificationKeys.list(),
                    {
                        ...previousData,
                        notifications: previousData.notifications.map(
                            (notif) => ({
                                ...notif,
                                lue: true,
                                lueAt: new Date().toISOString(),
                            })
                        ),
                        unreadCount: 0,
                    }
                );
            }

            return { previousData };
        },
        onError: (error, _, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    notificationKeys.list(),
                    context.previousData
                );
            }
            console.error("Failed to mark all as read:", error);
            toast.error("Erreur lors de la mise à jour");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
            toast.success(
                "Toutes les notifications ont été marquées comme lues"
            );
        },
    });
}

/**
 * Hook tout-en-un pour compatibilité avec l'ancien code
 * @deprecated Utilisez les hooks individuels pour plus de flexibilité
 */
export function useNotificationsLegacy() {
    const { data, isLoading, refetch } = useNotifications();
    const markAsReadMutation = useMarkNotificationAsRead();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();

    return {
        notifications: data?.notifications ?? [],
        unreadCount: data?.unreadCount ?? 0,
        isLoading,
        markAsRead: async (notificationId: string) => {
            await markAsReadMutation.mutateAsync(notificationId);
        },
        markAllAsRead: async () => {
            await markAllAsReadMutation.mutateAsync();
        },
        refresh: async () => {
            await refetch();
        },
    };
}

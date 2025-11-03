import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { NotificationPreferences } from "@/lib/types/settings";

// Query Keys
export const notificationSettingsKeys = {
    all: ["notification-settings"] as const,
};

// Hook pour récupérer les préférences de notification
export function useNotificationSettings() {
    return useQuery({
        queryKey: notificationSettingsKeys.all,
        queryFn: async () => {
            const result = await api.get<{ notifications: NotificationPreferences }>("/api/settings/notifications");
            return result.notifications;
        },
    });
}

// Hook pour mettre à jour les préférences de notification
export function useUpdateNotificationSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notifications: NotificationPreferences) =>
            api.put<{ notifications: NotificationPreferences }>("/api/settings/notifications", notifications),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationSettingsKeys.all });
        },
    });
}

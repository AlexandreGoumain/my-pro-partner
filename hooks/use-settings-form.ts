import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    useCompanySettings,
    useUpdateCompanySettings,
} from "@/hooks/use-company-settings";
import {
    useNotificationSettings,
    useUpdateNotificationSettings,
} from "@/hooks/use-notification-settings";
import type {
    CompanySettings,
    NotificationSettings,
    PreferencesSettings,
} from "@/lib/types/settings";

interface UseSettingsFormReturn {
    settings: CompanySettings;
    notifications: NotificationSettings;
    preferences: PreferencesSettings;
    isLoading: boolean;
    isSaving: boolean;
    handleSettingsChange: (field: string, value: string) => void;
    handleNotificationsChange: (field: string, value: boolean) => void;
    handlePreferencesChange: (field: string, value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook for managing settings form
 * Handles company settings, notifications, and preferences
 *
 * @returns Settings data and handlers
 */
export function useSettingsForm(): UseSettingsFormReturn {
    const { data: companyData, isLoading: isLoadingCompany } = useCompanySettings();
    const { data: notificationData, isLoading: isLoadingNotifications } = useNotificationSettings();
    const updateCompany = useUpdateCompanySettings();
    const updateNotifications = useUpdateNotificationSettings();

    const isLoading = isLoadingCompany || isLoadingNotifications;
    const isSaving = updateCompany.isPending || updateNotifications.isPending;

    // Local state for form (synchronized with React Query data)
    const [settings, setSettings] = useState<CompanySettings>({
        nom_entreprise: "",
    });

    const [notifications, setNotifications] = useState<NotificationSettings>({
        email_nouveau_client: true,
        email_document_cree: false,
        email_document_paye: true,
        email_stock_bas: true,
        email_rapport_hebdomadaire: false,
    });

    const [preferences, setPreferences] = useState<PreferencesSettings>({
        langue: "fr",
        timezone: "Europe/Paris",
        devise: "EUR",
        format_nombre: "fr",
        format_date: "DD/MM/YYYY",
        premier_jour: "lundi",
    });

    // Synchronize local state with React Query data
    useEffect(() => {
        if (companyData) {
            setSettings(companyData);
        }
    }, [companyData]);

    useEffect(() => {
        if (notificationData) {
            // Extract only notification-related fields
            setNotifications({
                email_nouveau_client: notificationData.email_nouveau_client,
                email_document_cree: notificationData.email_document_cree,
                email_document_paye: notificationData.email_document_paye,
                email_stock_bas: notificationData.email_stock_bas,
                email_rapport_hebdomadaire: notificationData.email_rapport_hebdomadaire,
            });
        }
    }, [notificationData]);

    const handleSettingsChange = (field: string, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleNotificationsChange = (field: string, value: boolean) => {
        setNotifications((prev) => ({ ...prev, [field]: value }));
    };

    const handlePreferencesChange = (field: string, value: string) => {
        setPreferences((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Save company settings and notifications in parallel
            await Promise.all([
                updateCompany.mutateAsync(settings),
                updateNotifications.mutateAsync(notifications as any),
            ]);

            toast.success("Paramètres enregistrés avec succès");
        } catch (error: unknown) {
            console.error("[Settings Form] Error saving settings:", error);
            toast.error(
                (error as Error).message || "Impossible d'enregistrer les paramètres"
            );
        }
    };

    return {
        settings,
        notifications,
        preferences,
        isLoading,
        isSaving,
        handleSettingsChange,
        handleNotificationsChange,
        handlePreferencesChange,
        handleSubmit,
    };
}

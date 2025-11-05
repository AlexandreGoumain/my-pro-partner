"use client";

import { SettingsContentWrapper } from "@/components/settings/settings-content-wrapper";
import { SettingsSaveButton } from "@/components/settings/settings-save-button";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountTab } from "./_components/account-tab";
import { GeneralTab } from "./_components/general-tab";
import { NotificationsTab } from "./_components/notifications-tab";
import { PreferencesTab } from "./_components/preferences-tab";
import { SeriesTab } from "./_components/series-tab";
import { SubscriptionTab } from "./_components/subscription-tab";
import { useCompanySettings, useUpdateCompanySettings } from "@/hooks/use-company-settings";
import { useNotificationSettings, useUpdateNotificationSettings } from "@/hooks/use-notification-settings";

import { CompanySettings } from "@/lib/types/settings";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("general");

    // React Query hooks
    const { data: companyData, isLoading: isLoadingCompany } = useCompanySettings();
    const { data: notificationData, isLoading: isLoadingNotifications } = useNotificationSettings();
    const updateCompany = useUpdateCompanySettings();
    const updateNotifications = useUpdateNotificationSettings();

    const isLoading = isLoadingCompany || isLoadingNotifications;
    const isSaving = updateCompany.isPending || updateNotifications.isPending;

    // Local state pour le formulaire (synchronisé avec React Query data)
    const [settings, setSettings] = useState<CompanySettings>({
        nom_entreprise: "",
        prefixe_devis: "DEV",
        prefixe_facture: "FACT",
    });

    const [notifications, setNotifications] = useState({
        email_nouveau_client: true,
        email_document_cree: false,
        email_document_paye: true,
        email_stock_bas: true,
        email_rapport_hebdomadaire: false,
    });

    const [preferences, setPreferences] = useState({
        langue: "fr",
        timezone: "Europe/Paris",
        devise: "EUR",
        format_nombre: "fr",
        format_date: "DD/MM/YYYY",
        premier_jour: "lundi",
    });

    // Synchroniser l'état local avec les données de React Query
    useEffect(() => {
        if (companyData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSettings(companyData);
        }
    }, [companyData]);

    useEffect(() => {
        if (notificationData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNotifications(notificationData);
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
                updateNotifications.mutateAsync(notifications),
            ]);

            toast.success("Paramètres enregistrés avec succès");
        } catch (error: unknown) {
            console.error("Error saving settings:", error);
            toast.error(
                (error as Error).message || "Impossible d'enregistrer les paramètres"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <PageHeader
                        title="Paramètres"
                        description="Configurez votre entreprise"
                    />
                </div>
                <SettingsContentWrapper>
                    <div className="flex items-center justify-center py-12">
                        <div className="text-[14px] text-black/40">
                            Chargement...
                        </div>
                    </div>
                </SettingsContentWrapper>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <PageHeader
                    title="Paramètres"
                    description="Gérez les paramètres de votre entreprise"
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <SettingsTabs />

                    <TabsContent value="general" className="mt-0">
                        <SettingsContentWrapper>
                            <GeneralTab
                                settings={settings}
                                onChange={handleSettingsChange}
                            />
                        </SettingsContentWrapper>
                        <SettingsSaveButton isSaving={isSaving} />
                    </TabsContent>

                    <TabsContent value="series" className="mt-0">
                        <SettingsContentWrapper>
                            <SeriesTab />
                        </SettingsContentWrapper>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0">
                        <SettingsContentWrapper>
                            <NotificationsTab
                                notifications={notifications}
                                onChange={handleNotificationsChange}
                            />
                        </SettingsContentWrapper>
                        <SettingsSaveButton isSaving={isSaving} />
                    </TabsContent>

                    <TabsContent value="preferences" className="mt-0">
                        <SettingsContentWrapper>
                            <PreferencesTab
                                preferences={preferences}
                                onChange={handlePreferencesChange}
                            />
                        </SettingsContentWrapper>
                        <SettingsSaveButton isSaving={isSaving} />
                    </TabsContent>

                    <TabsContent value="account" className="mt-0">
                        <SettingsContentWrapper>
                            <AccountTab user={session?.user} />
                        </SettingsContentWrapper>
                    </TabsContent>

                    <TabsContent value="subscription" className="mt-0">
                        <SettingsContentWrapper>
                            <SubscriptionTab entreprise={null} />
                        </SettingsContentWrapper>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    );
}

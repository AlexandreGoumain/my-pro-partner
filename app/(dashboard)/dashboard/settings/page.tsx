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

interface CompanySettings {
    id?: string;
    nom_entreprise: string;
    siret?: string;
    tva_intra?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    telephone?: string;
    email?: string;
    site_web?: string;
    logo_url?: string;
    prefixe_devis: string;
    prefixe_facture: string;
    conditions_paiement_defaut?: string;
    mentions_legales?: string;
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

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

    useEffect(() => {
        fetchSettings();
        fetchNotifications();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/settings/company");
            if (!response.ok)
                throw new Error("Erreur lors du chargement des paramètres");

            const data = await response.json();
            if (data.settings) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Impossible de charger les paramètres");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch("/api/settings/notifications");
            if (!response.ok) return;

            const data = await response.json();
            if (data.notifications) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

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
        setIsSaving(true);

        try {
            // Save company settings
            const companyResponse = await fetch("/api/settings/company", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (!companyResponse.ok) {
                const error = await companyResponse.json();
                throw new Error(
                    error.message || "Erreur lors de la sauvegarde"
                );
            }

            // Save notifications
            await fetch("/api/settings/notifications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notifications),
            });

            toast.success("Paramètres enregistrés avec succès");
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast.error(
                error.message || "Impossible d'enregistrer les paramètres"
            );
        } finally {
            setIsSaving(false);
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

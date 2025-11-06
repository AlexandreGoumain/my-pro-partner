"use client";

import { SettingsContentWrapper } from "@/components/settings/settings-content-wrapper";
import { SettingsSaveButton } from "@/components/settings/settings-save-button";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AccountTab } from "./_components/account-tab";
import { GeneralTab } from "./_components/general-tab";
import { NotificationsTab } from "./_components/notifications-tab";
import { PreferencesTab } from "./_components/preferences-tab";
import { SeriesTab } from "./_components/series-tab";
import { SubscriptionTab } from "./_components/subscription-tab";
import { useSettingsForm } from "@/hooks/use-settings-form";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("general");

    const {
        settings,
        notifications,
        preferences,
        isLoading,
        isSaving,
        handleSettingsChange,
        handleNotificationsChange,
        handlePreferencesChange,
        handleSubmit,
    } = useSettingsForm();

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

"use client";

import { SettingsContentWrapper } from "@/components/settings/settings-content-wrapper";
import { SettingsSaveButton } from "@/components/settings/settings-save-button";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSettingsForm } from "@/hooks/use-settings-form";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AccountTab } from "./_components/account-tab";
import { ExportTab } from "./_components/export-tab";
import { GeneralTab } from "./_components/general-tab";
import { NotificationsTab } from "./_components/notifications-tab";
import { PreferencesTab } from "./_components/preferences-tab";
import { SeriesTab } from "./_components/series-tab";
import { SubscriptionTab } from "./_components/subscription-tab";

function SettingsPageContent() {
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

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            skeletonProps={{
                layout: "form",
                withTabs: true,
            }}
        >
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
                            <SubscriptionTab />
                        </SettingsContentWrapper>
                    </TabsContent>

                    <TabsContent value="export" className="mt-0">
                        <SettingsContentWrapper>
                            <ExportTab />
                        </SettingsContentWrapper>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
        </ConditionalSkeleton>
    );
}

export default function SettingsPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "form",
                withTabs: true,
            }}
        >
            <SettingsPageContent />
        </SuspensePage>
    );
}

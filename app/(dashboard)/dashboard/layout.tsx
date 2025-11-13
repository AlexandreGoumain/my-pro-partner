"use client";

import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import { LayoutHeader } from "@/components/dashboard/layout-header";
import { NavigationMenu } from "@/components/dashboard/navigation-menu";
import { SidebarHelpFooter } from "@/components/dashboard/sidebar-help-footer";
import { SidebarLogo } from "@/components/dashboard/sidebar-logo";
import { LimitDialogProvider } from "@/components/providers/limit-dialog-provider";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { useBusinessNavigation } from "@/hooks/use-business-navigation";
import { usePageTitle } from "@/hooks/use-page-title";
import { useUserInfo } from "@/hooks/use-user-info";
import { ChatbotProvider } from "@/lib/chatbot/chatbot-context";

export interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // Custom hooks for data management
    const { navigation, isLoading: navLoading } = useBusinessNavigation();
    const userInfo = useUserInfo();
    const pageTitle = usePageTitle(navigation);

    return (
        <ChatbotProvider>
            <LimitDialogProvider>
                <SidebarProvider>
                    <Sidebar>
                        <SidebarHeader>
                            <SidebarLogo />
                        </SidebarHeader>
                        <SidebarContent>
                            <NavigationMenu
                                navigation={navigation}
                                isLoading={navLoading}
                            />
                        </SidebarContent>
                        <SidebarFooter>
                            <SidebarHelpFooter />
                        </SidebarFooter>
                    </Sidebar>
                    <SidebarInset>
                        <LayoutHeader
                            pageTitle={pageTitle}
                            userName={userInfo.name}
                            userEmail={userInfo.email}
                            userInitials={userInfo.initials}
                            avatarUrl={userInfo.avatarUrl}
                        />
                        <div className="flex flex-1 flex-col gap-4 p-4 bg-black/[0.04]">
                            {children}
                        </div>
                        <ChatbotWidget />
                    </SidebarInset>
                </SidebarProvider>
            </LimitDialogProvider>
        </ChatbotProvider>
    );
}

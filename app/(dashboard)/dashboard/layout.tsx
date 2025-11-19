"use client";

import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { DashboardProviders } from "@/components/dashboard/dashboard-providers";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { useBusinessNavigation } from "@/hooks/use-business-navigation";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSessionValidator } from "@/hooks/use-session-validator";
import { useUserInfo } from "@/hooks/use-user-info";

export interface DashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * Layout principal du dashboard
 * Gère la validation de session, la navigation et l'affichage général
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // Validation de session
    useSessionValidator();

    // Chargement des données
    const { navigation, isLoading: navLoading } = useBusinessNavigation();
    const userInfo = useUserInfo();
    const pageTitle = usePageTitle(navigation);

    return (
        <DashboardProviders>
            <DashboardSidebar navigation={navigation} isLoading={navLoading} />
            <DashboardContent
                pageTitle={pageTitle}
                userName={userInfo.name}
                userEmail={userInfo.email}
                userInitials={userInfo.initials}
                avatarUrl={userInfo.avatarUrl}
            >
                {children}
            </DashboardContent>
        </DashboardProviders>
    );
}

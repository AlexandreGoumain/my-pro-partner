"use client";

import { NavigationMenu } from "@/components/dashboard/navigation-menu";
import { SidebarHelpFooter } from "@/components/dashboard/sidebar-help-footer";
import { SidebarLogo } from "@/components/dashboard/sidebar-logo";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import type { ResolvedNavigation } from "@/lib/navigation/core/types";

interface DashboardSidebarProps {
    navigation: ResolvedNavigation | null;
    isLoading?: boolean;
}

/**
 * Sidebar du dashboard avec logo, navigation et footer
 */
export function DashboardSidebar({
    navigation,
    isLoading = false,
}: DashboardSidebarProps) {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarLogo />
            </SidebarHeader>
            <SidebarContent>
                <NavigationMenu navigation={navigation} isLoading={isLoading} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarHelpFooter />
            </SidebarFooter>
        </Sidebar>
    );
}

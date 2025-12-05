"use client";

import { ClientSidebar } from "@/components/client-portal/layout/client-sidebar";
import { NotificationBell } from "@/components/client-portal/notification-bell";
import { useClientAuth } from "@/hooks/use-client-auth";
import { getFilteredNavigation } from "@/lib/client-portal";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });

interface ClientPortalLayoutProps {
    children: React.ReactNode;
}

export default function ClientPortalLayout({
    children,
}: ClientPortalLayoutProps) {
    const pathname = usePathname();

    // Don't show layout or require auth on login, register, forgot-password, reset-password, and welcome pages
    const isAuthPage =
        pathname.startsWith("/client/login") ||
        pathname.startsWith("/client/register") ||
        pathname.startsWith("/client/forgot-password") ||
        pathname.startsWith("/client/reset-password") ||
        pathname === "/client/welcome";

    // Use custom auth hook for authentication, client info and capabilities
    // Only redirect to login if not on an auth page
    const { clientName, initials, capabilities, logout } = useClientAuth(!isAuthPage);

    // Build navigation based on client capabilities
    const navigation = useMemo(
        () => getFilteredNavigation(capabilities),
        [capabilities]
    );

    if (isAuthPage) {
        return (
            <html lang="fr">
                <body className={inter.className}>{children}</body>
            </html>
        );
    }

    return (
        <html lang="fr">
            <body className={inter.className}>
                <div className="flex h-screen bg-white">
                    {/* Sidebar */}
                    <ClientSidebar
                        navigationItems={navigation}
                        clientName={clientName}
                        initials={initials}
                        onLogout={logout}
                    />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Top Header with Notifications */}
                        <header className="h-16 border-b border-black/8 flex items-center justify-end px-6 flex-shrink-0">
                            <NotificationBell />
                        </header>

                        {/* Page Content */}
                        <main className="flex-1 overflow-auto p-8">{children}</main>
                    </div>
                </div>
            </body>
        </html>
    );
}

"use client";

import { ClientSidebar } from "@/components/client-portal/layout/client-sidebar";
import { useClientAuth } from "@/hooks/use-client-auth";
import type { NavigationItem } from "@/lib/types/welcome";
import { Award, FileText, Home, User } from "lucide-react";
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

    // Use custom auth hook for authentication and client info
    const { clientName, initials, logout } = useClientAuth(
        !pathname.startsWith("/client/login")
    );

    // Define navigation items with memoization
    const navigation: NavigationItem[] = useMemo(
        () => [
            {
                name: "Tableau de bord",
                href: "/client/dashboard",
                icon: Home,
            },
            {
                name: "Fidélité",
                href: "/client/fidelite",
                icon: Award,
            },
            {
                name: "Mes documents",
                href: "/client/documents",
                icon: FileText,
            },
            {
                name: "Mon profil",
                href: "/client/profil",
                icon: User,
            },
        ],
        []
    );

    // Don't show layout on login, register, forgot-password, reset-password, and welcome pages
    const isAuthPage =
        pathname.startsWith("/client/login") ||
        pathname.startsWith("/client/register") ||
        pathname.startsWith("/client/forgot-password") ||
        pathname.startsWith("/client/reset-password") ||
        pathname === "/client/welcome";

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
                    <div className="flex-1 overflow-auto">
                        <main className="p-8">{children}</main>
                    </div>
                </div>
            </body>
        </html>
    );
}

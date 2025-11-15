"use client";

import { NavigationLinks } from "@/components/client-portal/layout/navigation-links";
import { UserProfile } from "@/components/client-portal/layout/user-profile";
import type { NavigationItem } from "@/lib/types/welcome";

interface ClientSidebarProps {
    navigationItems: NavigationItem[];
    clientName: string;
    initials: string;
    onLogout: () => void;
    className?: string;
}

/**
 * Client portal sidebar with navigation and user profile
 */
export function ClientSidebar({
    navigationItems,
    clientName,
    initials,
    onLogout,
    className,
}: ClientSidebarProps) {
    return (
        <div
            className={`w-64 border-r border-black/8 flex flex-col ${className || ""}`}
        >
            {/* Logo / Header */}
            <div className="h-16 border-b border-black/8 flex items-center px-6">
                <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                    Portail Client
                </h1>
            </div>

            {/* Navigation */}
            <NavigationLinks items={navigationItems} />

            {/* User Profile */}
            <UserProfile
                clientName={clientName}
                initials={initials}
                onLogout={onLogout}
            />
        </div>
    );
}

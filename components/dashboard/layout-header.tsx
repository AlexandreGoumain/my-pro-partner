"use client";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { GlobalSearch } from "./global-search";
import { UserDropdownMenu } from "./user-dropdown-menu";
import { NotificationsDropdown } from "./notifications-dropdown";

export interface LayoutHeaderProps {
    pageTitle: string;
    userName: string;
    userEmail: string;
    userInitials: string;
    avatarUrl?: string | null;
}

export function LayoutHeader({
    pageTitle,
    userName,
    userEmail,
    userInitials,
    avatarUrl,
}: LayoutHeaderProps) {
    const breadcrumbs = useBreadcrumbs();

    return (
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
            <div className="h-6 w-px bg-black/8" />

            {/* Left: Breadcrumbs */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {breadcrumbs.length > 0 ? (
                    <Breadcrumbs
                        items={breadcrumbs}
                        showHome
                        className="truncate"
                    />
                ) : (
                    <h1 className="text-lg font-semibold truncate">
                        {pageTitle}
                    </h1>
                )}
            </div>

            {/* Center: Search */}
            <div className="flex items-center justify-center flex-1">
                <GlobalSearch />
            </div>

            {/* Right: Notifications & User Menu */}
            <div className="flex items-center justify-end gap-2 flex-1">
                <NotificationsDropdown />

                <UserDropdownMenu
                    userName={userName}
                    userEmail={userEmail}
                    userInitials={userInitials}
                    avatarUrl={avatarUrl}
                />
            </div>
        </header>
    );
}

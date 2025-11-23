"use client";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { GlobalSearch } from "./global-search";
import { UserDropdownMenu } from "./user-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

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
                <Button
                    variant="outline"
                    size="icon"
                    className="relative h-9 w-9 border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
                >
                    <Bell className="w-4 h-4 text-black/60" strokeWidth={2} />
                    {/* Badge pour le nombre de notifications */}
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-[10px] font-semibold flex items-center justify-center shadow-sm">
                        3
                    </span>
                </Button>

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

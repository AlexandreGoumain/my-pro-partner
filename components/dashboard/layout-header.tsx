"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdownMenu } from "./user-dropdown-menu";

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
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <UserDropdownMenu
            userName={userName}
            userEmail={userEmail}
            userInitials={userInitials}
            avatarUrl={avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}

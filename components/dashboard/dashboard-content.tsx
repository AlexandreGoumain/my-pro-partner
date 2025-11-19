"use client";

import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import { LayoutHeader } from "@/components/dashboard/layout-header";
import { SidebarInset } from "@/components/ui/sidebar";

interface DashboardContentProps {
    children: React.ReactNode;
    pageTitle: string;
    userName: string;
    userEmail: string;
    userInitials: string;
    avatarUrl?: string | null;
}

/**
 * Contenu principal du dashboard avec header et chatbot
 */
export function DashboardContent({
    children,
    pageTitle,
    userName,
    userEmail,
    userInitials,
    avatarUrl,
}: DashboardContentProps) {
    return (
        <SidebarInset>
            <LayoutHeader
                pageTitle={pageTitle}
                userName={userName}
                userEmail={userEmail}
                userInitials={userInitials}
                avatarUrl={avatarUrl ?? undefined}
            />
            <div className="flex flex-1 flex-col gap-4 bg-black/[0.04] p-4">
                {children}
            </div>
            <ChatbotWidget />
        </SidebarInset>
    );
}

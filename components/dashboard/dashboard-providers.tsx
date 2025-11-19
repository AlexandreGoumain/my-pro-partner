"use client";

import { LimitDialogProvider } from "@/components/providers/limit-dialog-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatbotProvider } from "@/lib/chatbot/chatbot-context";

interface DashboardProvidersProps {
    children: React.ReactNode;
}

/**
 * Regroupe tous les providers nécessaires au dashboard
 * Simplifie la structure et évite l'imbrication excessive
 */
export function DashboardProviders({ children }: DashboardProvidersProps) {
    return (
        <ChatbotProvider>
            <LimitDialogProvider>
                <SidebarProvider>{children}</SidebarProvider>
            </LimitDialogProvider>
        </ChatbotProvider>
    );
}

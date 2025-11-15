import { LucideIcon } from "lucide-react";

/**
 * Welcome page onboarding step
 */
export interface WelcomeStep {
    icon: LucideIcon;
    title: string;
    description: string;
    detail: string;
}

/**
 * Navigation item for client portal sidebar
 */
export interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

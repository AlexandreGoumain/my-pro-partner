"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    Building2,
    CreditCard,
    Download,
    LucideIcon,
    Settings2,
    User,
} from "lucide-react";

interface TabItem {
    value: string;
    label: string;
    icon: LucideIcon;
}

const tabs: TabItem[] = [
    { value: "general", label: "Général", icon: Building2 },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "preferences", label: "Préférences", icon: Settings2 },
    { value: "account", label: "Mon compte", icon: User },
    { value: "subscription", label: "Abonnement", icon: CreditCard },
    { value: "export", label: "Export", icon: Download },
];

export function SettingsTabs() {
    return (
        <div className="flex justify-center mb-8">
            <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-black/5 p-1 text-black/60 gap-1">
                {tabs.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                        key={value}
                        value={value}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                    >
                        <Icon className="h-4 w-4" strokeWidth={2} />
                        <span className="hidden sm:inline">{label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>
    );
}

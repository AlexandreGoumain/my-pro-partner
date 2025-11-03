"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    Building2,
    CreditCard,
    Hash,
    Settings2,
    User,
} from "lucide-react";

export function SettingsTabs() {
    return (
        <div className="flex justify-center mb-8">
            <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-black/5 p-1 text-black/60 gap-1">
                <TabsTrigger
                    value="general"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                    <Building2 className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Général</span>
                </TabsTrigger>
                <TabsTrigger
                    value="series"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                    <Hash className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Séries</span>
                </TabsTrigger>
                <TabsTrigger
                    value="notifications"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                    <Bell className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                    value="preferences"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                    <Settings2 className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Préférences</span>
                </TabsTrigger>
                <TabsTrigger
                    value="account"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                    <User className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Mon compte</span>
                </TabsTrigger>
                <TabsTrigger
                    value="subscription"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                    <CreditCard className="h-4 w-4" strokeWidth={2} />
                    <span className="hidden sm:inline">Abonnement</span>
                </TabsTrigger>
            </TabsList>
        </div>
    );
}

import { cn } from "@/lib/utils";
import * as React from "react";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export interface TabConfig {
    value: string;
    label: string;
    badge?: number | string;
    content: React.ReactNode;
}

export interface StyledTabsProps {
    tabs: TabConfig[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export function StyledTabs({
    tabs,
    defaultValue,
    value,
    onValueChange,
    className,
}: StyledTabsProps) {
    return (
        <Tabs
            defaultValue={defaultValue || tabs[0]?.value}
            value={value}
            onValueChange={onValueChange}
            className={cn("space-y-6", className)}
        >
            <TabsList className="bg-black/5 p-1 h-11 w-full justify-start">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="text-[14px] data-[state=active]:bg-white data-[state=active]:shadow-sm tracking-[-0.01em]"
                    >
                        {tab.label}
                        {tab.badge !== undefined && (
                            <Badge
                                variant="secondary"
                                className="ml-2 bg-black/5 text-black/60 border-0 text-[11px] h-5 px-1.5"
                            >
                                {tab.badge}
                            </Badge>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}

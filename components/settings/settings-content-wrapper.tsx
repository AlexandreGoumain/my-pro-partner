"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingsContentWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export function SettingsContentWrapper({
    children,
    className,
}: SettingsContentWrapperProps) {
    return (
        <Card
            className={cn(
                "border-black/8 shadow-sm bg-white max-w-4xl mx-auto",
                className
            )}
        >
            <div className="p-8">{children}</div>
        </Card>
    );
}

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface SettingsSectionProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

/**
 * SettingsSection component
 *
 * Section wrapper for settings pages with icon, title, and description.
 * Uses Design System constants for consistent styling.
 */
export function SettingsSection({
    icon: Icon,
    title,
    description,
    children,
    className = "",
}: SettingsSectionProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-gradient-to-b from-black to-black/40 rounded-full" />
                {Icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/[0.03]">
                        <Icon className="h-4 w-4 text-black/60" strokeWidth={2} />
                    </div>
                )}
                <div>
                    <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-black">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-[14px] text-black/60 mt-0.5">{description}</p>
                    )}
                </div>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

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
                {Icon && (
                    <div className={cn(
                        "flex h-10 w-10 items-center justify-center",
                        DS.size.radius.full,
                        DS.color.bg.hover
                    )}>
                        <Icon className={cn(DS.size.icon.default, DS.color.text.secondary)} strokeWidth={DS.size.icon.strokeWidth} />
                    </div>
                )}
                <div>
                    <h3 className={cn("text-[18px] font-semibold", DS.text.tracking.normal, DS.color.text.primary)}>
                        {title}
                    </h3>
                    {description && (
                        <p className={cn(DS.text.body.base, DS.color.text.tertiary, "mt-0.5")}>{description}</p>
                    )}
                </div>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface SectionHeaderProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    className?: string;
    layout?: "row" | "column";
    action?: React.ReactNode;
}

/**
 * SectionHeader component
 *
 * Standardized section header with title, optional description, and optional action.
 * Uses Design System constants for consistent styling.
 */
export function SectionHeader({
    icon: Icon,
    title,
    description,
    className,
    layout = "column",
    action,
}: SectionHeaderProps) {
    if (layout === "row" && Icon) {
        return (
            <div className={cn("flex items-center gap-3 mb-6", className)}>
                <div className={cn(
                    "flex h-10 w-10 items-center justify-center",
                    DS.size.radius.large,
                    DS.color.bg.hover
                )}>
                    <Icon className={cn(DS.size.icon.default, DS.color.text.secondary)} />
                </div>
                <div className="flex-1">
                    <h3 className={cn(DS.text.heading.h3, "font-semibold")}>{title}</h3>
                    {description && (
                        <p className={cn(DS.text.body.small, DS.color.text.secondary)}>
                            {description}
                        </p>
                    )}
                </div>
                {action && <div>{action}</div>}
            </div>
        );
    }

    return (
        <div className={cn(DS.component.sectionHeader.container, className)}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className={DS.component.sectionHeader.title}>
                        {title}
                    </h3>
                    {description && (
                        <p className={cn(DS.component.sectionHeader.description, "mt-1")}>
                            {description}
                        </p>
                    )}
                </div>
                {Icon && <Icon className={cn(DS.size.icon.default, DS.color.text.tertiary)} strokeWidth={DS.size.icon.strokeWidth} />}
                {action && <div>{action}</div>}
            </div>
        </div>
    );
}

import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    description?: string;
    badge?: {
        text: string | React.ReactNode;
        variant?: "default" | "secondary" | "destructive" | "outline";
        className?: string;
    };
    isClickable?: boolean;
    className?: string;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
}

/**
 * StatCard component
 *
 * Card component for displaying statistics with icon, value, and label.
 * Uses Design System constants for consistent styling.
 */
export function StatCard({
    icon: Icon,
    label,
    value,
    description,
    badge,
    isClickable = false,
    className,
    onClick,
    size = "md",
}: StatCardProps) {
    const sizeStyles = {
        sm: {
            iconContainer: "h-8 w-8",
            icon: DS.size.icon.small,
            value: "text-[20px]",
            label: DS.text.body.small,
            badge: "text-[11px] h-5 px-1.5",
        },
        md: {
            iconContainer: "h-10 w-10",
            icon: DS.size.icon.default,
            value: "text-[32px]",
            label: DS.text.body.base,
            badge: DS.text.body.xs + " h-5 px-2",
        },
        lg: {
            iconContainer: "h-12 w-12",
            icon: DS.size.icon.large,
            value: "text-[40px]",
            label: DS.text.body.large,
            badge: DS.text.body.small + " h-6 px-2.5",
        },
    };

    const styles = sizeStyles[size];

    return (
        <Card
            className={cn(
                DS.component.card.default,
                isClickable && cn(
                    "cursor-pointer hover:border-black/20",
                    DS.animation.transition.fast
                ),
                className
            )}
            onClick={onClick}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className={cn(
                            DS.size.radius.large,
                            DS.color.bg.hover,
                            "flex items-center justify-center",
                            styles.iconContainer
                        )}
                    >
                        <Icon
                            className={cn(DS.color.text.secondary, styles.icon)}
                            strokeWidth={DS.size.icon.strokeWidth}
                        />
                    </div>
                    {badge && (
                        <Badge
                            variant={badge.variant || "secondary"}
                            className={cn(
                                DS.color.bg.hover,
                                DS.color.text.secondary,
                                "border-0",
                                styles.badge,
                                badge.className
                            )}
                        >
                            {badge.text}
                        </Badge>
                    )}
                </div>
                <div className="space-y-0.5">
                    <p
                        className={cn(
                            "font-semibold",
                            DS.text.tracking.tight,
                            DS.color.text.primary,
                            styles.value
                        )}
                    >
                        {value}
                    </p>
                    <p className={cn(DS.color.text.secondary, styles.label)}>
                        {label}
                    </p>
                    {description && (
                        <p className={cn(DS.text.body.xs, DS.color.text.tertiary, "mt-0.5")}>
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}

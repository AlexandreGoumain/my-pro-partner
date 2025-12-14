import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DS } from "@/lib/constants/design-system";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
    iconBgClassName?: string;
    iconClassName?: string;
    valueClassName?: string;
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
    iconBgClassName,
    iconClassName,
    valueClassName,
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
                "group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300",
                isClickable && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <p
                            className={cn(
                                "font-medium tracking-[-0.01em] text-black/60",
                                styles.label
                            )}
                        >
                            {label}
                        </p>
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "flex items-center justify-center rounded-lg bg-black/5",
                                styles.iconContainer,
                                iconBgClassName
                            )}
                        >
                            <Icon
                                className={cn(
                                    "text-black/60",
                                    styles.icon,
                                    iconClassName
                                )}
                                strokeWidth={2}
                            />
                        </div>
                        <p
                            className={cn(
                                "font-bold tracking-[-0.03em] text-black",
                                styles.value,
                                valueClassName
                            )}
                        >
                            {value}
                        </p>
                    </div>
                    {badge && (
                        <Badge
                            variant={badge.variant || "secondary"}
                            className={cn(
                                "bg-black/5 text-black/60 border-0 font-medium",
                                styles.badge,
                                badge.className
                            )}
                        >
                            {badge.text}
                        </Badge>
                    )}
                </div>
                {description && (
                    <p className={cn("text-[12px] text-black/40 mt-3")}>
                        {description}
                    </p>
                )}
            </div>
        </Card>
    );
}

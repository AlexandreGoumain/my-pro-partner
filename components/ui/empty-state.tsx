import { LucideIcon } from "lucide-react";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
        isLoading?: boolean;
        disabled?: boolean;
    };
    iconSize?: "sm" | "md" | "lg";
    className?: string;
    variant?: "default" | "minimal" | "inline" | "dashed" | "centered";
    textSize?: "sm" | "md" | "lg";
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    iconSize = "md",
    className,
    variant = "default",
    textSize = "md",
}: EmptyStateProps) {
    const iconSizes = {
        sm: {
            container: "h-16 w-16",
            icon: "w-8 h-8",
        },
        md: {
            container: "h-20 w-20",
            icon: "w-10 h-10",
        },
        lg: {
            container: "h-24 w-24",
            icon: "w-12 h-12",
        },
    };

    const textSizes = {
        sm: {
            title: DS.text.body.large,
            description: DS.text.body.small,
        },
        md: {
            title: DS.text.heading.h3,
            description: DS.text.body.base,
        },
        lg: {
            title: DS.text.heading.h2,
            description: DS.text.body.large,
        },
    };

    const sizes = iconSizes[iconSize];
    const textClasses = textSizes[textSize];

    // Inline variant - simple text only
    if (variant === "inline") {
        return (
            <div className={cn("text-center py-12", className)}>
                <p className={cn(DS.text.body.base, DS.color.text.tertiary, DS.text.tracking.normal)}>
                    {title}
                </p>
            </div>
        );
    }

    const content = (
        <div className={cn(
            "flex flex-col items-center text-center space-y-5",
            variant === "centered" && "h-full justify-center px-6 py-12",
            className
        )}>
            {Icon && (
                <div
                    className={cn(
                        DS.size.radius.full,
                        DS.color.bg.hover,
                        "flex items-center justify-center",
                        sizes.container
                    )}
                >
                    <Icon
                        className={cn(DS.color.text.tertiary, sizes.icon)}
                        strokeWidth={DS.size.icon.strokeWidth}
                    />
                </div>
            )}
            <div>
                <h3 className={cn(
                    "font-semibold",
                    DS.text.tracking.normal,
                    DS.color.text.primary,
                    textClasses.title,
                    description ? "mb-2" : "mb-0"
                )}>
                    {title}
                </h3>
                {description && (
                    <p className={cn(
                        DS.color.text.secondary,
                        "max-w-md",
                        textClasses.description
                    )}>
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <PrimaryActionButton
                    onClick={action.onClick}
                    disabled={action.disabled || action.isLoading}
                    className="mt-2"
                >
                    {action.isLoading ? (
                        <>
                            <Spinner className="w-4 h-4 mr-2" />
                            Chargement...
                        </>
                    ) : (
                        <>
                            {action.icon && (
                                <action.icon className="w-4 h-4 mr-2" strokeWidth={2} />
                            )}
                            {action.label}
                        </>
                    )}
                </PrimaryActionButton>
            )}
        </div>
    );

    // Minimal variant - no card
    if (variant === "minimal") {
        return content;
    }

    // Centered variant - no card, full height
    if (variant === "centered") {
        return content;
    }

    // Default and dashed variants - with card
    return (
        <Card className={cn(
            "p-12",
            DS.size.shadow.small,
            variant === "dashed" ? cn("border-dashed", DS.color.border.medium) : DS.color.border.default
        )}>
            {content}
        </Card>
    );
}

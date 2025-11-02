import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    iconSize?: "sm" | "md" | "lg";
    className?: string;
    variant?: "default" | "minimal";
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    iconSize = "md",
    className,
    variant = "default",
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

    const sizes = iconSizes[iconSize];

    const content = (
        <div className={cn("flex flex-col items-center text-center space-y-5", className)}>
            <div
                className={cn(
                    "rounded-full bg-black/5 flex items-center justify-center",
                    sizes.container
                )}
            >
                <Icon
                    className={cn("text-black/40", sizes.icon)}
                    strokeWidth={2}
                />
            </div>
            <div>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                    {title}
                </h3>
                <p className="text-[14px] text-black/60 max-w-md">
                    {description}
                </p>
            </div>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm mt-2"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );

    if (variant === "minimal") {
        return <div className="text-center py-8 text-sm text-muted-foreground">{content}</div>;
    }

    return (
        <Card className="p-12 border-black/8 shadow-sm">
            {content}
        </Card>
    );
}

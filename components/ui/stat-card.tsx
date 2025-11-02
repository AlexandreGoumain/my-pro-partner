import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
            icon: "h-4 w-4",
            value: "text-[20px]",
            label: "text-[13px]",
            badge: "text-[11px] h-5 px-1.5",
        },
        md: {
            iconContainer: "h-10 w-10",
            icon: "h-5 w-5",
            value: "text-[32px]",
            label: "text-[14px]",
            badge: "text-[12px] h-5 px-2",
        },
        lg: {
            iconContainer: "h-12 w-12",
            icon: "h-6 w-6",
            value: "text-[40px]",
            label: "text-[15px]",
            badge: "text-[13px] h-6 px-2.5",
        },
    };

    const styles = sizeStyles[size];

    return (
        <Card
            className={cn(
                "border-black/8 shadow-sm",
                isClickable && "cursor-pointer hover:border-black/20 transition-all duration-200",
                className
            )}
            onClick={onClick}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className={cn(
                            "rounded-lg bg-black/5 flex items-center justify-center",
                            styles.iconContainer
                        )}
                    >
                        <Icon
                            className={cn("text-black/60", styles.icon)}
                            strokeWidth={2}
                        />
                    </div>
                    {badge && (
                        <Badge
                            variant={badge.variant || "secondary"}
                            className={cn(
                                "bg-black/5 text-black/60 border-0",
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
                            "font-semibold tracking-[-0.02em] text-black",
                            styles.value
                        )}
                    >
                        {value}
                    </p>
                    <p className={cn("text-black/60", styles.label)}>
                        {label}
                    </p>
                    {description && (
                        <p className="text-[12px] text-black/40 mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}

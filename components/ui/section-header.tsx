import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    className?: string;
    layout?: "row" | "column";
    action?: React.ReactNode;
}

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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {action && <div>{action}</div>}
            </div>
        );
    }

    return (
        <div className={cn("mb-6", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-[13px] text-black/40 mt-1">
                            {description}
                        </p>
                    )}
                </div>
                {Icon && <Icon className="h-5 w-5 text-black/40" strokeWidth={2} />}
                {action && <div>{action}</div>}
            </div>
        </div>
    );
}

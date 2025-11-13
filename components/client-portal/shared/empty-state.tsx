import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
    message: string;
    title?: string;
    icon?: LucideIcon;
    withCard?: boolean;
    className?: string;
}

/**
 * Generic empty state component for client portal
 * Can be displayed with or without a card wrapper
 */
export function EmptyState({
    message,
    title,
    icon: Icon,
    withCard = false,
    className,
}: EmptyStateProps) {
    const content = (
        <div className={cn("text-center py-12", className)}>
            {Icon && (
                <div className="rounded-full h-16 w-16 bg-black/5 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-black/40" strokeWidth={2} />
                </div>
            )}
            {title && (
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                    {title}
                </h3>
            )}
            <p className="text-[14px] text-black/60">{message}</p>
        </div>
    );

    if (withCard) {
        return (
            <Card className="border-black/8 shadow-sm">{content}</Card>
        );
    }

    return content;
}

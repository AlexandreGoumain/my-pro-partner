import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface StatusCardProps {
    type?: "success" | "error" | "info";
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    fullPage?: boolean;
    className?: string;
}

/**
 * Generic status card component for client portal
 * Shows success, error, or info states with icon, title, and description
 */
export function StatusCard({
    type = "info",
    icon: Icon,
    title,
    description,
    action,
    fullPage = false,
    className,
}: StatusCardProps) {
    const card = (
        <Card className={cn("border-black/8 shadow-sm", fullPage ? "max-w-md w-full" : "", className)}>
            <div className="p-6 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-black/5 flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-black/60" />
                </div>
                <div>
                    <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black mb-2">
                        {title}
                    </h2>
                    <p className="text-[14px] text-black/60">{description}</p>
                </div>
                {action && <div>{action}</div>}
            </div>
        </Card>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                {card}
            </div>
        );
    }

    return card;
}

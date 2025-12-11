import { Card } from "@/components/ui/card";
import {
    QuickActionButton,
    QuickActionButtonProps,
} from "./quick-action-button";

export interface QuickActionsCardProps {
    actions: QuickActionButtonProps[];
    className?: string;
}

/**
 * QuickActionsCard component
 *
 * Card displaying quick action buttons for common tasks.
 * Uses Design System constants for consistent styling.
 */
export function QuickActionsCard({
    actions,
    className,
}: QuickActionsCardProps) {
    return (
        <Card
            className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300 ${className || ""}`}
        >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Actions rapides
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        Tâches fréquentes
                    </p>
                </div>

                <div className="space-y-2">
                    {actions.map((action, index) => (
                        <QuickActionButton key={index} {...action} />
                    ))}
                </div>
            </div>
        </Card>
    );
}

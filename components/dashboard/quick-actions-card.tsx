import { Card } from "@/components/ui/card";
import { QuickActionButton, QuickActionButtonProps } from "./quick-action-button";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

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
export function QuickActionsCard({ actions, className }: QuickActionsCardProps) {
    return (
        <Card className={cn(DS.component.card.default, className)}>
            <div className="p-5">
                <h3 className={cn(DS.text.heading.h4, "mb-4")}>
                    Actions rapides
                </h3>
                <div className="space-y-2">
                    {actions.map((action, index) => (
                        <QuickActionButton key={index} {...action} />
                    ))}
                </div>
            </div>
        </Card>
    );
}

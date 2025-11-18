import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface DetailItem {
    label: string;
    value: string | React.ReactNode;
}

export interface DetailsSectionProps {
    items: DetailItem[];
    className?: string;
}

/**
 * DetailsSection component
 *
 * Reusable component for displaying key-value details in a styled box.
 * Uses Design System constants for consistent styling.
 * Used in payment pages, document details, etc.
 */
export function DetailsSection({ items, className }: DetailsSectionProps) {
    return (
        <div className={cn(DS.color.bg.hover, DS.size.radius.large, "p-4 space-y-2", className)}>
            {items.map((item, index) => (
                <div key={index} className={cn("flex justify-between", DS.text.body.small)}>
                    <span className={DS.color.text.secondary}>{item.label}</span>
                    <span className={cn("font-medium", DS.color.text.primary)}>{item.value}</span>
                </div>
            ))}
        </div>
    );
}

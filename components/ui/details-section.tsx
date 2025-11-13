import { cn } from "@/lib/utils";

export interface DetailItem {
    label: string;
    value: string | React.ReactNode;
}

export interface DetailsSectionProps {
    items: DetailItem[];
    className?: string;
}

/**
 * Reusable component for displaying key-value details in a styled box
 * Used in payment pages, document details, etc.
 */
export function DetailsSection({ items, className }: DetailsSectionProps) {
    return (
        <div className={cn("bg-black/5 rounded-lg p-4 space-y-2", className)}>
            {items.map((item, index) => (
                <div key={index} className="flex justify-between text-[13px]">
                    <span className="text-black/60">{item.label}</span>
                    <span className="font-medium text-black">{item.value}</span>
                </div>
            ))}
        </div>
    );
}

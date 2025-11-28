import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface PriorityGroupSectionProps<T> {
    title: string;
    count: number;
    icon: LucideIcon;
    iconClassName?: string;
    titleClassName?: string;
    items: T[];
    renderItem: (item: T) => ReactNode;
    className?: string;
}

export function PriorityGroupSection<T extends { id: string }>({
    title,
    count,
    icon: Icon,
    iconClassName,
    titleClassName,
    items,
    renderItem,
    className,
}: PriorityGroupSectionProps<T>) {
    if (items.length === 0) return null;

    return (
        <section className={className}>
            <div className="flex items-center gap-2 mb-3">
                <Icon className={cn("w-4 h-4", iconClassName)} strokeWidth={2} />
                <h2 className={cn("text-[14px] font-semibold", titleClassName)}>
                    {title} ({count})
                </h2>
            </div>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id}>{renderItem(item)}</div>
                ))}
            </div>
        </section>
    );
}

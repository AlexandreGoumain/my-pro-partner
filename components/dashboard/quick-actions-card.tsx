import { Card } from "@/components/ui/card";
import { QuickActionButton, QuickActionButtonProps } from "./quick-action-button";
import { cn } from "@/lib/utils";

export interface QuickActionsCardProps {
    actions: QuickActionButtonProps[];
    className?: string;
}

export function QuickActionsCard({ actions, className }: QuickActionsCardProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-5">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
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

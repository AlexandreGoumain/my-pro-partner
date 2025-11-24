import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickActionButtonProps {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    className?: string;
}

export function QuickActionButton({
    label,
    icon: Icon = Plus,
    onClick,
    className,
}: QuickActionButtonProps) {
    return (
        <Button
            variant="outline"
            className={cn(
                "group/btn w-full justify-start h-11 px-4 text-[14px] font-medium border-black/8 hover:border-black/15 hover:bg-black/[0.02] cursor-pointer transition-all duration-200",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-black/[0.04] group-hover/btn:bg-black/[0.08] transition-colors duration-200 mr-3">
                <Icon className="h-4 w-4 text-black/60 group-hover/btn:text-black/80" strokeWidth={2} />
            </div>
            <span className="text-black/70 group-hover/btn:text-black">{label}</span>
        </Button>
    );
}

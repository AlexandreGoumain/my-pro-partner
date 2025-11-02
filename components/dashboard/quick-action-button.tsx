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
                "w-full justify-start h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <Icon className="h-4 w-4 mr-2.5 text-black/60" strokeWidth={2} />
            <span className="text-black/80">{label}</span>
        </Button>
    );
}

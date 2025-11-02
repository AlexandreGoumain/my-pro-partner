import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClientListItemProps {
    initials: string;
    fullName: string;
    timeLabel: string;
    onClick?: () => void;
    className?: string;
}

export function ClientListItem({
    initials,
    fullName,
    timeLabel,
    onClick,
    className,
}: ClientListItemProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg hover:bg-black/5 cursor-pointer transition-all duration-200",
                className
            )}
            onClick={onClick}
        >
            <Avatar className="h-10 w-10 border border-black/10">
                <AvatarFallback className="bg-black text-white text-[13px] font-medium">
                    {initials.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-black truncate">
                    {fullName}
                </p>
                <p className="text-[12px] text-black/40">{timeLabel}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-black/40" strokeWidth={2} />
        </div>
    );
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface ClientListItemProps {
    initials: string;
    fullName: string;
    timeLabel: string;
    onClick?: () => void;
    className?: string;
}

/**
 * ClientListItem component
 *
 * List item for displaying client with avatar, name, and time.
 * Uses Design System constants for consistent styling.
 */
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
                "flex items-center gap-3 p-2.5 cursor-pointer",
                DS.size.radius.large,
                "hover:bg-black/5",
                DS.animation.transition.fast,
                className
            )}
            onClick={onClick}
        >
            <Avatar className={cn("h-10 w-10 border", DS.color.border.medium)}>
                <AvatarFallback className={cn("bg-black text-white font-medium", DS.text.body.small)}>
                    {initials.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className={cn(DS.text.body.base, "font-medium", DS.color.text.primary, "truncate")}>
                    {fullName}
                </p>
                <p className={cn(DS.text.body.xs, DS.color.text.tertiary)}>{timeLabel}</p>
            </div>
            <ArrowUpRight className={cn(DS.size.icon.small, DS.color.text.tertiary)} strokeWidth={DS.size.icon.strokeWidth} />
        </div>
    );
}

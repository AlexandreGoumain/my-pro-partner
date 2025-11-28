import { cn } from "@/lib/utils";
import { Lock, LucideIcon } from "lucide-react";

export interface NoAccessStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    className?: string;
}

export function NoAccessState({
    icon: Icon = Lock,
    title = "Accès non disponible",
    description = "Cette fonctionnalité n'est pas activée pour votre type d'entreprise.",
    className,
}: NoAccessStateProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center h-[60vh]",
                className
            )}
        >
            <div className="text-center">
                <Icon className="h-12 w-12 text-black/20 mx-auto mb-4" />
                <h2 className="text-[18px] font-semibold text-black/80 mb-2">
                    {title}
                </h2>
                <p className="text-[14px] text-black/40">{description}</p>
            </div>
        </div>
    );
}

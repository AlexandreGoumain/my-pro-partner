import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
    message?: string;
    className?: string;
}

/**
 * Reusable error state component
 * Displays a consistent error message with an icon
 */
export function ErrorState({
    message = "Une erreur est survenue lors du chargement des données.",
    className,
}: ErrorStateProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 p-6 border border-black/8 rounded-lg bg-black/2",
                className
            )}
        >
            <AlertCircle className="h-5 w-5 text-black/40" strokeWidth={2} />
            <p className="text-[14px] text-black/60">{message}</p>
        </div>
    );
}

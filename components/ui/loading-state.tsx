import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
    message?: string;
    className?: string;
    minHeight?: "sm" | "md" | "lg" | "full";
    variant?: "default" | "card" | "fullscreen";
    showSpinner?: boolean;
    spinnerSize?: number;
}

const heightClasses = {
    sm: "h-[30vh]",
    md: "h-[50vh]",
    lg: "h-[70vh]",
    full: "h-screen",
};

export function LoadingState({
    message = "Chargement...",
    className,
    minHeight = "md",
    variant = "default",
    showSpinner = true,
    spinnerSize = 20,
}: LoadingStateProps) {
    const content = (
        <div className="flex items-center justify-center gap-3">
            {showSpinner && (
                <Loader2
                    className="animate-spin text-black/40"
                    size={spinnerSize}
                    strokeWidth={2}
                />
            )}
            <div className="text-[14px] text-black/40 tracking-[-0.01em]">
                {message}
            </div>
        </div>
    );

    // Card variant
    if (variant === "card") {
        return (
            <Card className={cn("p-12 border-black/8 shadow-sm", className)}>
                {content}
            </Card>
        );
    }

    // Fullscreen variant
    if (variant === "fullscreen") {
        return (
            <div
                className={cn(
                    "flex items-center justify-center p-4 min-h-screen bg-black/2",
                    className
                )}
            >
                {content}
            </div>
        );
    }

    // Default variant
    return (
        <div
            className={cn(
                "flex items-center justify-center",
                heightClasses[minHeight],
                className
            )}
        >
            {content}
        </div>
    );
}

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingFallbackProps {
    message?: string;
    fullScreen?: boolean;
    showSpinner?: boolean;
    className?: string;
}

/**
 * Reusable loading fallback component for Suspense boundaries
 */
export function LoadingFallback({
    message = "Chargement...",
    fullScreen = true,
    showSpinner = false,
    className,
}: LoadingFallbackProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center p-4",
                fullScreen && "min-h-screen bg-black/2",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {showSpinner && (
                    <Loader2
                        className="animate-spin text-black/40"
                        size={20}
                        strokeWidth={2}
                    />
                )}
                <p className="text-[14px] text-black/60">{message}</p>
            </div>
        </div>
    );
}

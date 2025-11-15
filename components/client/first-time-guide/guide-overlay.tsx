import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface GuideOverlayProps {
    children: ReactNode;
    className?: string;
}

/**
 * Overlay backdrop for the guide modal
 * Provides backdrop blur and fade-in animation
 */
export function GuideOverlay({ children, className }: GuideOverlayProps) {
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300",
                className
            )}
        >
            {children}
        </div>
    );
}

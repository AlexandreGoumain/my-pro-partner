import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as React from "react";

export interface PrimaryActionButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
}

export function PrimaryActionButton({
    icon: Icon,
    children,
    className,
    ...props
}: PrimaryActionButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2",
                "bg-black hover:bg-black/90 text-white",
                "h-11 px-6 rounded-md shadow-sm",
                "text-[14px] font-medium tracking-[-0.01em]",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:pointer-events-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                className
            )}
            {...props}
        >
            {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
            {children}
        </button>
    );
}

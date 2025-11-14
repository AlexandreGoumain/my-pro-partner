import { cn } from "@/lib/utils";

export interface InlineEmptyStateProps {
    message: string;
    className?: string;
}

export function InlineEmptyState({
    message,
    className,
}: InlineEmptyStateProps) {
    return (
        <div className={cn("text-center py-12", className)}>
            <p className="text-[14px] text-black/40 tracking-[-0.01em]">
                {message}
            </p>
        </div>
    );
}

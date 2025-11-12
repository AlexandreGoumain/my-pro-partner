import { cn } from "@/lib/utils";

export interface FidelityEmptyStateProps {
    message: string;
    className?: string;
}

export function FidelityEmptyState({
    message,
    className,
}: FidelityEmptyStateProps) {
    return (
        <div className={cn("text-center py-12", className)}>
            <p className="text-[14px] text-black/60">{message}</p>
        </div>
    );
}

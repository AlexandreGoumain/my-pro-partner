import { cn } from "@/lib/utils";

export interface ProfileEmptyStateProps {
    message: string;
    className?: string;
}

export function ProfileEmptyState({
    message,
    className,
}: ProfileEmptyStateProps) {
    return (
        <div className={cn("text-center py-12", className)}>
            <p className="text-[14px] text-black/60">{message}</p>
        </div>
    );
}

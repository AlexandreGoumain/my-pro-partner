import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingCardProps {
    message?: string;
    className?: string;
    showSpinner?: boolean;
    spinnerSize?: number;
}

export function LoadingCard({
    message = "Chargement...",
    className,
    showSpinner = false,
    spinnerSize = 20,
}: LoadingCardProps) {
    return (
        <Card className={cn("p-12 border-black/8 shadow-sm", className)}>
            <div className="flex items-center justify-center gap-3">
                {showSpinner && (
                    <Loader2
                        className="animate-spin text-black/40"
                        size={spinnerSize}
                        strokeWidth={2}
                    />
                )}
                <div className="text-[14px] text-black/40">{message}</div>
            </div>
        </Card>
    );
}

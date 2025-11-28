"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface EmptyStateConfig {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}

export interface DataStateRendererProps<T> {
    isLoading: boolean;
    error?: Error | null;
    data: T[];
    emptyState: EmptyStateConfig;
    loadingComponent?: ReactNode;
    errorMessage?: string;
    children: (data: T[]) => ReactNode;
    className?: string;
}

export function DataStateRenderer<T>({
    isLoading,
    error,
    data,
    emptyState,
    loadingComponent,
    errorMessage = "Erreur lors du chargement des données",
    children,
    className,
}: DataStateRendererProps<T>) {
    const EmptyIcon = emptyState.icon;

    if (isLoading) {
        return (
            loadingComponent || (
                <div
                    className={cn(
                        "flex items-center justify-center py-20",
                        className
                    )}
                >
                    <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                </div>
            )
        );
    }

    if (error) {
        return (
            <Card className={cn("p-8 border-black/8", className)}>
                <div className="text-center">
                    <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <p className="text-[14px] text-black/60">{errorMessage}</p>
                </div>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className={cn("p-8 border-black/8", className)}>
                <div className="text-center">
                    <EmptyIcon className="h-10 w-10 text-black/20 mx-auto mb-3" />
                    <h3 className="text-[15px] font-medium text-black/80 mb-1">
                        {emptyState.title}
                    </h3>
                    <p className="text-[13px] text-black/40 mb-4">
                        {emptyState.description}
                    </p>
                    {emptyState.action}
                </div>
            </Card>
        );
    }

    return <>{children(data)}</>;
}

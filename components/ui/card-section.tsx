import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface CardSectionProps {
    children: ReactNode;
    padding?: "none" | "sm" | "md" | "lg";
    className?: string;
}

/**
 * Wrapper standardisé pour les cards avec le style Apple minimal
 * Unifie le pattern répété : <Card className="border-black/8 shadow-sm"><div className="p-X">
 *
 * @example
 * ```tsx
 * <CardSection padding="md">
 *   <h3>Titre</h3>
 *   <p>Contenu</p>
 * </CardSection>
 * ```
 */
export function CardSection({
    children,
    padding = "md",
    className,
}: CardSectionProps) {
    const paddingClasses = {
        none: "",
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
    };

    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            {padding === "none" ? (
                children
            ) : (
                <div className={paddingClasses[padding]}>{children}</div>
            )}
        </Card>
    );
}

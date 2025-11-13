import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusVariant } from "@/lib/types/payment.types";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaymentStatusCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    variant?: PaymentStatusVariant;
    action?: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
    };
    footer?: string;
    details?: React.ReactNode;
    className?: string;
}

const variantStyles: Record<PaymentStatusVariant, { bg: string; icon: string }> = {
    success: {
        bg: "bg-green-100",
        icon: "text-green-600",
    },
    error: {
        bg: "bg-red-100",
        icon: "text-red-600",
    },
    warning: {
        bg: "bg-orange-100",
        icon: "text-orange-600",
    },
};

/**
 * Reusable payment status card component
 * Used for payment success, cancel, and error states
 */
export function PaymentStatusCard({
    icon: Icon,
    title,
    description,
    variant = "success",
    action,
    footer,
    details,
    className,
}: PaymentStatusCardProps) {
    const styles = variantStyles[variant];

    return (
        <Card className={cn("max-w-md w-full p-8 border-black/8 shadow-sm", className)}>
            <div className="flex flex-col items-center text-center space-y-6">
                <div
                    className={cn(
                        "rounded-full h-20 w-20 flex items-center justify-center",
                        styles.bg
                    )}
                >
                    <Icon className={cn("w-12 h-12", styles.icon)} strokeWidth={2} />
                </div>

                <div>
                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-2">
                        {title}
                    </h1>
                    <p className="text-[14px] text-black/60">{description}</p>
                </div>

                {details && <div className="w-full pt-4">{details}</div>}

                {action && (
                    <Button
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                    >
                        {action.label}
                    </Button>
                )}

                {footer && <p className="text-[12px] text-black/40">{footer}</p>}
            </div>
        </Card>
    );
}

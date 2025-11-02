import { cn } from "@/lib/utils";

export interface ProgressBarProps {
    label: string;
    value: number; // 0-100
    showPercentage?: boolean;
    showCount?: boolean;
    count?: number;
    size?: "sm" | "md" | "lg";
    animated?: boolean;
    className?: string;
    barColor?: string;
    labelClassName?: string;
}

export function ProgressBar({
    label,
    value,
    showPercentage = false,
    showCount = false,
    count,
    size = "md",
    animated = true,
    className,
    barColor = "bg-primary",
    labelClassName,
}: ProgressBarProps) {
    const sizeStyles = {
        sm: {
            container: "h-1.5",
            text: "text-[12px]",
        },
        md: {
            container: "h-2",
            text: "text-[13px]",
        },
        lg: {
            container: "h-8",
            text: "text-sm",
        },
    };

    const styles = sizeStyles[size];
    const percentage = Math.min(Math.max(value, 0), 100);

    const rightContent = showPercentage
        ? `${percentage.toFixed(0)}%`
        : showCount && count !== undefined
        ? count
        : null;

    return (
        <div className={cn("space-y-2", className)}>
            <div className={cn("flex items-center justify-between", styles.text)}>
                <span className={cn("font-medium", labelClassName)}>
                    {label}
                </span>
                {rightContent !== null && (
                    <span className="font-semibold">{rightContent}</span>
                )}
            </div>
            <div
                className={cn(
                    "bg-muted rounded-full overflow-hidden",
                    styles.container
                )}
            >
                <div
                    className={cn(
                        "h-full",
                        barColor,
                        animated && "transition-all duration-500"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export interface ProgressBarWithValueProps extends Omit<ProgressBarProps, "value"> {
    current: number;
    max: number;
}

export function ProgressBarWithValue({
    current,
    max,
    ...props
}: ProgressBarWithValueProps) {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    return <ProgressBar value={percentage} {...props} />;
}

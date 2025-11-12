import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconBgColor?: string;
    iconColor?: string;
    iconBgStyle?: string;
    iconColorStyle?: string;
    className?: string;
}

export function StatCard({
    icon: Icon,
    label,
    value,
    iconBgColor = "bg-black/5",
    iconColor = "text-black/60",
    iconBgStyle,
    iconColorStyle,
    className,
}: StatCardProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-5">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            !iconBgStyle && iconBgColor
                        )}
                        style={
                            iconBgStyle
                                ? { backgroundColor: iconBgStyle }
                                : undefined
                        }
                    >
                        <Icon
                            className={cn(
                                "h-5 w-5",
                                !iconColorStyle && iconColor
                            )}
                            strokeWidth={2}
                            style={
                                iconColorStyle
                                    ? { color: iconColorStyle }
                                    : undefined
                            }
                        />
                    </div>
                    <div>
                        <p className="text-[13px] text-black/40">{label}</p>
                        <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                            {value}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

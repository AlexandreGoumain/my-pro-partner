import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { CSSProperties } from "react";

export interface IconBoxProps {
    /** Lucide icon component */
    icon: LucideIcon;
    /** Size variant */
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    /** Shape variant */
    shape?: "circle" | "rounded";
    /** Background color (Tailwind class or inline style) */
    bgColor?: string;
    /** Icon color (Tailwind class or inline style) */
    iconColor?: string;
    /** Custom background style (for dynamic colors) */
    bgStyle?: CSSProperties;
    /** Custom icon style (for dynamic colors) */
    iconStyle?: CSSProperties;
    /** Additional className */
    className?: string;
}

const sizeClasses = {
    sm: { box: "w-8 h-8", icon: "w-4 h-4" },
    md: { box: "w-10 h-10", icon: "w-5 h-5" },
    lg: { box: "w-12 h-12", icon: "w-6 h-6" },
    xl: { box: "w-16 h-16", icon: "w-8 h-8" },
    "2xl": { box: "w-20 h-20", icon: "w-10 h-10" },
};

const shapeClasses = {
    circle: "rounded-full",
    rounded: "rounded-lg",
};

/**
 * IconBox - Container for icons with consistent styling
 *
 * @example
 * // Simple usage
 * <IconBox icon={Users} bgColor="bg-black/5" iconColor="text-black/60" />
 *
 * @example
 * // With custom size and shape
 * <IconBox
 *   icon={DoorOpen}
 *   size="lg"
 *   shape="rounded"
 *   bgColor="bg-blue-100"
 *   iconColor="text-blue-600"
 * />
 *
 * @example
 * // With dynamic color (inline style)
 * <IconBox
 *   icon={Calendar}
 *   bgStyle={{ backgroundColor: user.color }}
 *   iconStyle={{ color: "#fff" }}
 * />
 */
export function IconBox({
    icon: Icon,
    size = "md",
    shape = "rounded",
    bgColor = "bg-black/5",
    iconColor = "text-black/60",
    bgStyle,
    iconStyle,
    className,
}: IconBoxProps) {
    const sizeConfig = sizeClasses[size];
    const shapeClass = shapeClasses[shape];

    return (
        <div
            className={cn(
                "flex items-center justify-center flex-shrink-0",
                sizeConfig.box,
                shapeClass,
                !bgStyle && bgColor,
                className
            )}
            style={bgStyle}
        >
            <Icon
                className={cn(sizeConfig.icon, !iconStyle && iconColor)}
                style={iconStyle}
                strokeWidth={2}
            />
        </div>
    );
}

/**
 * InitialsBox - Avatar-like box showing initials
 *
 * @example
 * <InitialsBox initials="JD" bgColor="bg-blue-500" textColor="text-white" />
 */
export interface InitialsBoxProps {
    /** Initials to display (1-2 characters) */
    initials: string;
    /** Size variant */
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    /** Background color */
    bgColor?: string;
    /** Text color */
    textColor?: string;
    /** Custom background style */
    bgStyle?: CSSProperties;
    /** Additional className */
    className?: string;
}

const initialsSizeClasses = {
    sm: { box: "w-8 h-8", text: "text-[12px]" },
    md: { box: "w-10 h-10", text: "text-[14px]" },
    lg: { box: "w-12 h-12", text: "text-[16px]" },
    xl: { box: "w-16 h-16", text: "text-[20px]" },
    "2xl": { box: "w-20 h-20", text: "text-[24px]" },
};

export function InitialsBox({
    initials,
    size = "md",
    bgColor = "bg-black/5",
    textColor = "text-black",
    bgStyle,
    className,
}: InitialsBoxProps) {
    const sizeConfig = initialsSizeClasses[size];

    return (
        <div
            className={cn(
                "flex items-center justify-center flex-shrink-0 rounded-full font-semibold",
                sizeConfig.box,
                sizeConfig.text,
                !bgStyle && bgColor,
                textColor,
                className
            )}
            style={bgStyle}
        >
            {initials.toUpperCase().slice(0, 2)}
        </div>
    );
}

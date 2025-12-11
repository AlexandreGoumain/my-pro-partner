import { cn } from "@/lib/utils";
import * as React from "react";

interface SegmentOption<T extends string> {
    value: T;
    label: string;
    icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
    value: T;
    onValueChange: (value: T) => void;
    options: SegmentOption<T>[];
    className?: string;
    /** Size variant */
    size?: "sm" | "default";
}

/**
 * SegmentedControl - Toggle between multiple options with a pill-style UI
 *
 * @example
 * <SegmentedControl
 *   value={mode}
 *   onValueChange={setMode}
 *   options={[
 *     { value: "existing", label: "Client existant", icon: <Users /> },
 *     { value: "new", label: "Nouveau client", icon: <UserPlus /> },
 *   ]}
 * />
 */
function SegmentedControl<T extends string>({
    value,
    onValueChange,
    options,
    className,
    size = "default",
}: SegmentedControlProps<T>) {
    return (
        <div
            role="radiogroup"
            className={cn(
                "flex gap-2 p-1 bg-black/[0.03] rounded-lg",
                className
            )}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={value === option.value}
                    onClick={() => onValueChange(option.value)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 rounded-md font-medium transition-all",
                        size === "sm"
                            ? "py-1.5 px-2 text-[12px]"
                            : "py-2 px-3 text-[13px]",
                        value === option.value
                            ? "bg-white text-black shadow-sm"
                            : "text-black/50 hover:text-black/70"
                    )}
                >
                    {option.icon && (
                        <span className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full">
                            {option.icon}
                        </span>
                    )}
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export { SegmentedControl };
export type { SegmentedControlProps, SegmentOption };

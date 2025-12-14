"use client";

import { cn } from "@/lib/utils";

export interface ProgressRingProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    className?: string;
    children?: React.ReactNode;
}

/**
 * A circular progress ring component
 * Uses SVG with stroke-dasharray for progress visualization
 */
export function ProgressRing({
    value,
    size = 40,
    strokeWidth = 3,
    className,
    children,
}: ProgressRingProps) {
    const normalizedValue = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (normalizedValue / 100) * circumference;

    return (
        <div
            className={cn(
                "relative inline-flex items-center justify-center",
                className
            )}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-black/10"
                />

                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-black transition-all duration-500 ease-out"
                />
            </svg>

            {/* Center content */}
            {children && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    );
}

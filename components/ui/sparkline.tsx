"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

export interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    strokeWidth?: number;
    showEndDot?: boolean;
    className?: string;
}

/**
 * A minimal sparkline component for showing trends
 * Uses SVG for rendering, no external dependencies
 */
export function Sparkline({
    data,
    width = 80,
    height = 24,
    strokeWidth = 1.5,
    showEndDot = true,
    className,
}: SparklineProps) {
    const path = useMemo(() => {
        if (!data || data.length < 2) return "";

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        // Add padding for the dot
        const padding = showEndDot ? 4 : 2;
        const effectiveWidth = width - padding * 2;
        const effectiveHeight = height - padding * 2;

        const points = data.map((value, index) => {
            const x = padding + (index / (data.length - 1)) * effectiveWidth;
            const y =
                padding +
                effectiveHeight -
                ((value - min) / range) * effectiveHeight;
            return { x, y };
        });

        // Create smooth bezier curve
        let d = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const tension = 0.3;

            const cpx1 = prev.x + (curr.x - prev.x) * tension;
            const cpy1 = prev.y;
            const cpx2 = curr.x - (curr.x - prev.x) * tension;
            const cpy2 = curr.y;

            d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
        }

        return d;
    }, [data, width, height, showEndDot]);

    const lastPoint = useMemo(() => {
        if (!data || data.length < 2) return null;

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const padding = showEndDot ? 4 : 2;
        const effectiveWidth = width - padding * 2;
        const effectiveHeight = height - padding * 2;

        const x = padding + effectiveWidth;
        const y =
            padding +
            effectiveHeight -
            ((data[data.length - 1] - min) / range) * effectiveHeight;

        return { x, y };
    }, [data, width, height, showEndDot]);

    const trend = useMemo(() => {
        if (!data || data.length < 2) return "neutral";
        const first = data[0];
        const last = data[data.length - 1];
        if (last > first) return "up";
        if (last < first) return "down";
        return "neutral";
    }, [data]);

    if (!data || data.length < 2) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center text-black/20",
                    className
                )}
                style={{ width, height }}
            >
                <span className="text-[10px]">--</span>
            </div>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={cn("overflow-visible", className)}
            aria-label={`Trend: ${trend}`}
        >
            {/* Main line */}
            <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black/40"
            />

            {/* End dot */}
            {showEndDot && lastPoint && (
                <circle
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r={3}
                    fill="currentColor"
                    className="text-black"
                />
            )}
        </svg>
    );
}

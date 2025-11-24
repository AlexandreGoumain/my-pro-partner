"use client";

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ============================================================================
// Types
// ============================================================================

export interface MiniChartData {
    label: string;
    value: number;
}

export interface MiniChartProps {
    data: MiniChartData[];
    type: "line" | "bar" | "donut";
    height?: number;
    className?: string;
    color?: string;
}

// ============================================================================
// Component
// ============================================================================

export function MiniChart({ data, type, height = 60, className, color = "#000" }: MiniChartProps) {
    if (!data || data.length === 0) {
        return (
            <div
                className={`flex items-center justify-center text-[12px] text-black/20 ${className || ""}`}
                style={{ height }}
            >
                Aucune donnée
            </div>
        );
    }

    if (type === "line") {
        return (
            <div className={className} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            animationDuration={300}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === "bar") {
        return (
            <div className={className} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} animationDuration={300} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === "donut") {
        // Donut chart with simple styling
        const total = data.reduce((sum, item) => sum + item.value, 0);

        // Generate subtle gray colors for each segment
        const colors = data.map((_, index) => {
            const opacity = 1 - (index * 0.15);
            return `rgba(0, 0, 0, ${Math.max(opacity, 0.3)})`;
        });

        return (
            <div className={className} style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="90%"
                            paddingAngle={2}
                            animationDuration={300}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
}

export const CHART_COLORS = [
    "#000000",
    "#404040",
    "#737373",
    "#a3a3a3",
    "#d4d4d4",
];

export const CHART_CONFIG = {
    cartesianGrid: {
        strokeDasharray: "3 3",
        stroke: "#e5e5e5",
    },
    axis: {
        tick: { fill: "#737373", fontSize: 12 },
    },
    tooltip: {
        contentStyle: {
            backgroundColor: "white",
            border: "1px solid #e5e5e5",
            borderRadius: "6px",
            fontSize: "13px",
        },
    },
    line: {
        stroke: "#000000",
        strokeWidth: 2,
        dot: { fill: "#000000" },
    },
    bar: {
        fill: "#000000",
    },
} as const;

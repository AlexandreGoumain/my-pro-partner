import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    isAutoCalculated,
    getDefaultUnit,
    formatGoalValue,
    calculateProgress,
    isGoalOnTrack,
    GOAL_METRIC_TYPES,
    GOAL_PERIODS,
    GOAL_UNITS,
} from "@/lib/types/goals";

// ============================================================================
// Tests for GOAL_METRIC_TYPES Configuration
// ============================================================================

describe("GOAL_METRIC_TYPES", () => {
    it("should have all required metric types", () => {
        const expectedTypes = [
            "REVENUE_MONTHLY",
            "REVENUE_QUARTERLY",
            "REVENUE_YEARLY",
            "NEW_CLIENTS",
            "CONVERSION_RATE",
            "DOCUMENTS_CREATED",
            "AVERAGE_TICKET",
            "CUSTOM",
        ];

        expectedTypes.forEach((type) => {
            expect(GOAL_METRIC_TYPES).toHaveProperty(type);
        });
    });

    it("should have correct structure for each metric type", () => {
        Object.values(GOAL_METRIC_TYPES).forEach((config) => {
            expect(config).toHaveProperty("label");
            expect(config).toHaveProperty("description");
            expect(config).toHaveProperty("unit");
            expect(config).toHaveProperty("autoCalculated");
            expect(typeof config.label).toBe("string");
            expect(typeof config.description).toBe("string");
            expect(typeof config.autoCalculated).toBe("boolean");
        });
    });

    it("should mark revenue metrics as auto-calculated", () => {
        expect(GOAL_METRIC_TYPES.REVENUE_MONTHLY.autoCalculated).toBe(true);
        expect(GOAL_METRIC_TYPES.REVENUE_QUARTERLY.autoCalculated).toBe(true);
        expect(GOAL_METRIC_TYPES.REVENUE_YEARLY.autoCalculated).toBe(true);
    });

    it("should mark CUSTOM as not auto-calculated", () => {
        expect(GOAL_METRIC_TYPES.CUSTOM.autoCalculated).toBe(false);
    });

    it("should have CURRENCY unit for revenue metrics", () => {
        expect(GOAL_METRIC_TYPES.REVENUE_MONTHLY.unit).toBe("CURRENCY");
        expect(GOAL_METRIC_TYPES.REVENUE_QUARTERLY.unit).toBe("CURRENCY");
        expect(GOAL_METRIC_TYPES.REVENUE_YEARLY.unit).toBe("CURRENCY");
        expect(GOAL_METRIC_TYPES.AVERAGE_TICKET.unit).toBe("CURRENCY");
    });

    it("should have PERCENTAGE unit for conversion rate", () => {
        expect(GOAL_METRIC_TYPES.CONVERSION_RATE.unit).toBe("PERCENTAGE");
    });

    it("should have NUMBER unit for count-based metrics", () => {
        expect(GOAL_METRIC_TYPES.NEW_CLIENTS.unit).toBe("NUMBER");
        expect(GOAL_METRIC_TYPES.DOCUMENTS_CREATED.unit).toBe("NUMBER");
        expect(GOAL_METRIC_TYPES.CUSTOM.unit).toBe("NUMBER");
    });
});

// ============================================================================
// Tests for GOAL_PERIODS Configuration
// ============================================================================

describe("GOAL_PERIODS", () => {
    it("should have all required periods", () => {
        const expectedPeriods = ["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];

        expectedPeriods.forEach((period) => {
            expect(GOAL_PERIODS).toHaveProperty(period);
        });
    });

    it("should have label and shortLabel for each period", () => {
        Object.values(GOAL_PERIODS).forEach((config) => {
            expect(config).toHaveProperty("label");
            expect(config).toHaveProperty("shortLabel");
            expect(typeof config.label).toBe("string");
            expect(typeof config.shortLabel).toBe("string");
        });
    });

    it("should have correct French labels", () => {
        expect(GOAL_PERIODS.WEEKLY.label).toBe("Hebdomadaire");
        expect(GOAL_PERIODS.MONTHLY.label).toBe("Mensuel");
        expect(GOAL_PERIODS.QUARTERLY.label).toBe("Trimestriel");
        expect(GOAL_PERIODS.YEARLY.label).toBe("Annuel");
    });
});

// ============================================================================
// Tests for GOAL_UNITS Configuration
// ============================================================================

describe("GOAL_UNITS", () => {
    it("should have all required units", () => {
        const expectedUnits = ["CURRENCY", "NUMBER", "PERCENTAGE"];

        expectedUnits.forEach((unit) => {
            expect(GOAL_UNITS).toHaveProperty(unit);
        });
    });

    it("should have label and format function for each unit", () => {
        Object.values(GOAL_UNITS).forEach((config) => {
            expect(config).toHaveProperty("label");
            expect(config).toHaveProperty("format");
            expect(typeof config.label).toBe("string");
            expect(typeof config.format).toBe("function");
        });
    });
});

// ============================================================================
// Tests for isAutoCalculated()
// ============================================================================

describe("isAutoCalculated", () => {
    it("should return true for auto-calculated metrics", () => {
        expect(isAutoCalculated("REVENUE_MONTHLY")).toBe(true);
        expect(isAutoCalculated("REVENUE_QUARTERLY")).toBe(true);
        expect(isAutoCalculated("REVENUE_YEARLY")).toBe(true);
        expect(isAutoCalculated("NEW_CLIENTS")).toBe(true);
        expect(isAutoCalculated("CONVERSION_RATE")).toBe(true);
        expect(isAutoCalculated("DOCUMENTS_CREATED")).toBe(true);
        expect(isAutoCalculated("AVERAGE_TICKET")).toBe(true);
    });

    it("should return false for CUSTOM metric", () => {
        expect(isAutoCalculated("CUSTOM")).toBe(false);
    });
});

// ============================================================================
// Tests for getDefaultUnit()
// ============================================================================

describe("getDefaultUnit", () => {
    it("should return CURRENCY for revenue metrics", () => {
        expect(getDefaultUnit("REVENUE_MONTHLY")).toBe("CURRENCY");
        expect(getDefaultUnit("REVENUE_QUARTERLY")).toBe("CURRENCY");
        expect(getDefaultUnit("REVENUE_YEARLY")).toBe("CURRENCY");
        expect(getDefaultUnit("AVERAGE_TICKET")).toBe("CURRENCY");
    });

    it("should return PERCENTAGE for conversion rate", () => {
        expect(getDefaultUnit("CONVERSION_RATE")).toBe("PERCENTAGE");
    });

    it("should return NUMBER for count-based metrics", () => {
        expect(getDefaultUnit("NEW_CLIENTS")).toBe("NUMBER");
        expect(getDefaultUnit("DOCUMENTS_CREATED")).toBe("NUMBER");
        expect(getDefaultUnit("CUSTOM")).toBe("NUMBER");
    });
});

// ============================================================================
// Tests for formatGoalValue()
// ============================================================================

describe("formatGoalValue", () => {
    it("should format CURRENCY values with euro symbol", () => {
        const formatted = formatGoalValue(50000, "CURRENCY");
        expect(formatted).toContain("€");
        expect(formatted).toContain("50");
    });

    it("should format PERCENTAGE values with percent symbol", () => {
        const formatted = formatGoalValue(75, "PERCENTAGE");
        expect(formatted).toBe("75%");
    });

    it("should format NUMBER values", () => {
        const formatted = formatGoalValue(1234, "NUMBER");
        // French locale uses space or narrow no-break space as thousands separator
        expect(formatted.replace(/\s/g, "")).toBe("1234");
    });

    it("should handle decimal values for CURRENCY", () => {
        const formatted = formatGoalValue(1234.56, "CURRENCY");
        expect(formatted).toContain("€");
    });

    it("should handle zero values", () => {
        expect(formatGoalValue(0, "CURRENCY")).toContain("0");
        expect(formatGoalValue(0, "NUMBER")).toBe("0");
        expect(formatGoalValue(0, "PERCENTAGE")).toBe("0%");
    });

    it("should handle large values", () => {
        const formatted = formatGoalValue(1000000, "CURRENCY");
        expect(formatted).toContain("€");
    });
});

// ============================================================================
// Tests for calculateProgress()
// ============================================================================

describe("calculateProgress", () => {
    it("should calculate 0% when current is 0", () => {
        expect(calculateProgress(0, 100)).toBe(0);
    });

    it("should calculate 100% when current equals target", () => {
        expect(calculateProgress(100, 100)).toBe(100);
    });

    it("should calculate 50% when current is half of target", () => {
        expect(calculateProgress(50, 100)).toBe(50);
    });

    it("should cap at 100% when current exceeds target", () => {
        expect(calculateProgress(150, 100)).toBe(100);
    });

    it("should handle 0 target gracefully", () => {
        expect(calculateProgress(50, 0)).toBe(0);
    });

    it("should round to nearest integer", () => {
        expect(calculateProgress(33, 100)).toBe(33);
        expect(calculateProgress(33.33, 100)).toBe(33);
        expect(calculateProgress(66.66, 100)).toBe(67);
    });

    it("should handle decimal current and target values", () => {
        expect(calculateProgress(25.5, 51)).toBe(50);
    });

    it("should handle very small progress", () => {
        expect(calculateProgress(1, 1000)).toBe(0); // rounds to 0
    });
});

// ============================================================================
// Tests for isGoalOnTrack()
// ============================================================================

describe("isGoalOnTrack", () => {
    // Mock the current date for consistent testing
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("WEEKLY period", () => {
        it("should be on track when progress matches day of week", () => {
            // Set to Wednesday (day 3 of 7, ~43% through week)
            vi.setSystemTime(new Date("2024-01-03T12:00:00")); // Wednesday

            // 50% progress should be on track for mid-week (with 10% tolerance)
            expect(isGoalOnTrack(50, 100, "WEEKLY")).toBe(true);
        });

        it("should not be on track when significantly behind", () => {
            // Set to Friday (day 5 of 7, ~71% through week)
            vi.setSystemTime(new Date("2024-01-05T12:00:00")); // Friday

            // 30% progress should not be on track for late week
            expect(isGoalOnTrack(30, 100, "WEEKLY")).toBe(false);
        });
    });

    describe("MONTHLY period", () => {
        it("should be on track at month start with low progress", () => {
            // Set to Jan 1st
            vi.setSystemTime(new Date("2024-01-01T12:00:00"));

            // Even 0% should be on track at month start
            expect(isGoalOnTrack(0, 100, "MONTHLY")).toBe(true);
        });

        it("should be on track mid-month with ~50% progress", () => {
            // Set to Jan 15th (middle of month)
            vi.setSystemTime(new Date("2024-01-15T12:00:00"));

            // 50% progress should be on track mid-month
            expect(isGoalOnTrack(50, 100, "MONTHLY")).toBe(true);
        });

        it("should not be on track end of month with low progress", () => {
            // Set to Jan 28th (~90% through month)
            vi.setSystemTime(new Date("2024-01-28T12:00:00"));

            // 30% progress should not be on track late in month
            expect(isGoalOnTrack(30, 100, "MONTHLY")).toBe(false);
        });
    });

    describe("QUARTERLY period", () => {
        it("should be on track at quarter start", () => {
            // Set to Jan 1st (start of Q1)
            vi.setSystemTime(new Date("2024-01-01T12:00:00"));

            expect(isGoalOnTrack(0, 100, "QUARTERLY")).toBe(true);
        });

        it("should be on track with proportional progress", () => {
            // Set to Feb 15th (middle of Q1)
            vi.setSystemTime(new Date("2024-02-15T12:00:00"));

            // ~50% progress should be on track mid-quarter
            expect(isGoalOnTrack(50, 100, "QUARTERLY")).toBe(true);
        });
    });

    describe("YEARLY period", () => {
        it("should be on track at year start", () => {
            vi.setSystemTime(new Date("2024-01-01T12:00:00"));

            expect(isGoalOnTrack(0, 100, "YEARLY")).toBe(true);
        });

        it("should be on track mid-year with ~50% progress", () => {
            // Set to July 1st (~50% through year)
            vi.setSystemTime(new Date("2024-07-01T12:00:00"));

            expect(isGoalOnTrack(50, 100, "YEARLY")).toBe(true);
        });

        it("should not be on track end of year with low progress", () => {
            // Set to December 20th (~97% through year)
            vi.setSystemTime(new Date("2024-12-20T12:00:00"));

            // 30% progress should not be on track late in year
            expect(isGoalOnTrack(30, 100, "YEARLY")).toBe(false);
        });
    });

    describe("edge cases", () => {
        it("should handle 100% progress as always on track", () => {
            vi.setSystemTime(new Date("2024-01-15T12:00:00"));

            expect(isGoalOnTrack(100, 100, "WEEKLY")).toBe(true);
            expect(isGoalOnTrack(100, 100, "MONTHLY")).toBe(true);
            expect(isGoalOnTrack(100, 100, "QUARTERLY")).toBe(true);
            expect(isGoalOnTrack(100, 100, "YEARLY")).toBe(true);
        });

        it("should handle overachievement (>100%)", () => {
            vi.setSystemTime(new Date("2024-01-15T12:00:00"));

            expect(isGoalOnTrack(150, 100, "MONTHLY")).toBe(true);
        });

        it("should handle zero target", () => {
            vi.setSystemTime(new Date("2024-01-15T12:00:00"));

            // With 0 target, progress is 0%, which should be on track early in period
            expect(isGoalOnTrack(50, 0, "MONTHLY")).toBe(false);
        });
    });
});

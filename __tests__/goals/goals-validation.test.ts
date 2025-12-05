import { describe, it, expect } from "vitest";
import {
    createGoalSchema,
    updateGoalSchema,
    updateGoalProgressSchema,
    reorderGoalsSchema,
} from "@/lib/validations/goal";

// ============================================================================
// Tests for createGoalSchema
// ============================================================================

describe("createGoalSchema", () => {
    describe("valid inputs", () => {
        it("should accept valid minimal input", () => {
            const input = {
                label: "Mon objectif",
                metricType: "CUSTOM",
                targetValue: 100,
            };

            const result = createGoalSchema.safeParse(input);
            expect(result.success).toBe(true);
        });

        it("should accept valid full input", () => {
            const input = {
                label: "Chiffre d'affaires mensuel",
                description: "Objectif de CA pour le mois",
                metricType: "REVENUE_MONTHLY",
                period: "MONTHLY",
                unit: "CURRENCY",
                targetValue: 50000,
            };

            const result = createGoalSchema.safeParse(input);
            expect(result.success).toBe(true);
        });

        it("should accept all valid metric types", () => {
            const metricTypes = [
                "REVENUE_MONTHLY",
                "REVENUE_QUARTERLY",
                "REVENUE_YEARLY",
                "NEW_CLIENTS",
                "CONVERSION_RATE",
                "DOCUMENTS_CREATED",
                "AVERAGE_TICKET",
                "CUSTOM",
            ];

            metricTypes.forEach((metricType) => {
                const result = createGoalSchema.safeParse({
                    label: "Test",
                    metricType,
                    targetValue: 100,
                });
                expect(result.success).toBe(true);
            });
        });

        it("should accept all valid periods", () => {
            const periods = ["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];

            periods.forEach((period) => {
                const result = createGoalSchema.safeParse({
                    label: "Test",
                    metricType: "CUSTOM",
                    period,
                    targetValue: 100,
                });
                expect(result.success).toBe(true);
            });
        });

        it("should accept all valid units", () => {
            const units = ["CURRENCY", "NUMBER", "PERCENTAGE"];

            units.forEach((unit) => {
                const result = createGoalSchema.safeParse({
                    label: "Test",
                    metricType: "CUSTOM",
                    unit,
                    targetValue: 100,
                });
                expect(result.success).toBe(true);
            });
        });

        it("should accept null description", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                description: null,
                metricType: "CUSTOM",
                targetValue: 100,
            });
            expect(result.success).toBe(true);
        });

        it("should apply default values", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                targetValue: 100,
            });

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.period).toBe("MONTHLY");
                expect(result.data.unit).toBe("NUMBER");
            }
        });
    });

    describe("invalid inputs - label", () => {
        it("should reject empty label", () => {
            const result = createGoalSchema.safeParse({
                label: "",
                metricType: "CUSTOM",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain("label");
            }
        });

        it("should reject missing label", () => {
            const result = createGoalSchema.safeParse({
                metricType: "CUSTOM",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
        });

        it("should reject label exceeding 100 characters", () => {
            const result = createGoalSchema.safeParse({
                label: "a".repeat(101),
                metricType: "CUSTOM",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain("label");
            }
        });

        it("should accept label with exactly 100 characters", () => {
            const result = createGoalSchema.safeParse({
                label: "a".repeat(100),
                metricType: "CUSTOM",
                targetValue: 100,
            });

            expect(result.success).toBe(true);
        });
    });

    describe("invalid inputs - description", () => {
        it("should reject description exceeding 500 characters", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                description: "a".repeat(501),
                metricType: "CUSTOM",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain("description");
            }
        });

        it("should accept description with exactly 500 characters", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                description: "a".repeat(500),
                metricType: "CUSTOM",
                targetValue: 100,
            });

            expect(result.success).toBe(true);
        });
    });

    describe("invalid inputs - metricType", () => {
        it("should reject invalid metric type", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "INVALID_TYPE",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
        });

        it("should reject missing metric type", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
        });
    });

    describe("invalid inputs - targetValue", () => {
        it("should reject zero target value", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                targetValue: 0,
            });

            expect(result.success).toBe(false);
        });

        it("should reject negative target value", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                targetValue: -100,
            });

            expect(result.success).toBe(false);
        });

        it("should reject target value exceeding max", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                targetValue: 1000000000000, // 10^12
            });

            expect(result.success).toBe(false);
        });

        it("should accept target value at max limit", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                targetValue: 999999999999, // Just under 10^12
            });

            expect(result.success).toBe(true);
        });

        it("should reject missing target value", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
            });

            expect(result.success).toBe(false);
        });

        it("should accept decimal target values", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                targetValue: 99.99,
            });

            expect(result.success).toBe(true);
        });
    });

    describe("invalid inputs - period", () => {
        it("should reject invalid period", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                period: "DAILY",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
        });
    });

    describe("invalid inputs - unit", () => {
        it("should reject invalid unit", () => {
            const result = createGoalSchema.safeParse({
                label: "Test",
                metricType: "CUSTOM",
                unit: "INVALID",
                targetValue: 100,
            });

            expect(result.success).toBe(false);
        });
    });
});

// ============================================================================
// Tests for updateGoalSchema
// ============================================================================

describe("updateGoalSchema", () => {
    describe("valid inputs", () => {
        it("should accept empty object (no updates)", () => {
            const result = updateGoalSchema.safeParse({});
            expect(result.success).toBe(true);
        });

        it("should accept partial update with only label", () => {
            const result = updateGoalSchema.safeParse({
                label: "Nouveau nom",
            });
            expect(result.success).toBe(true);
        });

        it("should accept partial update with only enabled", () => {
            const result = updateGoalSchema.safeParse({
                enabled: false,
            });
            expect(result.success).toBe(true);
        });

        it("should accept partial update with sortOrder", () => {
            const result = updateGoalSchema.safeParse({
                sortOrder: 5,
            });
            expect(result.success).toBe(true);
        });

        it("should accept full update", () => {
            const result = updateGoalSchema.safeParse({
                label: "Nouveau nom",
                description: "Nouvelle description",
                metricType: "NEW_CLIENTS",
                period: "QUARTERLY",
                unit: "NUMBER",
                targetValue: 200,
                enabled: true,
                sortOrder: 1,
            });
            expect(result.success).toBe(true);
        });
    });

    describe("invalid inputs", () => {
        it("should reject empty label", () => {
            const result = updateGoalSchema.safeParse({
                label: "",
            });
            expect(result.success).toBe(false);
        });

        it("should reject negative sortOrder", () => {
            const result = updateGoalSchema.safeParse({
                sortOrder: -1,
            });
            expect(result.success).toBe(false);
        });

        it("should reject non-integer sortOrder", () => {
            const result = updateGoalSchema.safeParse({
                sortOrder: 1.5,
            });
            expect(result.success).toBe(false);
        });

        it("should reject invalid enabled type", () => {
            const result = updateGoalSchema.safeParse({
                enabled: "yes",
            });
            expect(result.success).toBe(false);
        });
    });
});

// ============================================================================
// Tests for updateGoalProgressSchema
// ============================================================================

describe("updateGoalProgressSchema", () => {
    describe("valid inputs", () => {
        it("should accept zero value", () => {
            const result = updateGoalProgressSchema.safeParse({
                currentValue: 0,
            });
            expect(result.success).toBe(true);
        });

        it("should accept positive value", () => {
            const result = updateGoalProgressSchema.safeParse({
                currentValue: 500,
            });
            expect(result.success).toBe(true);
        });

        it("should accept decimal value", () => {
            const result = updateGoalProgressSchema.safeParse({
                currentValue: 123.45,
            });
            expect(result.success).toBe(true);
        });

        it("should accept max value", () => {
            const result = updateGoalProgressSchema.safeParse({
                currentValue: 999999999999,
            });
            expect(result.success).toBe(true);
        });
    });

    describe("invalid inputs", () => {
        it("should reject negative value", () => {
            const result = updateGoalProgressSchema.safeParse({
                currentValue: -1,
            });
            expect(result.success).toBe(false);
        });

        it("should reject value exceeding max", () => {
            const result = updateGoalProgressSchema.safeParse({
                currentValue: 1000000000000,
            });
            expect(result.success).toBe(false);
        });

        it("should reject missing currentValue", () => {
            const result = updateGoalProgressSchema.safeParse({});
            expect(result.success).toBe(false);
        });

        it("should reject non-number value", () => {
            const result = updateGoalProgressSchema.safeParse({
                currentValue: "100",
            });
            expect(result.success).toBe(false);
        });
    });
});

// ============================================================================
// Tests for reorderGoalsSchema
// ============================================================================

describe("reorderGoalsSchema", () => {
    describe("valid inputs", () => {
        it("should accept array with one CUID", () => {
            const result = reorderGoalsSchema.safeParse({
                goalIds: ["clh1234567890abcdefghijklm"],
            });
            expect(result.success).toBe(true);
        });

        it("should accept array with multiple CUIDs", () => {
            const result = reorderGoalsSchema.safeParse({
                goalIds: [
                    "clh1234567890abcdefghijklm",
                    "clh1234567890abcdefghijkln",
                    "clh1234567890abcdefghijklo",
                ],
            });
            expect(result.success).toBe(true);
        });
    });

    describe("invalid inputs", () => {
        it("should reject empty array", () => {
            const result = reorderGoalsSchema.safeParse({
                goalIds: [],
            });
            expect(result.success).toBe(false);
        });

        it("should reject missing goalIds", () => {
            const result = reorderGoalsSchema.safeParse({});
            expect(result.success).toBe(false);
        });

        it("should reject invalid CUID format", () => {
            const result = reorderGoalsSchema.safeParse({
                goalIds: ["not-a-valid-cuid"],
            });
            expect(result.success).toBe(false);
        });

        it("should reject non-string values in array", () => {
            const result = reorderGoalsSchema.safeParse({
                goalIds: [123, 456],
            });
            expect(result.success).toBe(false);
        });
    });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GoalList } from "@/components/dashboard/goals/goal-list";
import type { GoalWithProgress } from "@/lib/types/goals";

// ============================================================================
// Test Data
// ============================================================================

const createMockGoal = (overrides: Partial<GoalWithProgress> = {}): GoalWithProgress => ({
    id: "test-goal-id",
    label: "Test Goal",
    description: null,
    metricType: "CUSTOM",
    period: "MONTHLY",
    unit: "NUMBER",
    targetValue: 100,
    currentValue: 50,
    enabled: true,
    sortOrder: 0,
    entrepriseId: "test-entreprise-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: 50,
    onTrack: true,
    formattedCurrent: "50",
    formattedTarget: "100",
    ...overrides,
});

// ============================================================================
// Tests
// ============================================================================

describe("GoalList", () => {
    describe("rendering", () => {
        it("should render all goals", () => {
            const goals = [
                createMockGoal({ id: "1", label: "Goal 1" }),
                createMockGoal({ id: "2", label: "Goal 2" }),
                createMockGoal({ id: "3", label: "Goal 3" }),
            ];

            render(
                <GoalList
                    goals={goals}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Goal 1")).toBeInTheDocument();
            expect(screen.getByText("Goal 2")).toBeInTheDocument();
            expect(screen.getByText("Goal 3")).toBeInTheDocument();
        });

        it("should render empty list without error", () => {
            const { container } = render(
                <GoalList
                    goals={[]}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            // Should render the container but with no items
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    describe("sorting", () => {
        it("should display enabled goals before disabled goals", () => {
            const goals = [
                createMockGoal({ id: "1", label: "Disabled Goal", enabled: false, sortOrder: 0 }),
                createMockGoal({ id: "2", label: "Enabled Goal", enabled: true, sortOrder: 1 }),
            ];

            render(
                <GoalList
                    goals={goals}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            const items = screen.getAllByText(/Goal/);
            expect(items[0]).toHaveTextContent("Enabled Goal");
            expect(items[1]).toHaveTextContent("Disabled Goal");
        });

        it("should sort by sortOrder within enabled/disabled groups", () => {
            const goals = [
                createMockGoal({ id: "1", label: "Goal C", enabled: true, sortOrder: 2 }),
                createMockGoal({ id: "2", label: "Goal A", enabled: true, sortOrder: 0 }),
                createMockGoal({ id: "3", label: "Goal B", enabled: true, sortOrder: 1 }),
            ];

            render(
                <GoalList
                    goals={goals}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            const items = screen.getAllByText(/Goal [ABC]/);
            expect(items[0]).toHaveTextContent("Goal A");
            expect(items[1]).toHaveTextContent("Goal B");
            expect(items[2]).toHaveTextContent("Goal C");
        });

        it("should handle mixed enabled/disabled with sortOrder", () => {
            const goals = [
                createMockGoal({ id: "1", label: "Disabled 2", enabled: false, sortOrder: 1 }),
                createMockGoal({ id: "2", label: "Enabled 1", enabled: true, sortOrder: 0 }),
                createMockGoal({ id: "3", label: "Disabled 1", enabled: false, sortOrder: 0 }),
                createMockGoal({ id: "4", label: "Enabled 2", enabled: true, sortOrder: 1 }),
            ];

            render(
                <GoalList
                    goals={goals}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            const items = screen.getAllByText(/Enabled|Disabled/);
            // Enabled first (by sortOrder), then disabled (by sortOrder)
            expect(items[0]).toHaveTextContent("Enabled 1");
            expect(items[1]).toHaveTextContent("Enabled 2");
            expect(items[2]).toHaveTextContent("Disabled 1");
            expect(items[3]).toHaveTextContent("Disabled 2");
        });
    });

    describe("props passing", () => {
        it("should pass togglingId to the correct goal item", () => {
            const goals = [
                createMockGoal({ id: "goal-1", label: "Goal 1" }),
                createMockGoal({ id: "goal-2", label: "Goal 2" }),
            ];

            render(
                <GoalList
                    goals={goals}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                    togglingId="goal-1"
                />
            );

            // The switch for goal-1 should be disabled
            const switches = screen.getAllByRole("switch");
            expect(switches[0]).toBeDisabled(); // goal-1
            expect(switches[1]).not.toBeDisabled(); // goal-2
        });
    });

    describe("edge cases", () => {
        it("should handle goals with undefined sortOrder", () => {
            const goals = [
                createMockGoal({ id: "1", label: "Goal 1", sortOrder: undefined as unknown as number }),
                createMockGoal({ id: "2", label: "Goal 2", sortOrder: 0 }),
            ];

            // Should not throw
            expect(() =>
                render(
                    <GoalList
                        goals={goals}
                        onToggle={vi.fn()}
                        onEdit={vi.fn()}
                        onDelete={vi.fn()}
                    />
                )
            ).not.toThrow();
        });

        it("should handle single goal", () => {
            const goals = [createMockGoal({ id: "1", label: "Single Goal" })];

            render(
                <GoalList
                    goals={goals}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Single Goal")).toBeInTheDocument();
        });

        it("should handle many goals", () => {
            const goals = Array.from({ length: 20 }, (_, i) =>
                createMockGoal({ id: `goal-${i}`, label: `Goal ${i}`, sortOrder: i })
            );

            render(
                <GoalList
                    goals={goals}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            // Check first and last
            expect(screen.getByText("Goal 0")).toBeInTheDocument();
            expect(screen.getByText("Goal 19")).toBeInTheDocument();
        });
    });
});

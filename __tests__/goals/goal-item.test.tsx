import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GoalItem } from "@/components/dashboard/goals/goal-item";
import type { GoalWithProgress } from "@/lib/types/goals";

// ============================================================================
// Test Data
// ============================================================================

const createMockGoal = (overrides: Partial<GoalWithProgress> = {}): GoalWithProgress => ({
    id: "test-goal-id",
    label: "Chiffre d'affaires mensuel",
    description: "Objectif de CA",
    metricType: "REVENUE_MONTHLY",
    period: "MONTHLY",
    unit: "CURRENCY",
    targetValue: 50000,
    currentValue: 25000,
    enabled: true,
    sortOrder: 0,
    entrepriseId: "test-entreprise-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: 50,
    onTrack: true,
    formattedCurrent: "25 000€",
    formattedTarget: "50 000€",
    ...overrides,
});

// ============================================================================
// Tests
// ============================================================================

describe("GoalItem", () => {
    describe("rendering", () => {
        it("should render goal label", () => {
            const goal = createMockGoal();
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Chiffre d'affaires mensuel")).toBeInTheDocument();
        });

        it("should render period label", () => {
            const goal = createMockGoal();
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Mensuel")).toBeInTheDocument();
        });

        it("should render Auto badge for auto-calculated metrics", () => {
            const goal = createMockGoal({ metricType: "REVENUE_MONTHLY" });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Auto")).toBeInTheDocument();
        });

        it("should not render Auto badge for CUSTOM metrics", () => {
            const goal = createMockGoal({ metricType: "CUSTOM" });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.queryByText("Auto")).not.toBeInTheDocument();
        });

        it("should render progress percentage when enabled", () => {
            const goal = createMockGoal({ progress: 75 });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("75%")).toBeInTheDocument();
        });

        it("should render formatted current and target values when enabled", () => {
            const goal = createMockGoal({
                formattedCurrent: "25 000€",
                formattedTarget: "50 000€",
            });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("25 000€")).toBeInTheDocument();
            expect(screen.getByText(/50 000€/)).toBeInTheDocument();
        });

        it("should show 'En bonne voie' when on track", () => {
            const goal = createMockGoal({ onTrack: true });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("En bonne voie")).toBeInTheDocument();
        });

        it("should show 'En retard' when not on track", () => {
            const goal = createMockGoal({ onTrack: false });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("En retard")).toBeInTheDocument();
        });

        it("should show disabled state when goal is disabled", () => {
            const goal = createMockGoal({ enabled: false });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Objectif désactivé")).toBeInTheDocument();
        });

        it("should not show progress section when disabled", () => {
            const goal = createMockGoal({ enabled: false });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            // Progress percentage should not be visible
            expect(screen.queryByText("50%")).not.toBeInTheDocument();
            expect(screen.queryByText("En bonne voie")).not.toBeInTheDocument();
        });
    });

    describe("switch interaction", () => {
        it("should call onToggle when switch is clicked", () => {
            const onToggle = vi.fn();
            const goal = createMockGoal({ enabled: true });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={onToggle}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            const switchElement = screen.getByRole("switch");
            fireEvent.click(switchElement);

            expect(onToggle).toHaveBeenCalledWith("test-goal-id", false);
        });

        it("should call onToggle with true when enabling", () => {
            const onToggle = vi.fn();
            const goal = createMockGoal({ enabled: false });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={onToggle}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            const switchElement = screen.getByRole("switch");
            fireEvent.click(switchElement);

            expect(onToggle).toHaveBeenCalledWith("test-goal-id", true);
        });

        it("should disable switch when isToggling is true", () => {
            const goal = createMockGoal();
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                    isToggling={true}
                />
            );

            const switchElement = screen.getByRole("switch");
            expect(switchElement).toBeDisabled();
        });
    });

    describe("periods", () => {
        it("should render weekly period correctly", () => {
            const goal = createMockGoal({ period: "WEEKLY" });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Hebdomadaire")).toBeInTheDocument();
        });

        it("should render quarterly period correctly", () => {
            const goal = createMockGoal({ period: "QUARTERLY" });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Trimestriel")).toBeInTheDocument();
        });

        it("should render yearly period correctly", () => {
            const goal = createMockGoal({ period: "YEARLY" });
            render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            expect(screen.getByText("Annuel")).toBeInTheDocument();
        });
    });

    describe("all metric types", () => {
        const autoMetricTypes = [
            "REVENUE_MONTHLY",
            "REVENUE_QUARTERLY",
            "REVENUE_YEARLY",
            "NEW_CLIENTS",
            "CONVERSION_RATE",
            "DOCUMENTS_CREATED",
            "AVERAGE_TICKET",
        ] as const;

        autoMetricTypes.forEach((metricType) => {
            it(`should show Auto badge for ${metricType}`, () => {
                const goal = createMockGoal({ metricType });
                render(
                    <GoalItem
                        goal={goal}
                        onToggle={vi.fn()}
                        onEdit={vi.fn()}
                        onDelete={vi.fn()}
                    />
                );

                expect(screen.getByText("Auto")).toBeInTheDocument();
            });
        });
    });

    describe("progress bar", () => {
        it("should render progress bar with correct width", () => {
            const goal = createMockGoal({ progress: 75 });
            const { container } = render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            // Find the progress bar inner element
            const progressBarInner = container.querySelector('[style*="width: 75%"]');
            expect(progressBarInner).toBeInTheDocument();
        });

        it("should cap progress bar at 100%", () => {
            const goal = createMockGoal({ progress: 150 });
            const { container } = render(
                <GoalItem
                    goal={goal}
                    onToggle={vi.fn()}
                    onEdit={vi.fn()}
                    onDelete={vi.fn()}
                />
            );

            // Should be capped at 100%
            const progressBarInner = container.querySelector('[style*="width: 100%"]');
            expect(progressBarInner).toBeInTheDocument();
        });
    });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoalForm } from "@/components/dashboard/goals/goal-form";
import type { GoalWithProgress } from "@/lib/types/goals";

// ============================================================================
// Test Data
// ============================================================================

const createMockGoal = (overrides: Partial<GoalWithProgress> = {}): GoalWithProgress => ({
    id: "test-goal-id",
    label: "Existing Goal",
    description: "Description",
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

describe("GoalForm", () => {
    describe("create mode", () => {
        it("should render empty form for creation", () => {
            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByLabelText(/Nom de l'objectif/i)).toHaveValue("");
            expect(screen.getByRole("button", { name: /Créer l'objectif/i })).toBeInTheDocument();
        });

        it("should show 'Créer l'objectif' button in create mode", () => {
            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByRole("button", { name: /Créer l'objectif/i })).toBeInTheDocument();
        });

        it("should have disabled submit button when form is empty", () => {
            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            const submitButton = screen.getByRole("button", { name: /Créer l'objectif/i });
            expect(submitButton).toBeDisabled();
        });
    });

    describe("edit mode", () => {
        it("should populate form with existing goal data", () => {
            const goal = createMockGoal({ label: "Mon objectif" });
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByLabelText(/Nom de l'objectif/i)).toHaveValue("Mon objectif");
        });

        it("should show 'Enregistrer' button in edit mode", () => {
            const goal = createMockGoal();
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByRole("button", { name: /Enregistrer/i })).toBeInTheDocument();
        });

        it("should populate target value from existing goal", () => {
            const goal = createMockGoal({ targetValue: 75000 });
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByLabelText(/Valeur cible/i)).toHaveValue(75000);
        });
    });

    describe("form validation", () => {
        it("should enable submit button when label and target are provided", async () => {
            const user = userEvent.setup();
            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            const labelInput = screen.getByLabelText(/Nom de l'objectif/i);
            const targetInput = screen.getByLabelText(/Valeur cible/i);

            await user.type(labelInput, "Mon objectif");
            await user.type(targetInput, "1000");

            const submitButton = screen.getByRole("button", { name: /Créer l'objectif/i });
            expect(submitButton).not.toBeDisabled();
        });

        it("should keep submit disabled with empty label", async () => {
            const user = userEvent.setup();
            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            const targetInput = screen.getByLabelText(/Valeur cible/i);
            await user.type(targetInput, "1000");

            const submitButton = screen.getByRole("button", { name: /Créer l'objectif/i });
            expect(submitButton).toBeDisabled();
        });

        it("should keep submit disabled with empty target", async () => {
            const user = userEvent.setup();
            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            const labelInput = screen.getByLabelText(/Nom de l'objectif/i);
            await user.type(labelInput, "Mon objectif");

            const submitButton = screen.getByRole("button", { name: /Créer l'objectif/i });
            expect(submitButton).toBeDisabled();
        });
    });

    describe("form submission", () => {
        it("should call onSubmit with form data", async () => {
            const user = userEvent.setup();
            const onSubmit = vi.fn();

            render(
                <GoalForm
                    onSubmit={onSubmit}
                    onCancel={vi.fn()}
                />
            );

            const labelInput = screen.getByLabelText(/Nom de l'objectif/i);
            const targetInput = screen.getByLabelText(/Valeur cible/i);

            await user.type(labelInput, "Nouveau CA");
            await user.type(targetInput, "50000");

            const submitButton = screen.getByRole("button", { name: /Créer l'objectif/i });
            await user.click(submitButton);

            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    label: "Nouveau CA",
                    targetValue: 50000,
                })
            );
        });

        it("should trim label before submission", async () => {
            const user = userEvent.setup();
            const onSubmit = vi.fn();

            render(
                <GoalForm
                    onSubmit={onSubmit}
                    onCancel={vi.fn()}
                />
            );

            const labelInput = screen.getByLabelText(/Nom de l'objectif/i);
            const targetInput = screen.getByLabelText(/Valeur cible/i);

            await user.type(labelInput, "  Mon objectif  ");
            await user.type(targetInput, "1000");

            const submitButton = screen.getByRole("button", { name: /Créer l'objectif/i });
            await user.click(submitButton);

            expect(onSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    label: "Mon objectif",
                })
            );
        });
    });

    describe("cancel button", () => {
        it("should call onCancel when cancel button is clicked", async () => {
            const user = userEvent.setup();
            const onCancel = vi.fn();

            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={onCancel}
                />
            );

            const cancelButton = screen.getByRole("button", { name: /Annuler/i });
            await user.click(cancelButton);

            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe("loading state", () => {
        it("should disable submit button when loading", () => {
            const goal = createMockGoal();
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                    isLoading={true}
                />
            );

            const submitButton = screen.getByRole("button", { name: /Enregistrer/i });
            expect(submitButton).toBeDisabled();
        });

        it("should disable cancel button when loading", () => {
            const goal = createMockGoal();
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                    isLoading={true}
                />
            );

            const cancelButton = screen.getByRole("button", { name: /Annuler/i });
            expect(cancelButton).toBeDisabled();
        });
    });

    describe("auto-calculated metrics", () => {
        it("should show auto-calculation notice for auto metrics", async () => {
            const goal = createMockGoal({ metricType: "REVENUE_MONTHLY" });
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            // Look for the auto-calculation message
            expect(screen.getByText(/automatiquement/i)).toBeInTheDocument();
        });
    });

    describe("unit display", () => {
        it("should show euro symbol for CURRENCY unit", () => {
            const goal = createMockGoal({ unit: "CURRENCY", metricType: "REVENUE_MONTHLY" });
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByText("€")).toBeInTheDocument();
        });

        it("should show percent symbol for PERCENTAGE unit", () => {
            const goal = createMockGoal({ unit: "PERCENTAGE", metricType: "CONVERSION_RATE" });
            render(
                <GoalForm
                    goal={goal}
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByText("%")).toBeInTheDocument();
        });
    });

    describe("form elements", () => {
        it("should have required form fields", () => {
            render(
                <GoalForm
                    onSubmit={vi.fn()}
                    onCancel={vi.fn()}
                />
            );

            expect(screen.getByLabelText(/Nom de l'objectif/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Valeur cible/i)).toBeInTheDocument();
            expect(screen.getByText(/Type de métrique/i)).toBeInTheDocument();
            expect(screen.getByText(/Période/i)).toBeInTheDocument();
        });
    });
});

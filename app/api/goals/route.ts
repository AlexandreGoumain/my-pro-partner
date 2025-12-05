import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { createGoalSchema } from "@/lib/validations/goal";
import {
    calculateProgress,
    formatGoalValue,
    GOAL_METRIC_TYPES,
    isGoalOnTrack,
} from "@/lib/types/goals";
import { NextRequest, NextResponse } from "next/server";
import { calculateGoalCurrentValue } from "@/lib/goals/calculate-goals-progress";

// GET: List all goals for the enterprise with calculated progress
export async function GET() {
    return withApiHandler(async (ctx) => {
        const goals = await prisma.objectifEntreprise.findMany({
            where: { entrepriseId: ctx.entrepriseId },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        });

        // Calculate progress for each goal
        const goalsWithProgress = await Promise.all(
            goals.map(async (goal) => {
                // For auto-calculated metrics, compute current value from data
                let currentValue = goal.currentValue.toNumber();

                if (GOAL_METRIC_TYPES[goal.metricType].autoCalculated) {
                    currentValue = await calculateGoalCurrentValue(
                        ctx.entrepriseId,
                        goal.metricType,
                        goal.period
                    );
                }

                const targetValue = goal.targetValue.toNumber();
                const progress = calculateProgress(currentValue, targetValue);
                const onTrack = isGoalOnTrack(currentValue, targetValue, goal.period);

                return {
                    id: goal.id,
                    label: goal.label,
                    description: goal.description,
                    metricType: goal.metricType,
                    period: goal.period,
                    unit: goal.unit,
                    targetValue,
                    currentValue,
                    enabled: goal.enabled,
                    sortOrder: goal.sortOrder,
                    entrepriseId: goal.entrepriseId,
                    createdAt: goal.createdAt,
                    updatedAt: goal.updatedAt,
                    progress,
                    onTrack,
                    formattedCurrent: formatGoalValue(currentValue, goal.unit),
                    formattedTarget: formatGoalValue(targetValue, goal.unit),
                };
            })
        );

        return NextResponse.json(goalsWithProgress);
    });
}

// POST: Create a new goal
export async function POST(req: NextRequest) {
    return withApiHandler(async (ctx) => {
        const body = await req.json();
        const parsed = createGoalSchema.safeParse(body);

        if (!parsed.success) {
            throw new ValidationError(
                parsed.error.errors[0]?.message || "Données invalides"
            );
        }

        const { label, description, metricType, period, unit, targetValue } =
            parsed.data;

        // For auto-calculated metrics, override unit with default
        const finalUnit = GOAL_METRIC_TYPES[metricType].autoCalculated
            ? GOAL_METRIC_TYPES[metricType].unit
            : unit;

        // Get max sortOrder to add new goal at the end
        const maxSortOrder = await prisma.objectifEntreprise.aggregate({
            where: { entrepriseId: ctx.entrepriseId },
            _max: { sortOrder: true },
        });

        const goal = await prisma.objectifEntreprise.create({
            data: {
                label,
                description,
                metricType,
                period,
                unit: finalUnit,
                targetValue,
                currentValue: 0,
                enabled: true,
                sortOrder: (maxSortOrder._max.sortOrder ?? -1) + 1,
                entrepriseId: ctx.entrepriseId,
            },
        });

        // Calculate current value for response
        let currentValue = 0;
        if (GOAL_METRIC_TYPES[metricType].autoCalculated) {
            currentValue = await calculateGoalCurrentValue(
                ctx.entrepriseId,
                metricType,
                period
            );
        }

        const progress = calculateProgress(currentValue, targetValue);
        const onTrack = isGoalOnTrack(currentValue, targetValue, period);

        return NextResponse.json(
            {
                id: goal.id,
                label: goal.label,
                description: goal.description,
                metricType: goal.metricType,
                period: goal.period,
                unit: goal.unit,
                targetValue: goal.targetValue.toNumber(),
                currentValue,
                enabled: goal.enabled,
                sortOrder: goal.sortOrder,
                entrepriseId: goal.entrepriseId,
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
                progress,
                onTrack,
                formattedCurrent: formatGoalValue(currentValue, goal.unit),
                formattedTarget: formatGoalValue(goal.targetValue.toNumber(), goal.unit),
            },
            { status: 201 }
        );
    });
}

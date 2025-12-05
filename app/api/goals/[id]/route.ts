import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { updateGoalSchema } from "@/lib/validations/goal";
import {
    calculateProgress,
    formatGoalValue,
    GOAL_METRIC_TYPES,
    isGoalOnTrack,
} from "@/lib/types/goals";
import { calculateGoalCurrentValue } from "@/lib/goals/calculate-goals-progress";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: Get a single goal by ID
export async function GET(_req: NextRequest, { params }: RouteParams) {
    return withApiHandler(async (ctx) => {
        const { id } = await params;

        const goal = await prisma.objectifEntreprise.findFirst({
            where: {
                id,
                entrepriseId: ctx.entrepriseId,
            },
        });

        if (!goal) {
            throw new NotFoundError("Objectif non trouvé");
        }

        // Calculate current value for auto-calculated metrics
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

        return NextResponse.json({
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
        });
    });
}

// PUT: Update a goal
export async function PUT(req: NextRequest, { params }: RouteParams) {
    return withApiHandler(async (ctx) => {
        const { id } = await params;
        const body = await req.json();
        const parsed = updateGoalSchema.safeParse(body);

        if (!parsed.success) {
            throw new ValidationError(
                parsed.error.errors[0]?.message || "Données invalides"
            );
        }

        // Check goal exists and belongs to enterprise
        const existingGoal = await prisma.objectifEntreprise.findFirst({
            where: {
                id,
                entrepriseId: ctx.entrepriseId,
            },
        });

        if (!existingGoal) {
            throw new NotFoundError("Objectif non trouvé");
        }

        const { label, description, metricType, period, unit, targetValue, enabled, sortOrder } =
            parsed.data;

        // If metric type is being changed to auto-calculated, override unit
        const finalUnit =
            metricType && GOAL_METRIC_TYPES[metricType].autoCalculated
                ? GOAL_METRIC_TYPES[metricType].unit
                : unit;

        const goal = await prisma.objectifEntreprise.update({
            where: { id },
            data: {
                ...(label !== undefined && { label }),
                ...(description !== undefined && { description }),
                ...(metricType !== undefined && { metricType }),
                ...(period !== undefined && { period }),
                ...(finalUnit !== undefined && { unit: finalUnit }),
                ...(targetValue !== undefined && { targetValue }),
                ...(enabled !== undefined && { enabled }),
                ...(sortOrder !== undefined && { sortOrder }),
            },
        });

        // Calculate current value
        let currentValue = goal.currentValue.toNumber();
        if (GOAL_METRIC_TYPES[goal.metricType].autoCalculated) {
            currentValue = await calculateGoalCurrentValue(
                ctx.entrepriseId,
                goal.metricType,
                goal.period
            );
        }

        const targetVal = goal.targetValue.toNumber();
        const progress = calculateProgress(currentValue, targetVal);
        const onTrack = isGoalOnTrack(currentValue, targetVal, goal.period);

        return NextResponse.json({
            id: goal.id,
            label: goal.label,
            description: goal.description,
            metricType: goal.metricType,
            period: goal.period,
            unit: goal.unit,
            targetValue: targetVal,
            currentValue,
            enabled: goal.enabled,
            sortOrder: goal.sortOrder,
            entrepriseId: goal.entrepriseId,
            createdAt: goal.createdAt,
            updatedAt: goal.updatedAt,
            progress,
            onTrack,
            formattedCurrent: formatGoalValue(currentValue, goal.unit),
            formattedTarget: formatGoalValue(targetVal, goal.unit),
        });
    });
}

// DELETE: Delete a goal
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    return withApiHandler(async (ctx) => {
        const { id } = await params;

        // Check goal exists and belongs to enterprise
        const existingGoal = await prisma.objectifEntreprise.findFirst({
            where: {
                id,
                entrepriseId: ctx.entrepriseId,
            },
        });

        if (!existingGoal) {
            throw new NotFoundError("Objectif non trouvé");
        }

        await prisma.objectifEntreprise.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    });
}

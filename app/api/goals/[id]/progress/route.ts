import { withApiHandler } from "@/lib/api/api-handler";
import { ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { updateGoalProgressSchema } from "@/lib/validations/goal";
import {
    calculateProgress,
    formatGoalValue,
    GOAL_METRIC_TYPES,
    isGoalOnTrack,
} from "@/lib/types/goals";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH: Update goal progress (only for CUSTOM goals)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
    return withApiHandler(async (ctx) => {
        const { id } = await params;
        const body = await req.json();
        const parsed = updateGoalProgressSchema.safeParse(body);

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

        // Only allow manual progress update for CUSTOM goals
        if (GOAL_METRIC_TYPES[existingGoal.metricType].autoCalculated) {
            throw new ForbiddenError(
                "La progression des objectifs automatiques ne peut pas être modifiée manuellement"
            );
        }

        const { currentValue } = parsed.data;

        const goal = await prisma.objectifEntreprise.update({
            where: { id },
            data: { currentValue },
        });

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

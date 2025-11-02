import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const automationCreateSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    triggerType: z.enum([
        "NEW_CLIENT_IN_SEGMENT",
        "CLIENT_MILESTONE",
        "SEGMENT_CHANGE",
        "INACTIVITY",
        "SCHEDULED",
    ]),
    triggerConfig: z.record(z.any()).default({}),
    actionType: z.enum([
        "SEND_EMAIL",
        "ADD_TO_SEGMENT",
        "REMOVE_FROM_SEGMENT",
        "ADD_POINTS",
        "SEND_SMS",
        "CREATE_TASK",
    ]),
    actionConfig: z.record(z.any()).default({}),
    actif: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const automations = await prisma.automation.findMany({
            where: { entrepriseId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            data: automations,
            total: automations.length,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const body = await req.json();
        const validation = automationCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const automation = await prisma.automation.create({
            data: {
                ...validation.data,
                entrepriseId,
            },
        });

        return NextResponse.json(automation, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}

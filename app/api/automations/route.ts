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
    triggerType: z.string(),
    triggerConfig: z.any(),
    actionType: z.string(),
    actionConfig: z.any(),
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

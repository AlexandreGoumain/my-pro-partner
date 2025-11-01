import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const automationUpdateSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional(),
    triggerType: z.string().optional(),
    triggerConfig: z.any().optional(),
    actionType: z.string().optional(),
    actionConfig: z.any().optional(),
    actif: z.boolean().optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const automation = await prisma.automation.findUnique({
            where: { id },
        });

        if (!automation) {
            return NextResponse.json(
                { message: "Automation non trouvée" },
                { status: 404 }
            );
        }

        if (automation.entrepriseId !== entrepriseId) {
            return NextResponse.json(
                { message: "Accès non autorisé" },
                { status: 403 }
            );
        }

        return NextResponse.json(automation);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const automation = await prisma.automation.findUnique({
            where: { id },
        });

        if (!automation) {
            return NextResponse.json(
                { message: "Automation non trouvée" },
                { status: 404 }
            );
        }

        if (automation.entrepriseId !== entrepriseId) {
            return NextResponse.json(
                { message: "Accès non autorisé" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const validation = automationUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const updatedAutomation = await prisma.automation.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json(updatedAutomation);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const automation = await prisma.automation.findUnique({
            where: { id },
        });

        if (!automation) {
            return NextResponse.json(
                { message: "Automation non trouvée" },
                { status: 404 }
            );
        }

        if (automation.entrepriseId !== entrepriseId) {
            return NextResponse.json(
                { message: "Accès non autorisé" },
                { status: 403 }
            );
        }

        await prisma.automation.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Automation supprimée avec succès" },
            { status: 200 }
        );
    } catch (error) {
        return handleTenantError(error);
    }
}

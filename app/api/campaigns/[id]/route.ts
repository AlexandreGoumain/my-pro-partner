import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const campaignUpdateSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(["EMAIL", "SMS", "PUSH"]).optional(),
    segmentId: z.string().optional(),
    subject: z.string().optional(),
    body: z.string().optional(),
    scheduledAt: z.string().datetime().optional(),
    statut: z
        .enum(["DRAFT", "SCHEDULED", "SENDING", "SENT", "CANCELLED"])
        .optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                segment: {
                    select: {
                        id: true,
                        nom: true,
                        nombreClients: true,
                    },
                },
            },
        });

        if (!campaign) {
            return NextResponse.json(
                { message: "Campagne non trouvée" },
                { status: 404 }
            );
        }

        if (campaign.entrepriseId !== entrepriseId) {
            return NextResponse.json(
                { message: "Accès non autorisé" },
                { status: 403 }
            );
        }

        return NextResponse.json(campaign);
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

        const campaign = await prisma.campaign.findUnique({
            where: { id },
        });

        if (!campaign) {
            return NextResponse.json(
                { message: "Campagne non trouvée" },
                { status: 404 }
            );
        }

        if (campaign.entrepriseId !== entrepriseId) {
            return NextResponse.json(
                { message: "Accès non autorisé" },
                { status: 403 }
            );
        }

        // Cannot edit campaigns that are already sent
        if (campaign.statut === "SENT") {
            return NextResponse.json(
                { message: "Impossible de modifier une campagne déjà envoyée" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const validation = campaignUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { scheduledAt, ...data } = validation.data;

        const updatedCampaign = await prisma.campaign.update({
            where: { id },
            data: {
                ...data,
                ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
            },
            include: {
                segment: {
                    select: {
                        id: true,
                        nom: true,
                        nombreClients: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedCampaign);
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

        const campaign = await prisma.campaign.findUnique({
            where: { id },
        });

        if (!campaign) {
            return NextResponse.json(
                { message: "Campagne non trouvée" },
                { status: 404 }
            );
        }

        if (campaign.entrepriseId !== entrepriseId) {
            return NextResponse.json(
                { message: "Accès non autorisé" },
                { status: 403 }
            );
        }

        // Cannot delete campaigns that are sending or sent
        if (campaign.statut === "SENDING" || campaign.statut === "SENT") {
            return NextResponse.json(
                {
                    message:
                        "Impossible de supprimer une campagne en cours ou envoyée",
                },
                { status: 400 }
            );
        }

        await prisma.campaign.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Campagne supprimée avec succès" },
            { status: 200 }
        );
    } catch (error) {
        return handleTenantError(error);
    }
}

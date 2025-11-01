import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { applySegmentCriteria } from "@/lib/types/segment";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const campaignCreateSchema = z.object({
    nom: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(["EMAIL", "SMS", "PUSH"]).default("EMAIL"),
    segmentId: z.string().optional(),
    subject: z.string().optional(),
    body: z.string().optional(),
    scheduledAt: z.string().datetime().optional(),
});

// ============================================
// GET /api/campaigns - List all campaigns
// ============================================

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { searchParams } = new URL(req.url);

        const statut = searchParams.get("statut");
        const type = searchParams.get("type");

        const campaigns = await prisma.campaign.findMany({
            where: {
                entrepriseId,
                ...(statut && { statut: statut as any }),
                ...(type && { type: type as any }),
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
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            data: campaigns,
            total: campaigns.length,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}

// ============================================
// POST /api/campaigns - Create new campaign
// ============================================

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const body = await req.json();

        const validation = campaignCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { segmentId, scheduledAt, ...data } = validation.data;

        // Calculate recipients count
        let recipientsCount = 0;
        if (segmentId) {
            const segment = await prisma.segment.findUnique({
                where: { id: segmentId },
            });

            if (!segment || segment.entrepriseId !== entrepriseId) {
                return NextResponse.json(
                    { message: "Segment non trouvé" },
                    { status: 404 }
                );
            }

            // Get all clients and apply segment criteria
            const allClients = await prisma.client.findMany({
                where: { entrepriseId },
            });

            const segmentClients = applySegmentCriteria(
                allClients,
                segment.criteres as any
            );

            recipientsCount = segmentClients.length;
        } else {
            // If no segment, count all clients
            recipientsCount = await prisma.client.count({
                where: { entrepriseId },
            });
        }

        const campaign = await prisma.campaign.create({
            data: {
                ...data,
                entrepriseId,
                segmentId: segmentId || null,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                recipientsCount,
                statut: scheduledAt ? "SCHEDULED" : "DRAFT",
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

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}

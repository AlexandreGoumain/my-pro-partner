import {
    handleTenantError,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/utils/validation-helper";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scheduleSchema = z.object({
    scheduledAt: z.string().datetime(),
});

// ============================================
// POST /api/campaigns/[id]/schedule - Schedule a campaign
// ============================================

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { resource: campaign } = await verifyResourceAccess(
            id,
            (id) => prisma.campaign.findUnique({ where: { id } }),
            "Campagne"
        );

        // Can only schedule draft campaigns
        if (campaign.statut !== "DRAFT") {
            return NextResponse.json(
                {
                    message:
                        "Seules les campagnes en brouillon peuvent être planifiées",
                },
                { status: 400 }
            );
        }

        const body = await req.json();
        const result = validateRequest(scheduleSchema, body);
        if (!result.success) return result.response;

        const scheduledAt = new Date(result.data.scheduledAt);

        // Cannot schedule in the past
        if (scheduledAt <= new Date()) {
            return NextResponse.json(
                { message: "La date de planification doit être dans le futur" },
                { status: 400 }
            );
        }

        const updatedCampaign = await prisma.campaign.update({
            where: { id },
            data: {
                scheduledAt,
                statut: "SCHEDULED",
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

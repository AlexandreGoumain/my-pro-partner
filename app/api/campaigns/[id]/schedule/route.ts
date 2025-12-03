import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError, NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
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
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const campaign = await prisma.campaign.findFirst({
                where: { id, entrepriseId: ctx.entrepriseId },
            });

            if (!campaign) {
                throw new NotFoundError("Campagne");
            }

            // Can only schedule draft campaigns
            if (campaign.statut !== "DRAFT") {
                throw new BusinessError(
                    "Seules les campagnes en brouillon peuvent être planifiées"
                );
            }

            const body = await req.json();
            const result = scheduleSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const scheduledAt = new Date(result.data.scheduledAt);

            // Cannot schedule in the past
            if (scheduledAt <= new Date()) {
                throw new BusinessError(
                    "La date de planification doit être dans le futur"
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
        },
        {
            context: { resourceName: "Campaign", operation: "schedule" },
        }
    );
}

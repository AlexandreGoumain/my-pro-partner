import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST /api/campaigns/[id]/cancel - Cancel a scheduled campaign
// ============================================

export async function POST(
    _req: NextRequest,
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

            // Can only cancel scheduled campaigns
            if (campaign.statut !== "SCHEDULED") {
                throw new BusinessError(
                    "Seules les campagnes planifiées peuvent être annulées"
                );
            }

            const updatedCampaign = await prisma.campaign.update({
                where: { id },
                data: {
                    statut: "CANCELLED",
                    scheduledAt: null,
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

            return NextResponse.json({
                campaign: updatedCampaign,
                message: "Campagne annulée avec succès",
            });
        },
        {
            context: { resourceName: "Campaign", operation: "cancel" },
        }
    );
}

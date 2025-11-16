import { emailService } from "@/lib/email/email-service";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const approveSchema = z.object({
    approve: z.boolean(),
    reason: z.string().optional(), // Reason for rejection
});

/**
 * POST /api/admin/clients/[id]/approve
 * Approve or reject a pending client registration
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id: clientId } = await params;

        const body = await req.json();
        const validation = approveSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { approve, reason } = validation.data;

        // Check if client exists and belongs to company
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
                pendingApproval: true,
            },
            include: {
                entreprise: {
                    include: {
                        parametres: true,
                    },
                },
            },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouvé ou déjà traité" },
                { status: 404 }
            );
        }

        const entrepriseName = client.entreprise.nom || "Notre entreprise";
        const notifPrefs = client.entreprise.parametres;

        if (approve) {
            // Approve: enable portal access
            const updatedClient = await prisma.client.update({
                where: { id: clientId },
                data: {
                    pendingApproval: false,
                    clientPortalEnabled: true,
                },
            });

            // Send approval email if enabled in preferences
            if (notifPrefs?.notif_client_approved && client.email) {
                const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/auth/login`;
                await emailService
                    .sendClientApproval({
                        to: client.email,
                        clientName: `${client.prenom} ${client.nom}`,
                        entrepriseName,
                        loginUrl,
                    })
                    .catch((err) => {
                        console.error(
                            "[Email] Failed to send approval email:",
                            err
                        );
                    });
            }

            console.log(
                `[Client Approval] Client ${client.email} approved by admin`
            );

            return NextResponse.json({
                message: "Client approuvé avec succès",
                client: {
                    id: updatedClient.id,
                    email: updatedClient.email,
                    clientPortalEnabled: updatedClient.clientPortalEnabled,
                },
            });
        } else {
            // Send rejection email before deleting if enabled in preferences
            if (notifPrefs?.notif_client_rejected && client.email) {
                await emailService
                    .sendClientRejection({
                        to: client.email,
                        clientName: `${client.prenom} ${client.nom}`,
                        entrepriseName,
                        reason,
                    })
                    .catch((err) => {
                        console.error(
                            "[Email] Failed to send rejection email:",
                            err
                        );
                    });
            }

            // Reject: delete the client
            await prisma.client.delete({
                where: { id: clientId },
            });

            console.log(
                `[Client Approval] Client ${client.email} rejected by admin`
            );

            return NextResponse.json({
                message: "Client rejeté",
            });
        }
    } catch (error) {
        return handleTenantError(error);
    }
}

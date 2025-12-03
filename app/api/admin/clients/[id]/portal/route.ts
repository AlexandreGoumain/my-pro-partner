import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError, NotFoundError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { EmailService } from "@/lib/services/email/email.service";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const enablePortalSchema = z.object({
    enable: z.boolean(),
    sendInvitation: z.boolean().optional(),
});

/**
 * POST /api/admin/clients/[id]/portal
 * Enable or disable portal access for a client
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id: clientId } = await params;

            const body = await req.json();
            const result = enablePortalSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { enable, sendInvitation = false } = result.data;

            // Check if client exists and belongs to company
            const client = await prisma.client.findFirst({
                where: {
                    id: clientId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!client) {
                throw new NotFoundError("Client");
            }

            // Check if client has an email
            if (!client.email) {
                throw new BusinessError(
                    "Le client doit avoir une adresse email pour accéder au portail"
                );
            }

            let temporaryPassword: string | undefined;
            let hashedPassword: string | undefined;

            // If enabling and no password set, generate temporary password
            if (enable && !client.password) {
                temporaryPassword = nanoid(12);
                hashedPassword = await bcrypt.hash(temporaryPassword, 10);
            }

            // Update client
            const updatedClient = await prisma.client.update({
                where: { id: clientId },
                data: {
                    clientPortalEnabled: enable,
                    ...(hashedPassword && { password: hashedPassword }),
                },
            });

            // Send invitation email if requested
            if (enable && sendInvitation && temporaryPassword) {
                const clientName = client.prenom
                    ? `${client.prenom} ${client.nom}`
                    : client.nom;

                await EmailService.sendWelcomeEmail(
                    client.email!,
                    temporaryPassword,
                    clientName
                );
            }

            return NextResponse.json({
                client: {
                    id: updatedClient.id,
                    clientPortalEnabled: updatedClient.clientPortalEnabled,
                },
                temporaryPassword:
                    enable && temporaryPassword ? temporaryPassword : undefined,
                message: enable
                    ? "Portail activé avec succès"
                    : "Portail désactivé avec succès",
            });
        },
        {
            context: { resourceName: "Client", operation: "togglePortal" },
        }
    );
}

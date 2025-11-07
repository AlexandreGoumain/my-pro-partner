import { NextRequest, NextResponse } from "next/server";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { nanoid } from "nanoid";
import { EmailService } from "@/lib/services/email/email.service";

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
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id: clientId } = await params;

        const body = await req.json();
        const validation = enablePortalSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Donn�es invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { enable, sendInvitation = false } = validation.data;

        // Check if client exists and belongs to company
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
            },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouv�" },
                { status: 404 }
            );
        }

        // Check if client has an email
        if (!client.email) {
            return NextResponse.json(
                { message: "Le client doit avoir une adresse email pour acc�der au portail" },
                { status: 400 }
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

            console.log(
                `[Portal Activation] Welcome email sent to ${client.email}`
            );
        }

        return NextResponse.json({
            client: {
                id: updatedClient.id,
                clientPortalEnabled: updatedClient.clientPortalEnabled,
            },
            temporaryPassword: enable && temporaryPassword ? temporaryPassword : undefined,
            message: enable
                ? "Portail activé avec succès"
                : "Portail désactivé avec succès",
        });
    } catch (error) {
        return handleTenantError(error);
    }
}

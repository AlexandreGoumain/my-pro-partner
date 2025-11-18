import { emailService } from "@/lib/email/email-service";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/utils/validation-helper";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inviteClientSchema = z.object({
    email: z.string().email("Email invalide"),
    nom: z.string().optional(),
    prenom: z.string().optional(),
    telephone: z.string().optional(),
    message: z.string().optional(), // Message personnalisé dans l'email
});

/**
 * POST /api/admin/clients/invite
 * Send invitation email to a client to create their portal account
 */
export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const body = await req.json();
        const result = validateRequest(inviteClientSchema, body);
        if (!result.success) return result.response;

        const { email, nom, prenom, telephone } = result.data;

        // Check if client with this email already exists and has portal access
        const existingClient = await prisma.client.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
                entrepriseId,
            },
        });

        if (existingClient && existingClient.clientPortalEnabled) {
            return NextResponse.json(
                { message: "Ce client a déjà accès au portail" },
                { status: 409 }
            );
        }

        // Check if there's already a pending invitation
        const existingInvitation = await prisma.invitationToken.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
                entrepriseId,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (existingInvitation) {
            // Resend the same invitation
            // Get entreprise info for email
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: entrepriseId },
                include: { parametres: true },
            });

            // Send invitation email if enabled in preferences
            if (entreprise?.parametres?.notif_client_invitation) {
                const clientName =
                    nom && prenom ? `${prenom} ${nom}` : undefined;
                await emailService
                    .sendClientInvitation({
                        to: email,
                        clientName,
                        entrepriseName: entreprise.nom || "Notre entreprise",
                        invitationToken: existingInvitation.token,
                    })
                    .catch((err) => {
                        console.error(
                            "[Email] Failed to send invitation email:",
                            err
                        );
                    });
            }

            console.log(
                `[Client Invitation] Resending invitation to ${email} with token ${existingInvitation.token}`
            );

            return NextResponse.json({
                message: "Invitation renvoyée avec succès",
                invitationToken:
                    process.env.NODE_ENV === "development"
                        ? existingInvitation.token
                        : undefined,
                invitationLink:
                    process.env.NODE_ENV === "development"
                        ? `${process.env.NEXTAUTH_URL}/client/register?token=${existingInvitation.token}`
                        : undefined,
            });
        }

        // Generate invitation token (valid for 7 days)
        const token = nanoid(32);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = await prisma.invitationToken.create({
            data: {
                token,
                email,
                nom: nom || null,
                prenom: prenom || null,
                telephone: telephone || null,
                entrepriseId,
                expiresAt,
            },
        });

        // Get entreprise info for email
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            include: { parametres: true },
        });

        // Send invitation email if enabled in preferences
        if (entreprise?.parametres?.notif_client_invitation) {
            const clientName = nom && prenom ? `${prenom} ${nom}` : undefined;
            await emailService
                .sendClientInvitation({
                    to: email,
                    clientName,
                    entrepriseName: entreprise.nom || "Notre entreprise",
                    invitationToken: token,
                })
                .catch((err) => {
                    console.error(
                        "[Email] Failed to send invitation email:",
                        err
                    );
                });
        }

        console.log(
            `[Client Invitation] Invitation created for ${email} with token ${token}`
        );
        console.log(
            `[Client Invitation] Link: ${process.env.NEXTAUTH_URL}/client/register?token=${token}`
        );

        return NextResponse.json({
            message: "Invitation envoyée avec succès",
            invitation: {
                id: invitation.id,
                email: invitation.email,
                expiresAt: invitation.expiresAt,
            },
            // In development, return the token for testing
            invitationToken:
                process.env.NODE_ENV === "development" ? token : undefined,
            invitationLink:
                process.env.NODE_ENV === "development"
                    ? `${process.env.NEXTAUTH_URL}/client/register?token=${token}`
                    : undefined,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}

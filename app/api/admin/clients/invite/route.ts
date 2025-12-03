import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError, ValidationError } from "@/lib/errors";
import { emailService } from "@/lib/email/email-service";
import { prisma } from "@/lib/prisma";
import { clientInviteLimiter } from "@/lib/rate-limit";
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
    return withApiHandler(
        async (ctx) => {
            // Rate limiting par entreprise
            const { success: rateLimitOk } = await clientInviteLimiter.limit(
                ctx.entrepriseId
            );
            if (!rateLimitOk) {
                throw new BusinessError(
                    "Trop d'invitations envoyées. Réessayez plus tard."
                );
            }

            const body = await req.json();
            const result = inviteClientSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { email, nom, prenom, telephone } = result.data;

            // Check if client with this email already exists and has portal access
            const existingClient = await prisma.client.findFirst({
                where: {
                    email: {
                        equals: email,
                        mode: "insensitive",
                    },
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (existingClient && existingClient.clientPortalEnabled) {
                throw new BusinessError("Ce client a déjà accès au portail");
            }

            // Check if there's already a pending invitation
            const existingInvitation = await prisma.invitationToken.findFirst({
                where: {
                    email: {
                        equals: email,
                        mode: "insensitive",
                    },
                    entrepriseId: ctx.entrepriseId,
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
                    where: { id: ctx.entrepriseId },
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

                return NextResponse.json({
                    message: "Invitation renvoyée avec succès",
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
                    entrepriseId: ctx.entrepriseId,
                    expiresAt,
                },
            });

            // Get entreprise info for email
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: ctx.entrepriseId },
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

            return NextResponse.json({
                message: "Invitation envoyée avec succès",
                invitation: {
                    id: invitation.id,
                    email: invitation.email,
                    expiresAt: invitation.expiresAt,
                },
            });
        },
        {
            context: { resourceName: "Client", operation: "invite" },
        }
    );
}

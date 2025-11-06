import { NextRequest, NextResponse } from "next/server";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { nanoid } from "nanoid";

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
    const validation = inviteClientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, nom, prenom, telephone, message } = validation.data;

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
      // TODO: Send email with existing token
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
      select: { nom: true, email: true },
    });

    // TODO: Send invitation email with token
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
      invitationToken: process.env.NODE_ENV === "development" ? token : undefined,
      invitationLink:
        process.env.NODE_ENV === "development"
          ? `${process.env.NEXTAUTH_URL}/client/register?token=${token}`
          : undefined,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}

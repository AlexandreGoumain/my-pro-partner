import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email/email-service";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";

const registerSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().optional(),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  invitationToken: z.string().min(1, "Le token d'invitation est requis"),
});

/**
 * POST /api/client/auth/register
 * Client registration via invitation only
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = validateRequest(registerSchema, body);
    if (!result.success) return result.response;

    const {
      nom,
      prenom,
      email,
      telephone,
      password,
      adresse,
      codePostal,
      ville,
      invitationToken,
    } = result.data;

    // Verify invitation token (required)
    const invitation = await prisma.invitationToken.findUnique({
      where: { token: invitationToken },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation invalide" },
        { status: 404 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Cette invitation a expiré" },
        { status: 410 }
      );
    }

    if (invitation.used) {
      return NextResponse.json(
        { message: "Cette invitation a déjà été utilisée" },
        { status: 410 }
      );
    }

    // Get entrepriseId from invitation (never sent from client for security)
    const entrepriseId = invitation.entrepriseId;

    // Get entreprise info with parametres for email preferences
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      include: { parametres: true },
    });

    if (!entreprise) {
      return NextResponse.json(
        { message: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    // Check if email already exists for this entreprise
    const existingClient = await prisma.client.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
        entrepriseId: entreprise.id,
      },
    });

    if (existingClient) {
      return NextResponse.json(
        { message: "Un compte avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create client with immediate portal access (invitation-only registration)
    const client = await prisma.client.create({
      data: {
        nom,
        prenom: prenom || null,
        email,
        telephone,
        password: hashedPassword,
        adresse: adresse || null,
        codePostal: codePostal || null,
        ville: ville || null,
        entrepriseId: entreprise.id,
        clientPortalEnabled: true, // Immediate access via invitation
        pendingApproval: false, // No approval needed for invited clients
      },
    });

    // Mark invitation token as used
    await prisma.invitationToken.update({
      where: { id: invitation.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    // Send welcome email if enabled in preferences
    if (entreprise.parametres?.notif_client_welcome) {
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/auth/login`;
      await emailService.sendClientWelcome({
        to: email,
        clientName: `${prenom || ''} ${nom}`.trim(),
        entrepriseName: entreprise.nom || "Notre entreprise",
        loginUrl,
      }).catch(err => {
        console.error('[Email] Failed to send welcome email:', err);
      });
    }

    return NextResponse.json({
      message: "Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.",
      client: {
        id: client.id,
        email: client.email,
        nom: client.nom,
      },
    });
  } catch (error) {
    console.error("[Client Registration] Error:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Le token est requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().optional(),
  prenom: z.string().optional(),
  telephone: z.string().optional(),
});

/**
 * POST /api/team/accept-invitation
 * Accept team invitation and create user account
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = acceptInvitationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { token, password, name, prenom, telephone } = validation.data;

    // Vérifier le token d'invitation
    const invitation = await prisma.userInvitationToken.findUnique({
      where: { token },
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

    // Vérifier que l'email n'est pas déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        name: name || invitation.name || "",
        prenom: prenom || invitation.prenom || "",
        telephone: telephone || "",
        role: invitation.role as any,
        status: "ACTIVE",
        entrepriseId: invitation.entrepriseId,
        onboardingComplete: true,
      },
    });

    // Créer les permissions par défaut pour ce rôle
    const { getDefaultPermissions } = await import(
      "@/lib/personnel/roles-config"
    );
    const defaultPerms = getDefaultPermissions(invitation.role as any);

    await prisma.userPermissions.create({
      data: {
        userId: user.id,
        ...defaultPerms,
      },
    });

    // Marquer l'invitation comme utilisée
    await prisma.userInvitationToken.update({
      where: { id: invitation.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    console.log(
      `[Team Invitation] New user created: ${invitation.email} for entreprise ${invitation.entrepriseId}`
    );

    return NextResponse.json({
      message:
        "Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Team Invitation] Error:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'acceptation de l'invitation" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/team/accept-invitation?token=xxx
 * Verify invitation token and get invitation details
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token manquant" },
        { status: 400 }
      );
    }

    // Vérifier le token d'invitation
    const invitation = await prisma.userInvitationToken.findUnique({
      where: { token },
      include: {
        entreprise: {
          select: {
            nom: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation invalide", valid: false },
        { status: 404 }
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Cette invitation a expiré", valid: false },
        { status: 410 }
      );
    }

    if (invitation.used) {
      return NextResponse.json(
        { message: "Cette invitation a déjà été utilisée", valid: false },
        { status: 410 }
      );
    }

    return NextResponse.json({
      valid: true,
      invitation: {
        email: invitation.email,
        name: invitation.name,
        prenom: invitation.prenom,
        role: invitation.role,
        entrepriseName: invitation.entreprise.nom,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error("[Team Invitation] Error:", error);
    return NextResponse.json(
      { message: "Erreur lors de la vérification de l'invitation" },
      { status: 500 }
    );
  }
}

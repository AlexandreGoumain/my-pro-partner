import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, tokenVerifyLimiter } from "@/lib/rate-limit";
import { validateRequest } from "@/lib/utils/validation-helper";
import { z } from "zod";

const verifyInvitationSchema = z.object({
  token: z.string().min(1, "Token requis"),
});

/**
 * POST /api/client/auth/verify-invitation
 * Verify invitation token and return pre-filled information
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting par IP pour prévenir le brute force
    const ip = getClientIp(req);
    const { success: rateLimitOk } = await tokenVerifyLimiter.limit(ip);
    if (!rateLimitOk) {
      return NextResponse.json(
        { message: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = validateRequest(verifyInvitationSchema, body);
    if (!result.success) return result.response;

    const { token } = result.data;

    // Find invitation token
    const invitation = await prisma.invitationToken.findUnique({
      where: {
        token,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation invalide ou expirée" },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Cette invitation a expiré" },
        { status: 410 }
      );
    }

    // Check if token was already used
    if (invitation.used) {
      return NextResponse.json(
        { message: "Cette invitation a déjà été utilisée" },
        { status: 410 }
      );
    }

    // Get entreprise info (only name, not ID for security)
    const entreprise = await prisma.entreprise.findUnique({
      where: {
        id: invitation.entrepriseId,
      },
      select: {
        nom: true,
      },
    });

    if (!entreprise) {
      return NextResponse.json(
        { message: "Entreprise introuvable" },
        { status: 404 }
      );
    }

    // Return invitation details (without entrepriseId for security)
    return NextResponse.json({
      valid: true,
      invitation: {
        email: invitation.email,
        nom: invitation.nom,
        prenom: invitation.prenom,
        telephone: invitation.telephone,
        entrepriseName: entreprise.nom,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error("[Verify Invitation] Error:", error);
    return NextResponse.json(
      { message: "Erreur lors de la vérification de l'invitation" },
      { status: 500 }
    );
  }
}

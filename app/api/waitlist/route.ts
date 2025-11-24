import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import { publicFormLimiter, getClientIp } from "@/lib/rate-limit";

// Schéma de validation
const waitlistSchema = z.object({
  email: z.string().email("Email invalide"),
  company: z.string().optional(),
  phone: z.string().optional(),
  templateType: z.string().optional(),
  // Honeypot: ce champ doit rester vide (protection anti-bot)
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const { success, limit, remaining, reset } = await publicFormLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
          rateLimitReset: new Date(reset).toISOString()
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    const body = await request.json();

    // Validation
    const validatedData = waitlistSchema.parse(body);

    // Honeypot: si le champ "website" est rempli, c'est un bot
    if (validatedData.website && validatedData.website.trim() !== "") {
      // On retourne un succès pour tromper le bot, mais on ne fait rien
      return NextResponse.json({
        success: true,
        message: "Inscription réussie",
      });
    }

    // Vérifier si l'email existe déjà
    const existing = await prisma.waitlist.findUnique({
      where: { email: validatedData.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà inscrit" },
        { status: 400 }
      );
    }

    // Créer le lead
    const lead = await prisma.waitlist.create({
      data: {
        email: validatedData.email,
        company: validatedData.company,
        phone: validatedData.phone,
        templateType: validatedData.templateType,
      },
    });

    // TODO: Envoyer email de confirmation (optionnel)
    // TODO: Notification Slack/Discord (optionnel)

    return NextResponse.json({
      success: true,
      message: "Inscription réussie",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    // Gestion des erreurs de contrainte unique Prisma (P2002)
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Cet email est déjà inscrit" },
          { status: 400 }
        );
      }
    }

    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite" },
      { status: 500 }
    );
  }
}

// GET endpoint supprimé pour raisons de sécurité
// Les stats sont maintenant accessibles uniquement via /api/waitlist/count
// Pour accéder aux données complètes, utilisez le dashboard admin (authentification requise)

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";
import { publicFormLimiter, getClientIp, safeRateLimit } from "@/lib/rate-limit";

// Schéma de validation renforcé
const waitlistSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .max(255, "Email trop long")
    .transform((val) => val.toLowerCase().trim()),
  company: z
    .string()
    .max(100, "Nom d'entreprise trop long")
    .optional()
    .transform((val) => val?.trim()),
  phone: z
    .string()
    .max(20, "Numéro trop long")
    .regex(/^[\d\s+\-().]*$/, "Format de téléphone invalide")
    .optional()
    .transform((val) => val?.trim()),
  templateType: z.string().max(50).optional(),
  // Honeypot: ce champ doit rester vide (protection anti-bot)
  website: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);

  try {
    // Rate limiting avec gestion d'erreur gracieuse
    const rateLimitResult = await safeRateLimit(publicFormLimiter, ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
          rateLimitReset: rateLimitResult.reset
            ? new Date(rateLimitResult.reset).toISOString()
            : undefined,
        },
        {
          status: 429,
          headers: {
            ...(rateLimitResult.limit && {
              "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            }),
            ...(rateLimitResult.remaining !== undefined && {
              "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            }),
            ...(rateLimitResult.reset && {
              "X-RateLimit-Reset": rateLimitResult.reset.toString(),
            }),
          },
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
    await prisma.waitlist.create({
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

    console.error("[Waitlist] Error details:", {
      type: error?.constructor?.name,
      message: error instanceof Error ? error.message : String(error),
      ip,
    });
    return NextResponse.json(
      { error: "Une erreur s'est produite" },
      { status: 500 }
    );
  }
}

// GET endpoint supprimé pour raisons de sécurité
// Les stats sont maintenant accessibles uniquement via /api/waitlist/count
// Pour accéder aux données complètes, utilisez le dashboard admin (authentification requise)

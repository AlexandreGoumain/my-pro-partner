import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { PaymentLinkService } from "@/lib/services/payment-link.service";
import { z } from "zod";

const createPaymentLinkSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  montant: z.number().positive("Le montant doit être positif"),
  quantiteMax: z.number().int().positive().optional(),
  dateExpiration: z.string().datetime().optional(),
  imageCouverture: z.string().url().optional(),
  messageSucces: z.string().optional(),
  metadata: z.any().optional(),
});

/**
 * GET /api/payment-links
 * Récupérer tous les liens de paiement
 */
export async function GET(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const paymentLinks = await PaymentLinkService.getPaymentLinks(
      entrepriseId
    );

    return NextResponse.json({ paymentLinks });
  } catch (error) {
    return handleTenantError(error);
  }
}

/**
 * POST /api/payment-links
 * Créer un nouveau lien de paiement
 */
export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const validation = createPaymentLinkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const paymentLink = await PaymentLinkService.createPaymentLink({
      entrepriseId,
      titre: data.titre,
      description: data.description,
      montant: data.montant,
      quantiteMax: data.quantiteMax,
      dateExpiration: data.dateExpiration ? new Date(data.dateExpiration) : undefined,
      imageCouverture: data.imageCouverture,
      messageSucces: data.messageSucces,
      metadata: data.metadata,
    });

    return NextResponse.json({ paymentLink }, { status: 201 });
  } catch (error) {
    return handleTenantError(error);
  }
}

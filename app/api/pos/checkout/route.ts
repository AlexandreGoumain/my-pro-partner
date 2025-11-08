import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      articleId: z.string(),
      quantite: z.number().positive(),
      prix_ht: z.number(),
      tva_taux: z.number(),
      remise_pourcent: z.number().optional(),
    })
  ),
  clientId: z.string().optional().nullable(),
  remiseGlobale: z.number().optional().default(0),
  paymentMethod: z.enum(["CARTE", "ESPECES", "CHEQUE", "VIREMENT"]),
});

/**
 * POST /api/pos/checkout
 * Encaisser une vente POS
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { items, clientId, remiseGlobale, paymentMethod } = validation.data;

    // Si pas de client, créer un client générique "Vente comptoir"
    let finalClientId = clientId;
    if (!clientId) {
      const comptoir = await prisma.client.findFirst({
        where: {
          entrepriseId: session.user.entrepriseId,
          nom: "Vente comptoir",
        },
      });

      if (comptoir) {
        finalClientId = comptoir.id;
      } else {
        const newComptoir = await prisma.client.create({
          data: {
            entrepriseId: session.user.entrepriseId,
            nom: "Vente comptoir",
            prenom: "",
            email: null,
          },
        });
        finalClientId = newComptoir.id;
      }
    }

    // Générer numéro de facture
    const today = new Date();
    const count = await prisma.document.count({
      where: {
        entrepriseId: session.user.entrepriseId,
        type: "FACTURE",
      },
    });
    const numero = `FACT-${today.getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    // Calculer les totaux
    let total_ht = 0;
    let total_tva = 0;

    const lignes = items.map((item, index) => {
      const montant_ht_ligne = item.prix_ht * item.quantite;
      const remise_ligne = item.remise_pourcent
        ? (montant_ht_ligne * item.remise_pourcent) / 100
        : 0;
      const montant_ht_apres_remise = montant_ht_ligne - remise_ligne;
      const montant_apres_remise_globale =
        montant_ht_apres_remise * (1 - remiseGlobale / 100);
      const tva_ligne = (montant_apres_remise_globale * item.tva_taux) / 100;
      const montant_ttc = montant_apres_remise_globale + tva_ligne;

      total_ht += montant_apres_remise_globale;
      total_tva += tva_ligne;

      return {
        ordre: index + 1,
        articleId: item.articleId,
        designation: "", // Sera rempli par Prisma via relation
        quantite: item.quantite,
        prix_unitaire_ht: item.prix_ht,
        tva_taux: item.tva_taux,
        remise_pourcent: item.remise_pourcent || 0,
        montant_ht: montant_apres_remise_globale,
        montant_tva: tva_ligne,
        montant_ttc,
      };
    });

    const total_ttc = total_ht + total_tva;

    // Créer la facture
    const document = await prisma.document.create({
      data: {
        entrepriseId: session.user.entrepriseId,
        clientId: finalClientId!,
        type: "FACTURE",
        numero,
        dateEmission: today,
        statut: "PAYE", // Payé immédiatement en caisse
        total_ht,
        total_tva,
        total_ttc,
        reste_a_payer: 0,
        lignes: {
          create: lignes,
        },
      },
      include: {
        lignes: {
          include: {
            article: true,
          },
        },
        client: true,
      },
    });

    // Enregistrer le paiement
    await prisma.paiement.create({
      data: {
        documentId: document.id,
        date_paiement: today,
        montant: total_ttc,
        moyen_paiement: paymentMethod,
        notes: "Paiement caisse (POS)",
      },
    });

    // Mettre à jour les stocks
    for (const item of items) {
      const article = await prisma.article.findUnique({
        where: { id: item.articleId },
      });

      if (article && article.gestion_stock) {
        await prisma.article.update({
          where: { id: item.articleId },
          data: {
            stock_actuel: { decrement: item.quantite },
          },
        });

        await prisma.mouvementStock.create({
          data: {
            entrepriseId: session.user.entrepriseId,
            articleId: item.articleId,
            type: "SORTIE",
            quantite: item.quantite,
            stock_avant: article.stock_actuel,
            stock_apres: article.stock_actuel - item.quantite,
            motif: "Vente caisse",
            reference: numero,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      document,
      ticketUrl: `/api/pos/ticket/${document.id}`,
    });
  } catch (error: any) {
    console.error("[POS_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'encaissement" },
      { status: 500 }
    );
  }
}

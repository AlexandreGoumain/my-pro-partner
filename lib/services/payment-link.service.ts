import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe-config";
import { eurosToCents } from "@/lib/utils/payment-utils";
import Stripe from "stripe";

/**
 * Service de gestion des liens de paiement
 */
export class PaymentLinkService {
  /**
   * Créer un lien de paiement
   */
  static async createPaymentLink({
    entrepriseId,
    titre,
    description,
    montant,
    quantiteMax,
    dateExpiration,
    imageCouverture,
    messageSucces,
    metadata,
  }: {
    entrepriseId: string;
    titre: string;
    description?: string;
    montant: number;
    quantiteMax?: number;
    dateExpiration?: Date;
    imageCouverture?: string;
    messageSucces?: string;
    metadata?: any;
  }) {
    // Générer un slug unique
    const slug = await this.generateUniqueSlug(titre);

    // Créer le lien de paiement en BDD
    const paymentLink = await prisma.paymentLink.create({
      data: {
        entrepriseId,
        slug,
        titre,
        description,
        montant,
        quantiteMax,
        dateExpiration,
        imageCouverture,
        messageSucces,
        metadata,
      },
    });

    return paymentLink;
  }

  /**
   * Générer un slug unique à partir du titre
   */
  private static async generateUniqueSlug(titre: string): Promise<string> {
    const baseSlug = titre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^a-z0-9]+/g, "-") // Remplacer caractères spéciaux par -
      .replace(/^-+|-+$/g, ""); // Supprimer - au début/fin

    let slug = baseSlug;
    let counter = 1;

    // Vérifier l'unicité
    while (await prisma.paymentLink.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Récupérer un lien de paiement par slug
   */
  static async getPaymentLinkBySlug(slug: string) {
    const paymentLink = await prisma.paymentLink.findUnique({
      where: { slug },
      include: {
        entreprise: {
          select: {
            nom: true,
            email: true,
            parametres: {
              select: {
                logo_url: true,
                nom_entreprise: true,
              },
            },
          },
        },
      },
    });

    if (!paymentLink) {
      return null;
    }

    // Vérifier si le lien est encore valide
    const isValid = this.isPaymentLinkValid(paymentLink);

    return {
      ...paymentLink,
      isValid,
    };
  }

  /**
   * Vérifier si un lien de paiement est valide
   */
  static isPaymentLinkValid(paymentLink: any): boolean {
    // Vérifier si actif
    if (!paymentLink.actif) {
      return false;
    }

    // Vérifier expiration
    if (paymentLink.dateExpiration && new Date() > paymentLink.dateExpiration) {
      return false;
    }

    // Vérifier quantité max
    if (
      paymentLink.quantiteMax &&
      paymentLink.quantitePaye >= paymentLink.quantiteMax
    ) {
      return false;
    }

    return true;
  }

  /**
   * Incrémenter le compteur de vues
   */
  static async incrementViews(paymentLinkId: string) {
    await prisma.paymentLink.update({
      where: { id: paymentLinkId },
      data: {
        nombreVues: { increment: 1 },
      },
    });
  }

  /**
   * Créer une session Stripe Checkout pour un lien de paiement
   */
  static async createCheckoutSession({
    paymentLink,
    successUrl,
    cancelUrl,
  }: {
    paymentLink: any;
    successUrl: string;
    cancelUrl: string;
  }): Promise<Stripe.Checkout.Session> {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: paymentLink.devise.toLowerCase(),
            unit_amount: eurosToCents(Number(paymentLink.montant)),
            product_data: {
              name: paymentLink.titre,
              description: paymentLink.description || undefined,
              images: paymentLink.imageCouverture
                ? [paymentLink.imageCouverture]
                : undefined,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: {
        paymentLinkId: paymentLink.id,
        entrepriseId: paymentLink.entrepriseId,
        ...paymentLink.metadata,
      },
    });

    return session;
  }

  /**
   * Enregistrer un paiement réussi
   */
  static async recordPayment({
    paymentLinkId,
    montant,
  }: {
    paymentLinkId: string;
    montant: number;
  }) {
    await prisma.paymentLink.update({
      where: { id: paymentLinkId },
      data: {
        nombrePaiements: { increment: 1 },
        quantitePaye: { increment: 1 },
        totalCollecte: { increment: montant },
      },
    });
  }

  /**
   * Récupérer tous les liens de paiement d'une entreprise
   */
  static async getPaymentLinks(entrepriseId: string) {
    const paymentLinks = await prisma.paymentLink.findMany({
      where: { entrepriseId },
      orderBy: { createdAt: "desc" },
    });

    return paymentLinks.map((link) => ({
      ...link,
      isValid: this.isPaymentLinkValid(link),
      tauxConversion:
        link.nombreVues > 0
          ? ((link.nombrePaiements / link.nombreVues) * 100).toFixed(1)
          : "0",
    }));
  }

  /**
   * Désactiver un lien de paiement
   */
  static async disablePaymentLink(paymentLinkId: string) {
    await prisma.paymentLink.update({
      where: { id: paymentLinkId },
      data: { actif: false },
    });
  }

  /**
   * Supprimer un lien de paiement
   */
  static async deletePaymentLink(paymentLinkId: string) {
    await prisma.paymentLink.delete({
      where: { id: paymentLinkId },
    });
  }
}

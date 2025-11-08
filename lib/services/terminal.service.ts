import { stripe } from "@/lib/stripe/stripe-config";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

/**
 * Service de gestion des terminaux de paiement Stripe Terminal
 */
export class TerminalService {
  /**
   * Lister tous les terminaux Stripe disponibles
   */
  static async listStripeTerminals() {
    const readers = await stripe.terminal.readers.list({ limit: 100 });
    return readers.data;
  }

  /**
   * Enregistrer un terminal dans la BDD
   */
  static async registerTerminal({
    entrepriseId,
    stripeTerminalId,
    label,
    location,
  }: {
    entrepriseId: string;
    stripeTerminalId: string;
    label: string;
    location?: string;
  }) {
    // Récupérer les infos du terminal depuis Stripe
    const reader = await stripe.terminal.readers.retrieve(stripeTerminalId);

    const terminal = await prisma.terminal.create({
      data: {
        entrepriseId,
        stripeTerminalId,
        label,
        location,
        device_type: reader.device_type,
        serial_number: reader.serial_number || null,
        ip_address: reader.ip_address || null,
        status: reader.status === "online" ? "ONLINE" : "OFFLINE",
        lastSyncAt: new Date(),
      },
    });

    return terminal;
  }

  /**
   * Créer une intention de paiement pour un terminal
   */
  static async createPaymentIntent({
    terminalId,
    amount,
    currency = "eur",
    description,
  }: {
    terminalId: string;
    amount: number; // En centimes
    currency?: string;
    description?: string;
  }) {
    const terminal = await prisma.terminal.findUnique({
      where: { id: terminalId },
    });

    if (!terminal) {
      throw new Error("Terminal introuvable");
    }

    // Créer le Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card_present"],
      capture_method: "automatic",
      description,
    });

    return paymentIntent;
  }

  /**
   * Traiter un paiement sur un terminal
   */
  static async processPayment({
    terminalId,
    paymentIntentId,
  }: {
    terminalId: string;
    paymentIntentId: string;
  }) {
    const terminal = await prisma.terminal.findUnique({
      where: { id: terminalId },
    });

    if (!terminal) {
      throw new Error("Terminal introuvable");
    }

    // Marquer le terminal comme occupé
    await prisma.terminal.update({
      where: { id: terminalId },
      data: { status: "BUSY" },
    });

    try {
      // Traiter le paiement sur le terminal Stripe
      const reader = await stripe.terminal.readers.processPaymentIntent(
        terminal.stripeTerminalId,
        { payment_intent: paymentIntentId }
      );

      // Mettre à jour le statut
      await prisma.terminal.update({
        where: { id: terminalId },
        data: {
          status: "ONLINE",
          lastUsedAt: new Date(),
        },
      });

      return reader;
    } catch (error) {
      // En cas d'erreur, remettre le terminal en ligne
      await prisma.terminal.update({
        where: { id: terminalId },
        data: { status: "ONLINE" },
      });
      throw error;
    }
  }

  /**
   * Annuler un paiement en cours
   */
  static async cancelPayment({
    terminalId,
    paymentIntentId,
  }: {
    terminalId: string;
    paymentIntentId: string;
  }) {
    const terminal = await prisma.terminal.findUnique({
      where: { id: terminalId },
    });

    if (!terminal) {
      throw new Error("Terminal introuvable");
    }

    // Annuler sur Stripe
    await stripe.terminal.readers.cancelAction(terminal.stripeTerminalId);

    // Annuler le Payment Intent
    await stripe.paymentIntents.cancel(paymentIntentId);

    // Remettre le terminal en ligne
    await prisma.terminal.update({
      where: { id: terminalId },
      data: { status: "ONLINE" },
    });
  }

  /**
   * Synchroniser le statut d'un terminal
   */
  static async syncTerminalStatus(terminalId: string) {
    const terminal = await prisma.terminal.findUnique({
      where: { id: terminalId },
    });

    if (!terminal) {
      throw new Error("Terminal introuvable");
    }

    try {
      const reader = await stripe.terminal.readers.retrieve(terminal.stripeTerminalId);

      await prisma.terminal.update({
        where: { id: terminalId },
        data: {
          status: reader.status === "online" ? "ONLINE" : "OFFLINE",
          lastSyncAt: new Date(),
        },
      });

      return reader;
    } catch (error) {
      await prisma.terminal.update({
        where: { id: terminalId },
        data: { status: "ERROR" },
      });
      throw error;
    }
  }

  /**
   * Récupérer tous les terminaux d'une entreprise
   */
  static async getTerminals(entrepriseId: string) {
    return await prisma.terminal.findMany({
      where: { entrepriseId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Supprimer un terminal
   */
  static async deleteTerminal(terminalId: string) {
    await prisma.terminal.delete({
      where: { id: terminalId },
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/analytics
 * Récupérer les analytics de l'entreprise
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get("period") || "30d";

    // Calculer la date de début selon la période
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "12m":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    }

    // Récupérer les documents de la période
    const documents = await prisma.document.findMany({
      where: {
        entrepriseId: session.user.entrepriseId,
        type: "FACTURE",
        statut: "PAYE",
        dateEmission: {
          gte: startDate,
        },
      },
      include: {
        client: true,
        paiements: true,
        lignes: {
          include: {
            article: true,
          },
        },
      },
    });

    // Récupérer les documents de la période précédente (pour comparaison)
    const previousDocuments = await prisma.document.findMany({
      where: {
        entrepriseId: session.user.entrepriseId,
        type: "FACTURE",
        statut: "PAYE",
        dateEmission: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    });

    // Calculer les totaux
    const totalRevenue = documents.reduce(
      (sum, doc) => sum + Number(doc.total_ttc),
      0
    );
    const previousRevenue = previousDocuments.reduce(
      (sum, doc) => sum + Number(doc.total_ttc),
      0
    );
    const revenueChange =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const totalOrders = documents.length;
    const previousOrders = previousDocuments.length;
    const ordersChange =
      previousOrders > 0
        ? ((totalOrders - previousOrders) / previousOrders) * 100
        : 0;

    // Clients uniques
    const clientIds = new Set(documents.map((doc) => doc.clientId));
    const totalClients = clientIds.size;
    const previousClientIds = new Set(
      previousDocuments.map((doc) => doc.clientId)
    );
    const clientsChange =
      previousClientIds.size > 0
        ? ((totalClients - previousClientIds.size) / previousClientIds.size) * 100
        : 0;

    // Panier moyen
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const previousAverageOrder =
      previousOrders > 0 ? previousRevenue / previousOrders : 0;
    const averageOrderChange =
      previousAverageOrder > 0
        ? ((averageOrder - previousAverageOrder) / previousAverageOrder) * 100
        : 0;

    // Top clients
    const clientStats = new Map<
      string,
      { client: any; totalSpent: number; orderCount: number }
    >();

    documents.forEach((doc) => {
      const existing = clientStats.get(doc.clientId);
      if (existing) {
        existing.totalSpent += Number(doc.total_ttc);
        existing.orderCount++;
      } else {
        clientStats.set(doc.clientId, {
          client: doc.client,
          totalSpent: Number(doc.total_ttc),
          orderCount: 1,
        });
      }
    });

    const topClients = Array.from(clientStats.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)
      .map((stat) => ({
        id: stat.client.id,
        nom: stat.client.nom,
        prenom: stat.client.prenom,
        totalSpent: stat.totalSpent,
        orderCount: stat.orderCount,
      }));

    // Top products
    const productStats = new Map<
      string,
      { id: string; nom: string; totalSold: number; revenue: number }
    >();

    documents.forEach((doc) => {
      doc.lignes.forEach((ligne) => {
        if (ligne.article) {
          const existing = productStats.get(ligne.article.id);
          if (existing) {
            existing.totalSold += ligne.quantite;
            existing.revenue += Number(ligne.montant_ttc);
          } else {
            productStats.set(ligne.article.id, {
              id: ligne.article.id,
              nom: ligne.article.nom,
              totalSold: ligne.quantite,
              revenue: Number(ligne.montant_ttc),
            });
          }
        }
      });
    });

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Moyens de paiement
    const paymentStats = new Map<string, { count: number; amount: number }>();

    documents.forEach((doc) => {
      doc.paiements.forEach((paiement) => {
        const existing = paymentStats.get(paiement.moyen_paiement);
        if (existing) {
          existing.count++;
          existing.amount += Number(paiement.montant);
        } else {
          paymentStats.set(paiement.moyen_paiement, {
            count: 1,
            amount: Number(paiement.montant),
          });
        }
      });
    });

    const paymentMethods = Array.from(paymentStats.entries()).map(
      ([method, stats]) => ({
        method,
        count: stats.count,
        amount: stats.amount,
      })
    );

    const data = {
      overview: {
        totalRevenue,
        revenueChange,
        totalOrders,
        ordersChange,
        totalClients,
        clientsChange,
        averageOrder,
        averageOrderChange,
      },
      topClients,
      topProducts,
      paymentMethods,
    };

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("[ANALYTICS_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des analytics" },
      { status: 500 }
    );
  }
}

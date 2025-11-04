import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { entrepriseId: true },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        // Get query parameters for filtering and sorting
        const searchParams = req.nextUrl.searchParams;
        const sortBy = searchParams.get("sortBy") || "dateEcheance";
        const sortOrder = searchParams.get("sortOrder") || "asc";
        const clientId = searchParams.get("clientId");
        const minAmount = searchParams.get("minAmount");
        const overdueOnly = searchParams.get("overdueOnly") === "true";

        // Build where clause
        const where: any = {
            entrepriseId: user.entrepriseId,
            type: "FACTURE",
            statut: {
                notIn: ["PAYE", "ANNULE"],
            },
            reste_a_payer: {
                gt: 0,
            },
        };

        if (clientId) {
            where.clientId = clientId;
        }

        if (minAmount) {
            where.reste_a_payer = {
                gte: parseFloat(minAmount),
            };
        }

        if (overdueOnly) {
            where.dateEcheance = {
                lt: new Date(),
            };
        }

        // Get unpaid invoices with client details
        const unpaidInvoices = await prisma.document.findMany({
            where,
            select: {
                id: true,
                numero: true,
                dateEmission: true,
                dateEcheance: true,
                total_ttc: true,
                reste_a_payer: true,
                statut: true,
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                        ville: true,
                    },
                },
            },
            orderBy: {
                [sortBy]: sortOrder === "desc" ? "desc" : "asc",
            },
        });

        const now = new Date();

        // Calculate days overdue and format data
        const formattedInvoices = unpaidInvoices.map((invoice) => {
            const daysOverdue = invoice.dateEcheance
                ? Math.floor(
                      (now.getTime() - new Date(invoice.dateEcheance).getTime()) /
                          (1000 * 60 * 60 * 24)
                  )
                : 0;

            return {
                id: invoice.id,
                numero: invoice.numero,
                dateEmission: invoice.dateEmission,
                dateEcheance: invoice.dateEcheance,
                daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
                isOverdue: daysOverdue > 0,
                montantTTC: Number(invoice.total_ttc),
                resteAPayer: Number(invoice.reste_a_payer),
                statut: invoice.statut,
                client: {
                    id: invoice.client.id,
                    nom: invoice.client.nom,
                    prenom: invoice.client.prenom,
                    email: invoice.client.email,
                    telephone: invoice.client.telephone,
                    ville: invoice.client.ville,
                },
            };
        });

        // Calculate summary statistics
        const totalUnpaid = formattedInvoices.reduce(
            (sum, inv) => sum + inv.resteAPayer,
            0
        );

        const overdueCount = formattedInvoices.filter((inv) => inv.isOverdue).length;

        const totalOverdue = formattedInvoices
            .filter((inv) => inv.isOverdue)
            .reduce((sum, inv) => sum + inv.resteAPayer, 0);

        const averageOverdueDays =
            overdueCount > 0
                ? formattedInvoices
                      .filter((inv) => inv.isOverdue)
                      .reduce((sum, inv) => sum + inv.daysOverdue, 0) / overdueCount
                : 0;

        return NextResponse.json({
            invoices: formattedInvoices,
            summary: {
                totalInvoices: formattedInvoices.length,
                totalUnpaid,
                overdueCount,
                totalOverdue,
                averageOverdueDays: Math.round(averageOverdueDays),
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des factures impayées:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/analytics/sales
 * Get sales analytics
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            // Get all documents
            const documents = await prisma.document.findMany({
                where: { entrepriseId: ctx.entrepriseId },
                select: {
                    type: true,
                    total_ttc: true,
                    statut: true,
                    dateEmission: true,
                    dateEcheance: true,
                    createdAt: true,
                },
            });

            const now = new Date();
            const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

            // Calculate stats
            const quotes = documents.filter((d) => d.type === "DEVIS");
            const invoices = documents.filter((d) => d.type === "FACTURE");

            const totalRevenue = invoices
                .filter((i) => i.statut === "PAYE")
                .reduce((sum, i) => sum + Number(i.total_ttc), 0);

            const paidInvoices = invoices.filter((i) => i.statut === "PAYE").length;
            const unpaidInvoices = invoices.filter(
                (i) => i.statut !== "PAYE" && i.statut !== "ANNULE"
            ).length;

            const overdueInvoices = invoices.filter(
                (i) =>
                    i.statut !== "PAYE" &&
                    i.statut !== "ANNULE" &&
                    i.dateEcheance &&
                    new Date(i.dateEcheance) < now
            ).length;

            const revenueThisMonth = invoices
                .filter(
                    (i) =>
                        i.statut === "PAYE" &&
                        new Date(i.dateEmission) >= firstDayThisMonth
                )
                .reduce((sum, i) => sum + Number(i.total_ttc), 0);

            const revenueLastMonth = invoices
                .filter(
                    (i) =>
                        i.statut === "PAYE" &&
                        new Date(i.dateEmission) >= firstDayLastMonth &&
                        new Date(i.dateEmission) < firstDayThisMonth
                )
                .reduce((sum, i) => sum + Number(i.total_ttc), 0);

            const averageQuoteValue =
                quotes.length > 0
                    ? quotes.reduce((sum, q) => sum + Number(q.total_ttc), 0) / quotes.length
                    : 0;

            const averageInvoiceValue =
                invoices.length > 0
                    ? invoices.reduce((sum, i) => sum + Number(i.total_ttc), 0) / invoices.length
                    : 0;

            // Calculate conversion rate
            const conversionRate =
                quotes.length > 0 ? (invoices.length / quotes.length) * 100 : 0;

            const analytics = {
                totalRevenue,
                totalQuotes: quotes.length,
                totalInvoices: invoices.length,
                paidInvoices,
                unpaidInvoices,
                overdueInvoices,
                revenueThisMonth,
                revenueLastMonth,
                averageQuoteValue,
                averageInvoiceValue,
                conversionRate,
            };

            return NextResponse.json({ analytics });
        },
        {
            context: { resourceName: "Analytics", operation: "sales" },
        }
    );
}

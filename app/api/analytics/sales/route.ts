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

        // Get all documents
        const documents = await prisma.document.findMany({
            where: { entrepriseId: user.entrepriseId },
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
        const acceptedQuotes = quotes.filter((q) => q.statut === "ACCEPTE").length;
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
    } catch (error) {
        console.error("Erreur lors du calcul des analytics:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

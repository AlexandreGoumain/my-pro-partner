import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "10");

        // Get all unpaid invoices with client details
        const unpaidInvoices = await prisma.document.findMany({
            where: {
                entrepriseId,
                type: "FACTURE",
                statut: {
                    notIn: ["PAYE", "ANNULE"],
                },
                reste_a_payer: {
                    gt: 0,
                },
            },
            select: {
                id: true,
                numero: true,
                dateEmission: true,
                dateEcheance: true,
                reste_a_payer: true,
                clientId: true,
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
        });

        // Get all paid invoices for payment delay calculation
        const paidInvoices = await prisma.document.findMany({
            where: {
                entrepriseId,
                type: "FACTURE",
                statut: "PAYE",
            },
            select: {
                clientId: true,
                dateEmission: true,
                dateEcheance: true,
                paiements: {
                    select: {
                        date_paiement: true,
                    },
                    orderBy: {
                        date_paiement: "desc",
                    },
                    take: 1,
                },
            },
        });

        const now = new Date();

        // Group by client and calculate statistics
        const clientDebtMap = new Map<
            string,
            {
                client: {
                    id: string;
                    nom: string;
                    prenom: string | null;
                    email: string | null;
                    telephone: string | null;
                    ville: string | null;
                };
                totalUnpaid: number;
                unpaidInvoiceCount: number;
                invoices: Array<{
                    id: string;
                    numero: string;
                    dateEmission: Date;
                    dateEcheance: Date | null;
                    resteAPayer: number;
                    daysOverdue: number;
                }>;
                oldestUnpaidDate: Date;
                averageOverdueDays: number;
                totalOverdueDays: number;
            }
        >();

        // Process unpaid invoices
        for (const invoice of unpaidInvoices) {
            const clientId = invoice.clientId;
            const daysOverdue = invoice.dateEcheance
                ? Math.max(
                      0,
                      Math.floor(
                          (now.getTime() - new Date(invoice.dateEcheance).getTime()) /
                              (1000 * 60 * 60 * 24)
                      )
                  )
                : 0;

            if (!clientDebtMap.has(clientId)) {
                clientDebtMap.set(clientId, {
                    client: invoice.client,
                    totalUnpaid: 0,
                    unpaidInvoiceCount: 0,
                    invoices: [],
                    oldestUnpaidDate: invoice.dateEmission,
                    averageOverdueDays: 0,
                    totalOverdueDays: 0,
                });
            }

            const clientData = clientDebtMap.get(clientId)!;
            clientData.totalUnpaid += Number(invoice.reste_a_payer);
            clientData.unpaidInvoiceCount++;
            clientData.invoices.push({
                id: invoice.id,
                numero: invoice.numero,
                dateEmission: invoice.dateEmission,
                dateEcheance: invoice.dateEcheance,
                resteAPayer: Number(invoice.reste_a_payer),
                daysOverdue,
            });
            clientData.totalOverdueDays += daysOverdue;

            if (invoice.dateEmission < clientData.oldestUnpaidDate) {
                clientData.oldestUnpaidDate = invoice.dateEmission;
            }
        }

        // Calculate payment delay statistics
        const clientPaymentDelays = new Map<string, number[]>();
        for (const invoice of paidInvoices) {
            if (invoice.dateEcheance && invoice.paiements.length > 0) {
                const paymentDate = new Date(invoice.paiements[0].date_paiement);
                const dueDate = new Date(invoice.dateEcheance);
                const delayDays = Math.floor(
                    (paymentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (!clientPaymentDelays.has(invoice.clientId)) {
                    clientPaymentDelays.set(invoice.clientId, []);
                }
                clientPaymentDelays.get(invoice.clientId)!.push(delayDays);
            }
        }

        // Format and sort debtors
        const debtors = Array.from(clientDebtMap.values())
            .map((debtor) => {
                const averageOverdueDays =
                    debtor.unpaidInvoiceCount > 0
                        ? Math.round(debtor.totalOverdueDays / debtor.unpaidInvoiceCount)
                        : 0;

                const paymentDelays = clientPaymentDelays.get(debtor.client.id) || [];
                const averagePaymentDelay =
                    paymentDelays.length > 0
                        ? Math.round(
                              paymentDelays.reduce((sum, delay) => sum + delay, 0) /
                                  paymentDelays.length
                          )
                        : 0;

                // Risk scoring: based on amount, count, and delay
                let riskLevel: "low" | "medium" | "high" = "low";
                if (
                    debtor.totalUnpaid > 5000 ||
                    averageOverdueDays > 60 ||
                    debtor.unpaidInvoiceCount > 5
                ) {
                    riskLevel = "high";
                } else if (
                    debtor.totalUnpaid > 2000 ||
                    averageOverdueDays > 30 ||
                    debtor.unpaidInvoiceCount > 2
                ) {
                    riskLevel = "medium";
                }

                return {
                    client: debtor.client,
                    totalUnpaid: debtor.totalUnpaid,
                    unpaidInvoiceCount: debtor.unpaidInvoiceCount,
                    invoices: debtor.invoices.sort((a, b) => b.daysOverdue - a.daysOverdue),
                    oldestUnpaidDate: debtor.oldestUnpaidDate,
                    averageOverdueDays,
                    averagePaymentDelay,
                    riskLevel,
                };
            })
            .sort((a, b) => b.totalUnpaid - a.totalUnpaid)
            .slice(0, limit);

        // Calculate summary statistics
        const totalDebtAmount = Array.from(clientDebtMap.values()).reduce(
            (sum, debtor) => sum + debtor.totalUnpaid,
            0
        );

        const highRiskCount = debtors.filter((d) => d.riskLevel === "high").length;
        const mediumRiskCount = debtors.filter((d) => d.riskLevel === "medium").length;

        return NextResponse.json({
            debtors,
            summary: {
                totalClients: clientDebtMap.size,
                totalDebtAmount,
                highRiskCount,
                mediumRiskCount,
                lowRiskCount: debtors.length - highRiskCount - mediumRiskCount,
            },
        });
    } catch (error) {
        return handleTenantError(error);
    }
}

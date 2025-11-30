import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/gestion-locative/loyers/[id]/paiement - Register a payment
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("loyers");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        if (!body.montant || body.montant <= 0) {
            return NextResponse.json(
                { error: "Montant du paiement requis et doit être positif" },
                { status: 400 }
            );
        }

        // Verify loyer exists and belongs to entreprise
        const existing = await prisma.appelLoyer.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Loyer non trouvé" },
                { status: 404 }
            );
        }

        // Calculate new payment amount
        const currentPaid = Number(existing.montantPaye) || 0;
        const newPayment = Number(body.montant);
        const totalPaid = currentPaid + newPayment;
        const totalDu = Number(existing.totalDu);

        // Determine new status
        let newStatus = existing.statut;
        if (totalPaid >= totalDu) {
            newStatus = "PAYE";
        } else if (totalPaid > 0) {
            newStatus = "PARTIELLEMENT_PAYE";
        }

        const loyer = await prisma.appelLoyer.update({
            where: { id },
            data: {
                montantPaye: totalPaid,
                datePaiement: body.datePaiement
                    ? new Date(body.datePaiement)
                    : new Date(),
                statut: newStatus,
            },
            include: {
                bail: {
                    include: {
                        bien: {
                            select: {
                                id: true,
                                reference: true,
                                titre: true,
                            },
                        },
                        locatairePrincipal: {
                            select: {
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({
            loyer,
            message: newStatus === "PAYE"
                ? "Loyer entièrement payé"
                : `Paiement de ${newPayment}€ enregistré`,
        });
    } catch (error) {
        console.error("Error registering payment:", error);
        return NextResponse.json(
            { error: "Failed to register payment" },
            { status: 500 }
        );
    }
}

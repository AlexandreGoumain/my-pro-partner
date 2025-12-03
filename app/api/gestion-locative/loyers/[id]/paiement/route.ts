import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * PATCH /api/gestion-locative/loyers/[id]/paiement
 * Register a payment
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            if (!body.montant || body.montant <= 0) {
                throw new ValidationError(
                    "Montant du paiement requis et doit être positif"
                );
            }

            const existing = await prisma.appelLoyer.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Loyer non trouvé");
            }

            const currentPaid = Number(existing.montantPaye) || 0;
            const newPayment = Number(body.montant);
            const totalPaid = currentPaid + newPayment;
            const totalDu = Number(existing.totalDu);

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
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "payment" },
        }
    );
}

import { withErrorHandling } from "@/lib/errors";
import { Prisma } from "@/lib/generated/prisma/client";
import { requireCapability } from "@/lib/middleware/business-type-check";
import {
    requireTenantAuth,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Remove piece from repair
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string; pieceId: string }> }
) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { user, entrepriseId } = await requireTenantAuth();
            const { id, pieceId } = await params;

            // Verify repair ownership
            await verifyResourceAccess(
                id,
                (id) =>
                    prisma.reparation.findUnique({
                        where: { id },
                    }),
                "Reparation"
            );

            // Get piece
            const piece = await prisma.reparationLignePiece.findUnique({
                where: { id: pieceId },
                include: {
                    article: true,
                    ressourceAtelier: true,
                    reparation: true,
                },
            });

            if (!piece) {
                return NextResponse.json(
                    { message: "Pièce introuvable" },
                    { status: 404 }
                );
            }

            if (piece.reparationId !== id) {
                return NextResponse.json(
                    {
                        message:
                            "Cette pièce n'appartient pas à cette réparation",
                    },
                    { status: 400 }
                );
            }

            // Delete piece and restore stock in transaction
            await prisma.$transaction(async (tx) => {
                // Restore article stock if applicable
                if (piece.articleId && piece.article?.gestion_stock) {
                    await tx.article.update({
                        where: { id: piece.articleId },
                        data: {
                            stock_actuel: {
                                increment: piece.quantite,
                            },
                        },
                    });

                    // Create stock movement
                    const stockAvant = piece.article.stock_actuel;
                    const stockApres = stockAvant + piece.quantite;

                    await tx.mouvementStock.create({
                        data: {
                            articleId: piece.articleId,
                            type: "ENTREE",
                            quantite: piece.quantite,
                            stock_avant: stockAvant,
                            stock_apres: stockApres,
                            motif: `Pièce retirée de la réparation ${piece.reparation.numero}`,
                            entrepriseId,
                            createdBy: user.id,
                        },
                    });
                }

                // Restore ressource atelier if applicable
                if (piece.ressourceAtelierId) {
                    await tx.ressourceAtelier.update({
                        where: { id: piece.ressourceAtelierId },
                        data: {
                            quantite: {
                                increment: piece.quantite,
                            },
                            utiliseDansReparation: false,
                            dateUtilisation: null,
                            reparationId: null,
                        },
                    });
                }

                // Delete piece
                await tx.reparationLignePiece.delete({
                    where: { id: pieceId },
                });

                // Recalculate repair costs
                const remainingPieces = await tx.reparationLignePiece.findMany({
                    where: { reparationId: id },
                });

                const totalPieces = remainingPieces.reduce(
                    (sum, p) => sum + Number(p.montant),
                    0
                );

                const coutTotal =
                    Number(piece.reparation.coutMain) + totalPieces;

                await tx.reparation.update({
                    where: { id },
                    data: {
                        coutPieces: new Prisma.Decimal(totalPieces),
                        coutTotal: new Prisma.Decimal(coutTotal),
                    },
                });
            });

            // Create history entry
            await prisma.reparationHistorique.create({
                data: {
                    reparationId: id,
                    action: "PIECE_REMOVED",
                    description: `Pièce retirée : ${piece.designation} (x${piece.quantite})`,
                    metadata: {
                        pieceId: piece.id,
                        designation: piece.designation,
                        quantite: piece.quantite,
                        montant: Number(piece.montant),
                    },
                    createdBy: user.id,
                },
            });

            return NextResponse.json(
                { message: "Pièce retirée avec succès" },
                { status: 200 }
            );
        },
        { resourceName: "ReparationPiece", operation: "delete" }
    );
}

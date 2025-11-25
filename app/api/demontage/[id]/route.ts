import { withErrorHandling } from "@/lib/errors";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Get a specific demontage by ID
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { id } = await params;

            // Use verifyResourceAccess to check auth and ownership in one call
            const { resource: demontage } = await verifyResourceAccess(
                id,
                (id) =>
                    prisma.demontageArticle.findUnique({
                        where: { id },
                        include: {
                            articleSource: {
                                include: {
                                    categorie: true,
                                    piecesDetachees: {
                                        orderBy: {
                                            createdAt: "desc",
                                        },
                                    },
                                    rachat: true,
                                },
                            },
                        },
                    }),
                "Demontage"
            );

            return NextResponse.json(demontage);
        },
        { resourceName: "Demontage", operation: "read" }
    );
}

// DELETE: Delete a demontage (with safety checks)
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { id } = await params;

            // Use verifyResourceAccess to check auth and ownership in one call
            const { resource: demontage } = await verifyResourceAccess(
                id,
                (id) =>
                    prisma.demontageArticle.findUnique({
                        where: { id },
                        include: {
                            articleSource: {
                                include: {
                                    piecesDetachees: true,
                                    rachat: true,
                                },
                            },
                        },
                    }),
                "Demontage"
            );

            // Safety check: verify no pieces have been sold
            // We check if any piece has been used in documents (LigneDocument)
            const pieceIds = demontage.articleSource.piecesDetachees.map(
                (piece) => piece.id
            );

            if (pieceIds.length > 0) {
                const usedPieces = await prisma.ligneDocument.findFirst({
                    where: {
                        articleId: {
                            in: pieceIds,
                        },
                    },
                });

                if (usedPieces) {
                    return NextResponse.json(
                        {
                            message:
                                "Impossible de supprimer ce démontage : des pièces ont été utilisées dans des documents (devis, factures, etc.)",
                        },
                        { status: 400 }
                    );
                }
            }

            // Delete in transaction
            await prisma.$transaction(async (tx) => {
                // Delete created pieces (articles with type PIECE)
                await tx.article.deleteMany({
                    where: {
                        articleOrigineId: demontage.articleSourceId,
                    },
                });

                // Restore source article
                await tx.article.update({
                    where: { id: demontage.articleSourceId },
                    data: {
                        stock_actuel: demontage.articleSource.rachat ? 1 : 0,
                        actif: true,
                    },
                });

                // Delete demontage record
                await tx.demontageArticle.delete({
                    where: { id },
                });
            });

            return NextResponse.json(
                { message: "Démontage supprimé avec succès" },
                { status: 200 }
            );
        },
        { resourceName: "Demontage", operation: "delete" }
    );
}

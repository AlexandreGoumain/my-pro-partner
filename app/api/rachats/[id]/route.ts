import { withErrorHandling } from "@/lib/errors";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Get a specific rachat by ID
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
            const { resource: rachat } = await verifyResourceAccess(
                id,
                (id) =>
                    prisma.rachatArticle.findUnique({
                        where: { id },
                        include: {
                            article: {
                                include: {
                                    categorie: true,
                                },
                            },
                            client: true,
                        },
                    }),
                "Rachat"
            );

            return NextResponse.json(rachat);
        },
        { resourceName: "Rachat", operation: "read" }
    );
}

// DELETE: Delete a rachat (and optionally its article)
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
            await verifyResourceAccess(
                id,
                (id) =>
                    prisma.rachatArticle.findUnique({
                        where: { id },
                        include: {
                            article: true,
                        },
                    }),
                "Rachat"
            );

            // Delete rachat (cascade will handle related records)
            await prisma.rachatArticle.delete({
                where: { id },
            });

            return NextResponse.json(
                { message: "Rachat supprimé avec succès" },
                { status: 200 }
            );
        },
        { resourceName: "Rachat", operation: "delete" }
    );
}

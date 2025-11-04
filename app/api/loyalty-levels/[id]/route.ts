import { prisma } from "@/lib/prisma";
import { niveauFideliteUpdateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

/**
 * Recalcule automatiquement l'ordre de tous les niveaux de fidélité
 * en fonction de leur seuil de points (tri croissant)
 */
async function recalculateOrdres(entrepriseId: string) {
    const niveaux = await prisma.niveauFidelite.findMany({
        where: { entrepriseId },
        orderBy: { seuilPoints: "asc" },
    });

    // Mettre à jour l'ordre de chaque niveau
    const updatePromises = niveaux.map((niveau, index) =>
        prisma.niveauFidelite.update({
            where: { id: niveau.id },
            data: { ordre: index + 1 },
        })
    );

    await Promise.all(updatePromises);
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const niveau = await prisma.niveauFidelite.findFirst({
            where: {
                id: (await params).id,
                entrepriseId,
            },
        });

        if (!niveau) {
            return NextResponse.json(
                { message: "Niveau de fidélité introuvable" },
                { status: 404 }
            );
        }

        return NextResponse.json(niveau);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const body = await req.json();
        const validation = niveauFideliteUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Vérifier que le niveau existe
        const existing = await prisma.niveauFidelite.findFirst({
            where: {
                id: (await params).id,
                entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Niveau de fidélité introuvable" },
                { status: 404 }
            );
        }

        // Vérifier si le nom existe déjà (autre que le niveau actuel)
        if (validation.data.nom) {
            const existingNom = await prisma.niveauFidelite.findFirst({
                where: {
                    entrepriseId,
                    nom: validation.data.nom,
                    id: { not: (await params).id },
                },
            });

            if (existingNom) {
                return NextResponse.json(
                    { message: "Un niveau avec ce nom existe déjà" },
                    { status: 400 }
                );
            }
        }

        const niveau = await prisma.niveauFidelite.update({
            where: { id: (await params).id },
            data: validation.data,
        });

        // Recalculer automatiquement les ordres si le seuil de points a changé
        if (validation.data.seuilPoints !== undefined) {
            await recalculateOrdres(entrepriseId);
        }

        // Récupérer le niveau avec son ordre final
        const niveauFinal = await prisma.niveauFidelite.findUnique({
            where: { id: (await params).id },
        });

        return NextResponse.json(niveauFinal);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        // Vérifier que le niveau existe
        const existing = await prisma.niveauFidelite.findFirst({
            where: {
                id: (await params).id,
                entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Niveau de fidélité introuvable" },
                { status: 404 }
            );
        }

        // Vérifier s'il y a des clients qui utilisent ce niveau
        const clientsCount = await prisma.client.count({
            where: {
                niveauFideliteId: (await params).id,
                entrepriseId,
            },
        });

        if (clientsCount > 0) {
            return NextResponse.json(
                {
                    message: `Impossible de supprimer ce niveau : ${clientsCount} client(s) l'utilisent actuellement`,
                },
                { status: 400 }
            );
        }

        await prisma.niveauFidelite.delete({
            where: { id: (await params).id },
        });

        // Recalculer automatiquement les ordres après la suppression
        await recalculateOrdres(entrepriseId);

        return NextResponse.json({ message: "Niveau supprimé avec succès" });
    } catch (error) {
        return handleTenantError(error);
    }
}

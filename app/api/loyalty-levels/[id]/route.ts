import { prisma } from "@/lib/prisma";
import { niveauFideliteUpdateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

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

        // Vérifier si l'ordre existe déjà (autre que le niveau actuel)
        if (validation.data.ordre !== undefined) {
            const existingOrdre = await prisma.niveauFidelite.findFirst({
                where: {
                    entrepriseId,
                    ordre: validation.data.ordre,
                    id: { not: (await params).id },
                },
            });

            if (existingOrdre) {
                return NextResponse.json(
                    { message: "Un niveau avec cet ordre existe déjà" },
                    { status: 400 }
                );
            }
        }

        const niveau = await prisma.niveauFidelite.update({
            where: { id: (await params).id },
            data: validation.data,
        });

        return NextResponse.json(niveau);
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

        return NextResponse.json({ message: "Niveau supprimé avec succès" });
    } catch (error) {
        return handleTenantError(error);
    }
}

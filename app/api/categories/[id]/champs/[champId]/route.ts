import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { champPersonnaliseUpdateSchema } from "@/lib/validation";
import { validateRequest } from "@/lib/utils/validation-helper";
import { NextRequest, NextResponse } from "next/server";

// PUT: Modifier un champ personnalisé
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; champId: string }> }
) {
    try {
        await requireTenantAuth();

        const { id, champId } = await params;

        // Vérifier que le champ existe et appartient à la catégorie
        const existingChamp = await prisma.champPersonnalise.findUnique({
            where: { id: champId },
        });

        if (!existingChamp || existingChamp.categorieId !== id) {
            return NextResponse.json(
                { message: "Champ personnalisé introuvable" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const result = validateRequest(champPersonnaliseUpdateSchema, body);
        if (!result.success) return result.response;

        // Si on change le code, vérifier qu'il n'existe pas déjà
        if (
            result.data.code &&
            result.data.code !== existingChamp.code
        ) {
            const codeExists = await prisma.champPersonnalise.findUnique({
                where: {
                    categorieId_code: {
                        categorieId: id,
                        code: result.data.code,
                    },
                },
            });

            if (codeExists) {
                return NextResponse.json(
                    {
                        message:
                            "Un champ avec ce code existe déjà pour cette catégorie",
                    },
                    { status: 400 }
                );
            }
        }

        // Validation conditionnelle pour SELECT/MULTISELECT
        if (
            result.data.type &&
            (result.data.type === "SELECT" ||
                result.data.type === "MULTISELECT")
        ) {
            const options =
                result.data.options !== undefined
                    ? result.data.options
                    : existingChamp.options;
            if (!options || (Array.isArray(options) && options.length === 0)) {
                return NextResponse.json(
                    {
                        message:
                            "Les options sont requises pour les champs de type SELECT ou MULTISELECT",
                    },
                    { status: 400 }
                );
            }
        }

        // Nettoyer les données
        const updateData: Record<string, unknown> = {};
        Object.entries(result.data).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[key] =
                    value === "" || value === null ? null : value;
            }
        });

        const champ = await prisma.champPersonnalise.update({
            where: { id: champId },
            data: updateData,
        });

        return NextResponse.json(champ);
    } catch (error) {
        return handleTenantError(error);
    }
}

// DELETE: Supprimer un champ personnalisé
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; champId: string }> }
) {
    try {
        await requireTenantAuth();

        const { id, champId } = await params;

        // Vérifier que le champ existe et appartient à la catégorie
        const existingChamp = await prisma.champPersonnalise.findUnique({
            where: { id: champId },
        });

        if (!existingChamp || existingChamp.categorieId !== id) {
            return NextResponse.json(
                { message: "Champ personnalisé introuvable" },
                { status: 404 }
            );
        }

        await prisma.champPersonnalise.delete({
            where: { id: champId },
        });

        return NextResponse.json({ message: "Champ supprimé avec succès" });
    } catch (error) {
        return handleTenantError(error);
    }
}

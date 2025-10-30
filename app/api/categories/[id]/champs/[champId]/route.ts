import { requireAuth } from "@/lib/api/auth-middleware";
import { prisma } from "@/lib/prisma";
import { champPersonnaliseUpdateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// PUT: Modifier un champ personnalisé
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; champId: string }> }
) {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

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
        const validation = champPersonnaliseUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Si on change le code, vérifier qu'il n'existe pas déjà
        if (
            validation.data.code &&
            validation.data.code !== existingChamp.code
        ) {
            const codeExists = await prisma.champPersonnalise.findUnique({
                where: {
                    categorieId_code: {
                        categorieId: id,
                        code: validation.data.code,
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
            validation.data.type &&
            (validation.data.type === "SELECT" ||
                validation.data.type === "MULTISELECT")
        ) {
            const options =
                validation.data.options !== undefined
                    ? validation.data.options
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
        Object.entries(validation.data).forEach(([key, value]) => {
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
        console.error(
            "Erreur lors de la modification du champ personnalisé:",
            error
        );
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// DELETE: Supprimer un champ personnalisé
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; champId: string }> }
) {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

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
        console.error(
            "Erreur lors de la suppression du champ personnalisé:",
            error
        );
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

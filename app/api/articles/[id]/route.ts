import { handlePrismaError } from "@/lib/errors/prisma";
import { prisma } from "@/lib/prisma";
import { articleUpdateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
    validateTenantAccess,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                categorie: true,
            },
        });

        if (!article) {
            return NextResponse.json(
                { message: "Article non trouvé" },
                { status: 404 }
            );
        }

        validateTenantAccess(article.entrepriseId, entrepriseId);

        return NextResponse.json(article);
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
        const { id } = await params;
        const body = await req.json();

        const existingArticle = await prisma.article.findUnique({
            where: { id },
            select: { entrepriseId: true },
        });

        if (!existingArticle) {
            return NextResponse.json(
                { message: "Article non trouvé" },
                { status: 404 }
            );
        }

        validateTenantAccess(existingArticle.entrepriseId, entrepriseId);

        const validation = articleUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const article = await prisma.article.update({
            where: { id },
            data: {
                ...validation.data,
                categorieId: validation.data.categorieId || null,
            },
            include: {
                categorie: true,
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        const { message, status } = handlePrismaError(error);
        return NextResponse.json({ message }, { status });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const existingArticle = await prisma.article.findUnique({
            where: { id },
            select: { entrepriseId: true },
        });

        if (!existingArticle) {
            return NextResponse.json(
                { message: "Article non trouvé" },
                { status: 404 }
            );
        }

        validateTenantAccess(existingArticle.entrepriseId, entrepriseId);

        await prisma.article.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Article supprimé avec succès" });
    } catch (error) {
        return handleTenantError(error);
    }
}

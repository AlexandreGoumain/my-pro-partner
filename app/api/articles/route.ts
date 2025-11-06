import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { articleCreateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { validateLimit } from "@/lib/middleware/feature-validation";
import { NextRequest, NextResponse } from "next/server";

// Fonction pour construire le chemin complet de la catégorie
function buildCategoryPath(
    categoryId: string | null,
    categories: { id: string; nom: string; parentId: string | null }[]
): string {
    if (!categoryId) return "Sans catégorie";

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return "Sans catégorie";

    const path: string[] = [category.nom];
    let currentCategory = category;

    // Remonter la hiérarchie jusqu'à la racine
    while (currentCategory.parentId) {
        const parent = categories.find((c) => c.id === currentCategory.parentId);
        if (!parent) break;
        path.unshift(parent.nom);
        currentCategory = parent;
    }

    return path.join(" → ");
}

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const categorieId = searchParams.get("categorieId");
        const pagination = getPaginationParams(searchParams);

        const where = {
            entrepriseId,
            ...(search && {
                OR: [
                    { nom: { contains: search, mode: "insensitive" as const } },
                    {
                        reference: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),
            ...(categorieId && { categorieId }),
            actif: true,
        };

        // Récupérer toutes les catégories pour construire les chemins
        const categories = await prisma.categorie.findMany({
            where: { entrepriseId },
            select: { id: true, nom: true, parentId: true },
        });

        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                include: {
                    categorie: true,
                },
                orderBy: { createdAt: "desc" },
                skip: pagination.skip,
                take: pagination.limit,
            }),
            prisma.article.count({ where }),
        ]);

        // Enrichir les articles avec le chemin complet de la catégorie
        const enrichedArticles = articles.map((article) => ({
            ...article,
            categorie: article.categorie
                ? {
                      ...article.categorie,
                      nom: buildCategoryPath(article.categorieId, categories),
                  }
                : null,
        }));

        return NextResponse.json(
            createPaginatedResponse(enrichedArticles, total, pagination)
        );
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId, entreprise } = await requireTenantAuth();

        // Check if user has reached maxProducts limit
        const limitCheck = await validateLimit(entreprise.plan, entrepriseId, "maxProducts");
        if (limitCheck) return limitCheck;

        const body = await req.json();
        const validation = articleCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Utiliser une transaction pour générer la référence, créer l'article et incrémenter le compteur
        const article = await prisma.$transaction(async (tx) => {
            // Récupérer les paramètres pour générer la référence
            const parametres = await tx.parametresEntreprise.findUnique({
                where: { entrepriseId },
                select: {
                    prefixe_produit: true,
                    prefixe_service: true,
                    prochain_numero_produit: true,
                    prochain_numero_service: true,
                },
            });

            if (!parametres) {
                throw new Error("Paramètres introuvables");
            }

            // Générer la référence selon le type
            const prefix = validation.data.type === "PRODUIT"
                ? parametres.prefixe_produit
                : parametres.prefixe_service;

            const numero = validation.data.type === "PRODUIT"
                ? parametres.prochain_numero_produit
                : parametres.prochain_numero_service;

            const reference = `${prefix}-${String(numero).padStart(3, "0")}`;

            // Vérifier que la référence générée n'existe pas déjà
            const existingArticle = await tx.article.findUnique({
                where: {
                    entrepriseId_reference: {
                        entrepriseId,
                        reference,
                    },
                },
            });

            if (existingArticle) {
                throw new Error("Une référence identique existe déjà. Veuillez réessayer.");
            }

            // Créer l'article avec la référence générée
            const newArticle = await tx.article.create({
                data: {
                    ...validation.data,
                    reference,
                    entrepriseId,
                    categorieId: validation.data.categorieId || null,
                },
                include: {
                    categorie: true,
                },
            });

            // Incrémenter le compteur approprié
            if (validation.data.type === "PRODUIT") {
                await tx.parametresEntreprise.update({
                    where: { entrepriseId },
                    data: {
                        prochain_numero_produit: { increment: 1 },
                    },
                });
            } else if (validation.data.type === "SERVICE") {
                await tx.parametresEntreprise.update({
                    where: { entrepriseId },
                    data: {
                        prochain_numero_service: { increment: 1 },
                    },
                });
            }

            return newArticle;
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}

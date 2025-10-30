/**
 * Service backend pour gérer les champs personnalisés
 */

import { prisma } from "@/lib/prisma";
import { ChampPersonnalise } from "@/lib/types/custom-fields";
import {
    sanitizeCustomFieldValues,
    validateCustomFields,
    ValidationError,
} from "@/lib/utils/custom-fields-validator";

/**
 * Récupère les champs personnalisés d'une catégorie
 */
export async function getCategoryCustomFields(
    categorieId: string
): Promise<ChampPersonnalise[]> {
    const fields = await prisma.champPersonnalise.findMany({
        where: { categorieId },
        orderBy: { ordre: "asc" },
    });

    return fields as unknown as ChampPersonnalise[];
}

/**
 * Valide et nettoie les valeurs des champs personnalisés pour un article
 */
export async function validateArticleCustomFields(
    categorieId: string | null | undefined,
    champsCustomValues: Record<string, unknown>
): Promise<{
    isValid: boolean;
    errors: ValidationError[];
    sanitizedValues: Record<string, unknown>;
}> {
    // Si pas de catégorie, pas de champs personnalisés
    if (!categorieId) {
        return {
            isValid: true,
            errors: [],
            sanitizedValues: {},
        };
    }

    // Récupérer les champs définis pour cette catégorie
    const fields = await getCategoryCustomFields(categorieId);

    // Si pas de champs définis, c'est OK
    if (fields.length === 0) {
        return {
            isValid: true,
            errors: [],
            sanitizedValues: {},
        };
    }

    // Valider les valeurs
    const errors = validateCustomFields(fields, champsCustomValues);

    // Nettoyer les valeurs (supprimer les champs non définis)
    const sanitizedValues = sanitizeCustomFieldValues(
        fields,
        champsCustomValues
    );

    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValues,
    };
}

/**
 * Prépare les données d'un article avec les champs personnalisés pour l'affichage
 */
export async function enrichArticleWithCustomFields(
    article: {
        id: string;
        categorieId: string | null;
        champsCustom: unknown;
        [key: string]: unknown;
    }
): Promise<{
    article: typeof article;
    customFieldsDefinition: ChampPersonnalise[];
    customFieldsValues: Record<string, unknown>;
}> {
    let customFieldsDefinition: ChampPersonnalise[] = [];
    let customFieldsValues: Record<string, unknown> = {};

    if (article.categorieId) {
        customFieldsDefinition = await getCategoryCustomFields(
            article.categorieId
        );

        // Parser les valeurs JSON
        if (article.champsCustom) {
            try {
                customFieldsValues =
                    typeof article.champsCustom === "string"
                        ? JSON.parse(article.champsCustom)
                        : (article.champsCustom as Record<string, unknown>);
            } catch {
                customFieldsValues = {};
            }
        }
    }

    return {
        article,
        customFieldsDefinition,
        customFieldsValues,
    };
}

/**
 * Exemple d'utilisation dans une API route
 */
export async function exampleArticleCreate(data: {
    categorieId: string;
    nom: string;
    prix_ht: number;
    champsCustom: Record<string, unknown>;
}) {
    // 1. Valider les champs personnalisés
    const validation = await validateArticleCustomFields(
        data.categorieId,
        data.champsCustom
    );

    if (!validation.isValid) {
        return {
            success: false,
            errors: validation.errors,
        };
    }

    // 2. Créer l'article avec les champs validés et nettoyés
    const article = await prisma.article.create({
        data: {
            reference: "REF-001",
            nom: data.nom,
            prix_ht: data.prix_ht,
            categorieId: data.categorieId,
            champsCustom: validation.sanitizedValues, // JSON validé et nettoyé
            tva_taux: 20,
            type: "PRODUIT",
        },
    });

    return {
        success: true,
        article,
    };
}

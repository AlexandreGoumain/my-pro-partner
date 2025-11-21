import { Categorie, Article as PrismaArticle } from "@/lib/generated/prisma";

// Article type filter
export type ArticleTypeFilter = "TOUS" | "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE";

// Type from Prisma with relations
export type ArticleWithRelations = PrismaArticle & {
    categorie: Categorie | null;
    type: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE";
    categorieId: string | null;
};

// Frontend display type
export type ArticleDisplay = {
    id: string;
    reference: string;
    nom: string;
    description: string;
    type: "PRODUIT" | "SERVICE" | "OCCASION" | "PIECE";
    prix: number;
    stock: number;
    seuilAlerte: number;
    categorie: string;
    categorieId: string | null;
    statut: "ACTIF" | "INACTIF" | "RUPTURE";
    image?: string;
    tva: number;
    gestionStock: boolean;
    createdAt?: Date;
};

// Main Article type for frontend use (alias for ArticleDisplay)
export type Article = ArticleDisplay;

// Mapper function from DB to display
export function mapArticleToDisplay(
    article: ArticleWithRelations
): ArticleDisplay {
    const stock = article.stock_actuel;
    const seuilAlerte = article.stock_min;
    const isService = article.type === "SERVICE";

    let statut: "ACTIF" | "INACTIF" | "RUPTURE";
    if (!article.actif) {
        statut = "INACTIF";
    } else if (!isService && stock === 0 && article.gestion_stock) {
        // RUPTURE uniquement pour les produits avec gestion de stock activée
        statut = "RUPTURE";
    } else {
        statut = "ACTIF";
    }

    return {
        id: article.id,
        reference: article.reference,
        nom: article.nom,
        description: article.description || "",
        type: article.type || "PRODUIT",
        prix: Number(article.prix_ht),
        stock,
        seuilAlerte,
        categorie: article.categorie?.nom || "Sans catégorie",
        categorieId: article.categorieId || null,
        statut,
        tva: Number(article.tva_taux),
        gestionStock: article.gestion_stock,
        createdAt: article.createdAt,
    };
}

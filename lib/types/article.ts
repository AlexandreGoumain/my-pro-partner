import { Categorie, Article as PrismaArticle } from "@/lib/generated/prisma";

// Type from Prisma with relations
export type ArticleWithRelations = PrismaArticle & {
    categorie: Categorie | null;
    type?: "PRODUIT" | "SERVICE";
    categorieId?: string | null;
};

// Frontend display type
export type ArticleDisplay = {
    id: string;
    reference: string;
    nom: string;
    description: string;
    type: "PRODUIT" | "SERVICE";
    prix: number;
    stock: number;
    seuilAlerte: number;
    categorie: string;
    categorieId?: string | null;
    statut: "ACTIF" | "INACTIF" | "RUPTURE";
    image?: string;
    tva: number;
};

// Mapper function from DB to display
export function mapArticleToDisplay(
    article: ArticleWithRelations
): ArticleDisplay {
    const stock = article.stock_actuel;
    const seuilAlerte = article.stock_min;

    let statut: "ACTIF" | "INACTIF" | "RUPTURE";
    if (!article.actif) {
        statut = "INACTIF";
    } else if (stock === 0) {
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
    };
}

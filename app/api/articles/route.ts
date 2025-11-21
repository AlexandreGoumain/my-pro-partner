import { createCrudRoutes } from "@/lib/api/crud-factory";
import { articleCreateSchema, articleUpdateSchema } from "@/lib/validation";
import { ArticleService } from "@/lib/services/article.service";

export const { GET, POST } = createCrudRoutes({
  modelName: "article",
  resourceName: "Article",
  createSchema: articleCreateSchema,
  updateSchema: articleUpdateSchema,
  searchFields: ["nom", "reference", "description"],
  limitKey: "maxProducts",
  include: {
    categorie: true,
    rachat: true,
  },
  orderBy: { createdAt: "desc" },

  // Custom filters for category and active status
  customWhere: (searchParams, _entrepriseId) => {
    const filters: { categorieId?: string; actif?: boolean } = {};

    const categorieId = searchParams.get("categorieId");
    if (categorieId) {
      filters.categorieId = categorieId;
    }

    // Only show active articles by default (can be overridden with actif=false)
    const actif = searchParams.get("actif");
    if (actif === null) {
      filters.actif = true; // Default to active only
    } else if (actif !== "") {
      filters.actif = actif === "true";
    }

    return filters;
  },

  // Generate reference automatically before creation
  beforeCreate: async (data: any, entrepriseId) => {
    // Generate unique reference using ArticleService
    const reference = await ArticleService.generateReference(data.type, entrepriseId);

    // Les services ne doivent jamais avoir la gestion de stock activée
    const gestion_stock = data.type === "SERVICE" ? false : data.gestion_stock;

    // Base article data
    const baseArticleData = {
      reference,
      categorieId: data.categorieId || null,
      gestion_stock,
      // Les services n'ont pas de stock
      stock_actuel: data.type === "SERVICE" ? 0 : data.stock_actuel,
      stock_min: data.type === "SERVICE" ? 0 : data.stock_min,
    };

    // Si c'est un article d'occasion, gérer les données spécifiques
    if (data.type === "OCCASION") {
      const { etat, provenance, prixRachat, dureeGarantie, numeroSerie, dateRachat, notesRachat, ...articleFields } = data;

      // Créer l'article avec la relation RachatArticle
      return {
        ...articleFields,
        ...baseArticleData,
        rachat: etat && provenance ? {
          create: {
            etat,
            provenance,
            prixRachat: prixRachat || 0,
            dureeGarantie: dureeGarantie || null,
            numeroSerie: numeroSerie || null,
            dateRachat: dateRachat ? new Date(dateRachat) : new Date(),
            notes: notesRachat || null,
            entrepriseId,
          },
        } : undefined,
      };
    }

    // Pour les produits et services classiques
    return {
      ...data,
      ...baseArticleData,
    };
  },
});

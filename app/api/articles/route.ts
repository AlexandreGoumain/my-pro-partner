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
  beforeCreate: async (data, entrepriseId) => {
    // Generate unique reference using ArticleService
    const reference = await ArticleService.generateReference(data.type, entrepriseId);

    return {
      ...data,
      reference,
      categorieId: data.categorieId || null,
    };
  },
});

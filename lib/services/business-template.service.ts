import { CATEGORY_CONFIGS } from "@/lib/config/business-hierarchy.config";
import { prisma } from "@/lib/prisma";
import { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import { CapabilityService } from "./capability.service";
import { BUSINESS_TEMPLATES } from "./business-templates-data";

/**
 * Service de gestion des templates métier
 * Permet de personnaliser l'expérience selon le type de business
 *
 * @see CapabilityService pour la gestion des capabilities
 * @see business-hierarchy.config.ts pour la configuration des catégories
 * @see business-templates-data.ts pour les données des templates
 */

// Constantes
const DEFAULT_BUSINESS_TYPE = "GENERAL" as const;
const FREE_PLAN_LIMITS = {
    MAX_CATEGORIES: 3,
    MAX_LOYALTY_LEVELS: 2,
    MAX_FEATURES: 3,
    MAX_LOYALTY_BENEFITS: 2,
} as const;

const INITIAL_DOCUMENT_NUMBER = 1;

// Ré-exporter BusinessType pour la compatibilité
export type { BusinessType } from "@/lib/types/business";

export interface BusinessTemplate {
    type: BusinessType;
    label: string;
    icon: string;
    description: string;
    color: string;
    categories: {
        nom: string;
        description: string;
        champsPersonnalises?: {
            nom: string;
            code: string;
            type: "TEXT" | "NUMBER" | "DATE" | "SELECT" | "TEXTAREA";
            obligatoire?: boolean;
            options?: string[];
        }[];
    }[];
    niveauxFidelite?: {
        nom: string;
        pointsSeuil: number;
        remise: number;
        couleur: string;
        icone: string;
        avantages: string[];
    }[];
    seriesDocuments?: {
        type: "DEVIS" | "FACTURE" | "AVOIR";
        nom: string;
        prefix: string;
        format: string;
    }[];
    termsAndConditions?: string;
    features?: string[];
}

export class BusinessTemplateService {
    /**
     * Templates prédéfinis par métier
     * Importés depuis business-templates-data.ts pour une meilleure maintenabilité
     */
    static readonly TEMPLATES: Record<BusinessType, BusinessTemplate> = BUSINESS_TEMPLATES;

    /**
     * Récupérer un template par type de business
     */
    static getTemplate(type: BusinessType): BusinessTemplate {
        return this.TEMPLATES[type] || this.TEMPLATES[DEFAULT_BUSINESS_TYPE];
    }

    /**
     * Appliquer un template à une entreprise
     */
    static async applyTemplate(
        entrepriseId: string,
        businessType: BusinessType
    ): Promise<void> {
        const template = this.getTemplate(businessType);

        // 1. Mettre à jour le type de business de l'entreprise
        await prisma.entreprise.update({
            where: { id: entrepriseId },
            data: { businessType },
        });

        // 2. Créer les catégories prédéfinies
        for (const cat of template.categories) {
            const categorie = await prisma.categorie.create({
                data: {
                    nom: cat.nom,
                    description: cat.description,
                    entrepriseId,
                },
            });

            // 3. Créer les champs personnalisés si définis
            if (cat.champsPersonnalises) {
                for (const champ of cat.champsPersonnalises) {
                    await prisma.champPersonnalise.create({
                        data: {
                            categorieId: categorie.id,
                            nom: champ.nom,
                            code: champ.code,
                            type: champ.type,
                            obligatoire: champ.obligatoire || false,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options: (champ.options || null) as any,
                        },
                    });
                }
            }
        }

        // 4. Créer les niveaux de fidélité prédéfinis
        if (template.niveauxFidelite) {
            for (const niveau of template.niveauxFidelite) {
                await prisma.niveauFidelite.create({
                    data: {
                        nom: niveau.nom,
                        seuilPoints: niveau.pointsSeuil,
                        remise: niveau.remise,
                        couleur: niveau.couleur,
                        icone: niveau.icone,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        avantages: JSON.stringify(niveau.avantages) as any,
                        entrepriseId,
                    },
                });
            }
        }

        // 5. Créer les séries de documents prédéfinies
        if (template.seriesDocuments) {
            for (const serie of template.seriesDocuments) {
                await prisma.serieDocument.create({
                    data: {
                        nom: serie.nom,
                        code: serie.prefix,
                        format_numero: serie.format,
                        prochain_numero: INITIAL_DOCUMENT_NUMBER,
                        pour_devis: serie.type === "DEVIS",
                        pour_factures: serie.type === "FACTURE",
                        pour_avoirs: serie.type === "AVOIR",
                        entrepriseId,
                    },
                });
            }
        }

        // 6. Mettre à jour les conditions générales dans les paramètres
        if (template.termsAndConditions) {
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: entrepriseId },
                select: { nom: true },
            });

            await prisma.parametresEntreprise.upsert({
                where: { entrepriseId },
                create: {
                    entrepriseId,
                    nom_entreprise: entreprise?.nom || "",
                    mentions_legales: template.termsAndConditions,
                },
                update: {
                    mentions_legales: template.termsAndConditions,
                },
            });
        }
    }

    /**
     * Récupérer tous les templates disponibles
     */
    static getAllTemplates(): BusinessTemplate[] {
        return Object.values(this.TEMPLATES);
    }

    /**
     * Récupérer les templates par catégorie (utilise la nouvelle hiérarchie)
     */
    static getTemplatesByCategory(): Record<string, BusinessTemplate[]> {
        const result: Record<string, BusinessTemplate[]> = {};

        for (const [_category, config] of Object.entries(CATEGORY_CONFIGS)) {
            result[config.label] = config.businessTypes.map(
                (type) => this.TEMPLATES[type]
            );
        }

        return result;
    }

    /**
     * Récupérer les templates groupés par BusinessCategory (typed)
     */
    static getTemplatesByBusinessCategory(): Record<
        BusinessCategory,
        BusinessTemplate[]
    > {
        const result = {} as Record<BusinessCategory, BusinessTemplate[]>;

        for (const [category, config] of Object.entries(CATEGORY_CONFIGS)) {
            result[category as BusinessCategory] = config.businessTypes.map(
                (type) => this.TEMPLATES[type]
            );
        }

        return result;
    }

    /**
     * Récupérer la catégorie d'un business type
     */
    static getCategoryForType(type: BusinessType): BusinessCategory {
        return CapabilityService.getCategoryForType(type);
    }

    /**
     * Récupère une variante de template selon le plan de l'utilisateur
     * FREE: Version simplifiée (moins de catégories, pas de champs personnalisés)
     * STARTER/PRO/ENTERPRISE: Version complète
     */
    static getTemplateVariant(
        businessType: BusinessType,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): BusinessTemplate {
        const fullTemplate = this.getTemplate(businessType);

        // Si trial actif ou plan payant, retourner template complet
        if (isTrialActive || plan !== "FREE") {
            return fullTemplate;
        }

        // Version simplifiée pour FREE
        return this.simplifyTemplate(fullTemplate);
    }

    /**
     * Simplifie un template pour le plan FREE
     */
    private static simplifyTemplate(
        template: BusinessTemplate
    ): BusinessTemplate {
        return {
            ...template,
            categories: template.categories
                .slice(0, FREE_PLAN_LIMITS.MAX_CATEGORIES)
                .map((cat) => ({
                    nom: cat.nom,
                    description: cat.description,
                    champsPersonnalises: undefined,
                })),
            niveauxFidelite: template.niveauxFidelite
                ?.slice(0, FREE_PLAN_LIMITS.MAX_LOYALTY_LEVELS)
                .map((niveau) => ({
                    ...niveau,
                    avantages: niveau.avantages.slice(
                        0,
                        FREE_PLAN_LIMITS.MAX_LOYALTY_BENEFITS
                    ),
                })),
            features: template.features?.slice(
                0,
                FREE_PLAN_LIMITS.MAX_FEATURES
            ),
        };
    }

    /**
     * Vérifie si une feature du template est disponible pour le plan
     */
    static isFeatureAvailableForPlan(
        businessType: BusinessType,
        feature: string,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): boolean {
        if (isTrialActive || plan !== "FREE") {
            return true;
        }

        const fullTemplate = this.getTemplate(businessType);
        const simplifiedTemplate = this.simplifyTemplate(fullTemplate);

        return simplifiedTemplate.features?.includes(feature) ?? false;
    }

    /**
     * Récupère le nombre de catégories disponibles selon le plan
     */
    static getAvailableCategoriesCount(
        businessType: BusinessType,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): number {
        const template = this.getTemplateVariant(
            businessType,
            plan,
            isTrialActive
        );
        return template.categories.length;
    }

    /**
     * Applique la variante appropriée du template selon le plan
     */
    static async applyTemplateVariant(
        entrepriseId: string,
        businessType: BusinessType,
        plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE",
        isTrialActive: boolean = false
    ): Promise<void> {
        await this.applyTemplate(entrepriseId, businessType);

        // Si FREE et pas de trial, supprimer les éléments non supportés
        if (plan === "FREE" && !isTrialActive) {
            const categories = await prisma.categorie.findMany({
                where: { entrepriseId },
                orderBy: { ordre: "asc" },
            });

            if (categories.length > FREE_PLAN_LIMITS.MAX_CATEGORIES) {
                const toDelete = categories.slice(
                    FREE_PLAN_LIMITS.MAX_CATEGORIES
                );
                await prisma.categorie.deleteMany({
                    where: {
                        id: { in: toDelete.map((c) => c.id) },
                    },
                });
            }

            const niveaux = await prisma.niveauFidelite.findMany({
                where: { entrepriseId },
                orderBy: { ordre: "asc" },
            });

            if (niveaux.length > FREE_PLAN_LIMITS.MAX_LOYALTY_LEVELS) {
                const toDelete = niveaux.slice(
                    FREE_PLAN_LIMITS.MAX_LOYALTY_LEVELS
                );
                await prisma.niveauFidelite.deleteMany({
                    where: {
                        id: { in: toDelete.map((n) => n.id) },
                    },
                });
            }
        }
    }
}

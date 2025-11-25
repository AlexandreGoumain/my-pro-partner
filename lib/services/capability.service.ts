/**
 * Service utilitaire pour la gestion des capabilities
 * Fournit des helpers pour interroger la hiérarchie Business
 */

import {
    BUSINESS_TYPE_CONFIGS,
    CATEGORY_CONFIGS,
} from "@/lib/config/business-hierarchy.config";
import type { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import type {
    BusinessTypeConfig,
    CategoryConfig,
} from "@/lib/types/business-hierarchy";
import {
    BUSINESS_TYPE_DEFAULT_CAPABILITIES,
    BUSINESS_TYPE_TO_CATEGORY,
    CATEGORY_TO_BUSINESS_TYPES,
} from "@/lib/types/business-hierarchy";
import type { Capability } from "@/lib/types/capability";

export class CapabilityService {
    /**
     * Récupère la catégorie d'un business type
     */
    static getCategoryForType(type: BusinessType): BusinessCategory {
        return BUSINESS_TYPE_TO_CATEGORY[type];
    }

    /**
     * Récupère tous les business types d'une catégorie
     */
    static getTypesForCategory(category: BusinessCategory): BusinessType[] {
        return CATEGORY_TO_BUSINESS_TYPES[category];
    }

    /**
     * Récupère les capabilities par défaut d'un business type
     */
    static getCapabilitiesForType(type: BusinessType): Capability[] {
        return BUSINESS_TYPE_DEFAULT_CAPABILITIES[type];
    }

    /**
     * Vérifie si un business type possède une capability
     */
    static hasCapability(type: BusinessType, capability: Capability): boolean {
        const capabilities = BUSINESS_TYPE_DEFAULT_CAPABILITIES[type];
        return capabilities.includes(capability);
    }

    /**
     * Vérifie si un business type possède toutes les capabilities spécifiées
     */
    static hasAllCapabilities(
        type: BusinessType,
        capabilities: Capability[]
    ): boolean {
        return capabilities.every((cap) => this.hasCapability(type, cap));
    }

    /**
     * Vérifie si un business type possède au moins une des capabilities spécifiées
     */
    static hasAnyCapability(
        type: BusinessType,
        capabilities: Capability[]
    ): boolean {
        return capabilities.some((cap) => this.hasCapability(type, cap));
    }

    /**
     * Récupère tous les business types qui ont une capability donnée
     */
    static getTypesWithCapability(capability: Capability): BusinessType[] {
        return (
            Object.entries(BUSINESS_TYPE_DEFAULT_CAPABILITIES) as [
                BusinessType,
                Capability[],
            ][]
        )
            .filter(([, caps]) => caps.includes(capability))
            .map(([type]) => type);
    }

    /**
     * Récupère la configuration complète d'une catégorie
     */
    static getCategoryConfig(category: BusinessCategory): CategoryConfig {
        return CATEGORY_CONFIGS[category];
    }

    /**
     * Récupère la configuration complète d'un business type
     */
    static getBusinessTypeConfig(type: BusinessType): BusinessTypeConfig {
        return BUSINESS_TYPE_CONFIGS[type];
    }

    /**
     * Récupère toutes les configurations de catégories
     */
    static getAllCategoryConfigs(): CategoryConfig[] {
        return Object.values(CATEGORY_CONFIGS);
    }

    /**
     * Récupère toutes les configurations de business types
     */
    static getAllBusinessTypeConfigs(): BusinessTypeConfig[] {
        return Object.values(BUSINESS_TYPE_CONFIGS);
    }

    /**
     * Récupère les configurations de business types pour une catégorie
     */
    static getBusinessTypeConfigsForCategory(
        category: BusinessCategory
    ): BusinessTypeConfig[] {
        const types = CATEGORY_TO_BUSINESS_TYPES[category];
        return types.map((type) => BUSINESS_TYPE_CONFIGS[type]);
    }

    /**
     * Vérifie si un business type appartient à une catégorie donnée
     */
    static isTypeInCategory(
        type: BusinessType,
        category: BusinessCategory
    ): boolean {
        return BUSINESS_TYPE_TO_CATEGORY[type] === category;
    }

    /**
     * Récupère le label d'affichage d'un business type
     */
    static getTypeLabel(type: BusinessType): string {
        return BUSINESS_TYPE_CONFIGS[type].label;
    }

    /**
     * Récupère le label d'affichage d'une catégorie
     */
    static getCategoryLabel(category: BusinessCategory): string {
        return CATEGORY_CONFIGS[category].label;
    }

    /**
     * Récupère les capabilities disponibles pour une catégorie
     */
    static getAvailableCapabilitiesForCategory(
        category: BusinessCategory
    ): Capability[] {
        return CATEGORY_CONFIGS[category].availableCapabilities;
    }

    /**
     * Récupère les business types groupés par catégorie
     * Utile pour l'affichage dans l'onboarding
     */
    static getTypesGroupedByCategory(): Record<
        BusinessCategory,
        BusinessTypeConfig[]
    > {
        const result = {} as Record<BusinessCategory, BusinessTypeConfig[]>;

        for (const category of Object.keys(
            CATEGORY_CONFIGS
        ) as BusinessCategory[]) {
            result[category] = this.getBusinessTypeConfigsForCategory(category);
        }

        return result;
    }
}

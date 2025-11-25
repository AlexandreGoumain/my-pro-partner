import { CapabilityService } from "@/lib/services/capability.service";
import type { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import type { Capability } from "@/lib/types/capability";
import { NextResponse } from "next/server";
import { requireTenantAuth } from "./tenant-isolation";

/**
 * Middleware de vérification du type de business
 *
 * Trois niveaux de vérification disponibles :
 * - requireBusinessType() : par type spécifique (PLOMBERIE, GARAGE, etc.)
 * - requireCategory() : par catégorie (INTERVENTION, RENDEZ_VOUS, etc.)
 * - requireCapability() : par capability (pos, agenda, urgence, etc.)
 */

// ============================================
// Helpers privés
// ============================================

function createForbiddenResponse(
    message: string,
    details: Record<string, unknown>
): NextResponse {
    return NextResponse.json({ message, ...details }, { status: 403 });
}

// ============================================
// Vérifications par BusinessType
// ============================================

/**
 * Middleware bloquant - vérifie que l'entreprise a un des types spécifiés
 *
 * @example
 * const check = await requireBusinessType("INFORMATIQUE", "GARAGE");
 * if (check) return check;
 */
export async function requireBusinessType(
    ...allowedTypes: BusinessType[]
): Promise<NextResponse | null> {
    const { entreprise } = await requireTenantAuth();

    if (!allowedTypes.includes(entreprise.businessType as BusinessType)) {
        return createForbiddenResponse(
            "Fonctionnalité non disponible pour votre type d'entreprise",
            {
                requiredTypes: allowedTypes,
                currentType: entreprise.businessType,
            }
        );
    }

    return null;
}

/**
 * Version non-bloquante - retourne un boolean
 */
export async function hasBusinessType(
    ...allowedTypes: BusinessType[]
): Promise<boolean> {
    try {
        const { entreprise } = await requireTenantAuth();
        return allowedTypes.includes(entreprise.businessType as BusinessType);
    } catch {
        return false;
    }
}

// ============================================
// Vérifications par Capability
// ============================================

/**
 * Middleware bloquant - vérifie que l'entreprise a la capability
 *
 * @example
 * const check = await requireCapability("pos");
 * if (check) return check;
 */
export async function requireCapability(
    capability: Capability
): Promise<NextResponse | null> {
    const { entreprise } = await requireTenantAuth();
    const businessType = entreprise.businessType as BusinessType;

    if (!CapabilityService.hasCapability(businessType, capability)) {
        return createForbiddenResponse(
            "Fonctionnalité non disponible pour votre type d'entreprise",
            {
                requiredCapability: capability,
                currentType: businessType,
                availableCapabilities:
                    CapabilityService.getCapabilitiesForType(businessType),
            }
        );
    }

    return null;
}

/**
 * Version non-bloquante - retourne un boolean
 */
export async function hasCapability(capability: Capability): Promise<boolean> {
    try {
        const { entreprise } = await requireTenantAuth();
        return CapabilityService.hasCapability(
            entreprise.businessType as BusinessType,
            capability
        );
    } catch {
        return false;
    }
}

/**
 * Vérifie plusieurs capabilities à la fois (toutes requises)
 */
export async function hasAllCapabilities(
    ...capabilities: Capability[]
): Promise<boolean> {
    try {
        const { entreprise } = await requireTenantAuth();
        return CapabilityService.hasAllCapabilities(
            entreprise.businessType as BusinessType,
            capabilities
        );
    } catch {
        return false;
    }
}

/**
 * Vérifie si au moins une capability est présente
 */
export async function hasAnyCapability(
    ...capabilities: Capability[]
): Promise<boolean> {
    try {
        const { entreprise } = await requireTenantAuth();
        return CapabilityService.hasAnyCapability(
            entreprise.businessType as BusinessType,
            capabilities
        );
    } catch {
        return false;
    }
}

// ============================================
// Vérifications par Catégorie
// ============================================

/**
 * Middleware bloquant - vérifie que l'entreprise appartient à la catégorie
 *
 * @example
 * const check = await requireCategory("INTERVENTION");
 * if (check) return check;
 */
export async function requireCategory(
    category: BusinessCategory
): Promise<NextResponse | null> {
    const { entreprise } = await requireTenantAuth();
    const businessType = entreprise.businessType as BusinessType;

    if (!CapabilityService.isTypeInCategory(businessType, category)) {
        return createForbiddenResponse(
            "Fonctionnalité non disponible pour votre catégorie d'entreprise",
            {
                requiredCategory: category,
                currentType: businessType,
                currentCategory:
                    CapabilityService.getCategoryForType(businessType),
            }
        );
    }

    return null;
}

/**
 * Version non-bloquante - retourne un boolean
 */
export async function hasCategory(
    category: BusinessCategory
): Promise<boolean> {
    try {
        const { entreprise } = await requireTenantAuth();
        return CapabilityService.isTypeInCategory(
            entreprise.businessType as BusinessType,
            category
        );
    } catch {
        return false;
    }
}

// ============================================
// Helpers pour récupérer les infos du business courant
// ============================================

/**
 * Récupère la catégorie de l'entreprise courante
 */
export async function getCurrentCategory(): Promise<BusinessCategory | null> {
    try {
        const { entreprise } = await requireTenantAuth();
        return CapabilityService.getCategoryForType(
            entreprise.businessType as BusinessType
        );
    } catch {
        return null;
    }
}

/**
 * Récupère les capabilities de l'entreprise courante
 */
export async function getCurrentCapabilities(): Promise<Capability[]> {
    try {
        const { entreprise } = await requireTenantAuth();
        return CapabilityService.getCapabilitiesForType(
            entreprise.businessType as BusinessType
        );
    } catch {
        return [];
    }
}

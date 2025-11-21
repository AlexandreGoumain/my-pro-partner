import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth } from "./tenant-isolation";
import { BusinessType } from "@/lib/generated/prisma";

/**
 * Middleware pour vérifier que l'entreprise a le bon type de business
 * pour accéder à certaines fonctionnalités spécifiques
 *
 * Exemple d'utilisation :
 * ```ts
 * export async function GET(req: NextRequest) {
 *   const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
 *   if (businessTypeCheck) return businessTypeCheck;
 *
 *   // Le code ici ne s'exécute que si businessType = INFORMATIQUE
 * }
 * ```
 */
export async function requireBusinessType(
    ...allowedTypes: BusinessType[]
): Promise<NextResponse | null> {
    try {
        const { entreprise } = await requireTenantAuth();

        // Vérifier si le businessType de l'entreprise est autorisé
        if (!allowedTypes.includes(entreprise.businessType)) {
            return NextResponse.json(
                {
                    message: "Fonctionnalité non disponible pour votre type d'entreprise",
                    requiredTypes: allowedTypes,
                    currentType: entreprise.businessType,
                },
                { status: 403 }
            );
        }

        // Entreprise autorisée, retourner null pour continuer
        return null;
    } catch (error) {
        // Si requireTenantAuth échoue, laisser l'erreur se propager
        throw error;
    }
}

/**
 * Vérifie si l'entreprise actuelle a un des types de business spécifiés
 * (version non-bloquante qui retourne un boolean)
 */
export async function hasBusinessType(
    ...allowedTypes: BusinessType[]
): Promise<boolean> {
    try {
        const { entreprise } = await requireTenantAuth();
        return allowedTypes.includes(entreprise.businessType);
    } catch {
        return false;
    }
}

/**
 * Types de business courants pour faciliter l'utilisation
 */
export const BUSINESS_TYPES = {
    GENERAL: "GENERAL" as BusinessType,
    INFORMATIQUE: "INFORMATIQUE" as BusinessType,
    GARAGE: "GARAGE" as BusinessType,
    RESTAURATION: "RESTAURATION" as BusinessType,
    COMMERCE_DETAIL: "COMMERCE_DETAIL" as BusinessType,
    // Ajouter d'autres selon les besoins
} as const;

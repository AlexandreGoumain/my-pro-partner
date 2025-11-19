import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { getAndUpdateTrialStatus } from "@/lib/services/onboarding.service";
import { NextResponse } from "next/server";

/**
 * GET /api/trial/status
 * Récupère le statut du trial de l'entreprise authentifiée
 */
export async function GET() {
    try {
        // Authentification et récupération de l'entrepriseId
        const { entrepriseId } = await requireTenantAuth();

        // Récupérer et mettre à jour le statut du trial
        const result = await getAndUpdateTrialStatus(entrepriseId);

        return NextResponse.json(result);
    } catch (error) {
        return handleTenantError(error);
    }
}

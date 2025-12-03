import { withApiHandler } from "@/lib/api/api-handler";
import { getAndUpdateTrialStatus } from "@/lib/services/onboarding.service";
import { NextResponse } from "next/server";

/**
 * GET /api/trial/status
 * Récupère le statut du trial de l'entreprise authentifiée
 */
export async function GET() {
    return withApiHandler(
        async (ctx) => {
            // Récupérer et mettre à jour le statut du trial
            const result = await getAndUpdateTrialStatus(ctx.entrepriseId);
            return NextResponse.json(result);
        },
        {
            context: { resourceName: "Trial", operation: "status" },
        }
    );
}

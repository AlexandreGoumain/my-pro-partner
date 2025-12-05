import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { CapabilityService } from "@/lib/services/capability.service";
import type { Capability } from "@/lib/types/capability";

/**
 * GET /api/client/auth/me
 * Get current authenticated client info with business capabilities
 */
export async function GET(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        // Remove password from response
        const { password: _password, ...clientWithoutPassword } = client;

        // Get business type and capabilities
        const businessType = client.entreprise.businessType;
        const capabilities = CapabilityService.getCapabilitiesForType(businessType);
        const category = CapabilityService.getCategoryForType(businessType);

        // Helper to check capabilities
        const hasCapability = (cap: Capability) => capabilities.includes(cap);
        const hasAnyCapability = (caps: Capability[]) => caps.some(cap => capabilities.includes(cap));

        // Compute feature flags for the portal
        const features = {
            // Base features (always available)
            hasDocuments: true,
            hasFidelite: hasCapability("fidelite"),

            // RDV / Agenda features
            hasAgenda: hasCapability("agenda"),
            hasCreneaux: hasCapability("creneaux"),

            // Intervention features
            hasInterventions: hasAnyCapability(["domicile", "atelier"]),
            hasContrats: hasCapability("contrats"),
            hasGaranties: hasCapability("garanties"),

            // Restaurant/POS features
            hasReservations: hasCapability("tables"),
            hasMenu: hasCapability("menu"),

            // Fitness features
            hasFitness: hasCapability("abonnements_fitness"),
            hasCours: hasCapability("cours_collectifs"),

            // Immobilier features
            hasImmobilier: hasAnyCapability(["biens_immo", "baux_locatifs", "coproprietes"]),
            hasBaux: hasCapability("baux_locatifs"),
            hasCharges: hasCapability("charges_copro"),
        };

        return NextResponse.json({
            client: clientWithoutPassword,
            entreprise: {
                id: client.entreprise.id,
                nom: client.entreprise.nom,
                businessType,
                category,
            },
            capabilities,
            features,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}

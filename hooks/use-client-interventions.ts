import { useQuery } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api/client-api";

export interface ClientIntervention {
    id: string;
    numero: string;
    typeIntervention: string;
    priorite: "NORMALE" | "URGENTE" | "CRITIQUE";
    statut: "DEMANDE" | "VALIDEE" | "PLANIFIEE" | "EN_ROUTE" | "EN_COURS" | "EN_ATTENTE_PIECES" | "TERMINEE" | "FACTUREE" | "ANNULEE";
    description: string;
    adresse: string;
    codePostal: string;
    ville: string;
    equipement?: string;
    dateDemande: string;
    datePrevisionnelle?: string;
    dateDebut?: string;
    dateFin?: string;
    dureeEstimeeH?: number;
    devisEstime: number;
    coutTotal: number;
    diagnosticEffectue: boolean;
    plombier?: {
        id: string;
        name: string;
        image?: string;
    };
    document?: {
        id: string;
        numero: string;
        type: string;
        statut: string;
        totalTTC: number;
    };
}

export interface ClientInterventionDetail extends ClientIntervention {
    reference?: string;
    complementAdresse?: string;
    marqueEquipement?: string;
    modeleEquipement?: string;
    diagnosticDetail?: string;
    diagnosticDate?: string;
    photosAvant?: string[];
    dureeReelleH?: number;
    garantieMois?: number;
    dateFinGarantie?: string;
    travailEffectue?: string;
    photosApres?: string[];
    historique: {
        id: string;
        action: string;
        description: string;
        date: string;
    }[];
    materielUtilise: {
        id: string;
        designation: string;
        quantite: number;
        montant: number;
    }[];
}

interface UseClientInterventionsOptions {
    status?: string;
    active?: boolean;
    enabled?: boolean;
}

/**
 * Hook to fetch client's interventions
 */
export function useClientInterventions(options: UseClientInterventionsOptions = {}) {
    const { status, active = false, enabled = true } = options;

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (active) params.set("active", "true");

    const queryString = params.toString();
    const endpoint = `/api/client/interventions${queryString ? `?${queryString}` : ""}`;

    return useQuery({
        queryKey: ["client", "interventions", { status, active }],
        queryFn: async () => {
            const data = await clientApiFetch<{ interventions: ClientIntervention[] }>(endpoint);
            return data.interventions;
        },
        enabled,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch a single intervention detail
 */
export function useClientInterventionDetail(id: string, enabled = true) {
    return useQuery({
        queryKey: ["client", "interventions", id],
        queryFn: async () => {
            const data = await clientApiFetch<{ intervention: ClientInterventionDetail }>(
                `/api/client/interventions/${id}`
            );
            return data.intervention;
        },
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

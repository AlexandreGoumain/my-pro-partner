import { useQuery } from "@tanstack/react-query";

export interface EntretienAPlanifier {
    id: string;
    equipementId: string;
    type: "CONTROLE_ANNUEL" | "ENTRETIEN" | "GARANTIE_EXPIRE";
    dateEcheance: string;
    joursRestants: number;
    enRetard: boolean;
    priorite: "critique" | "haute" | "normale" | "basse";
    client: {
        id: string;
        nom: string;
        prenom?: string | null;
        telephone?: string | null;
        adresse?: string | null;
        codePostal?: string | null;
        ville?: string | null;
    };
    equipement: {
        type: string;
        typeLabel: string;
        marque: string;
        modele?: string | null;
    };
}

export interface EntretiensAPlanifierStats {
    total: number;
    enRetard: number;
    dans7Jours: number;
    dans30Jours: number;
}

export interface EntretiensAPlanifierResponse {
    entretiens: EntretienAPlanifier[];
    stats: EntretiensAPlanifierStats;
}

export function useEntretiensAPlanifier(options?: {
    jours?: number;
    includeRetard?: boolean;
}) {
    const params = new URLSearchParams();
    if (options?.jours) params.append("jours", options.jours.toString());
    if (options?.includeRetard === false)
        params.append("includeRetard", "false");

    const queryString = params.toString();

    return useQuery<EntretiensAPlanifierResponse>({
        queryKey: ["entretiens-a-planifier", options],
        queryFn: async () => {
            const res = await fetch(
                `/api/entretiens-a-planifier${queryString ? `?${queryString}` : ""}`
            );
            if (!res.ok) throw new Error("Erreur lors du chargement");
            return res.json();
        },
    });
}

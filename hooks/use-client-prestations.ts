import { useQuery } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api/client-api";

export interface ClientPrestation {
    id: string;
    nom: string;
    description?: string;
    duree: number; // in minutes
    prix: number;
    categorie?: string;
}

interface PrestationsResponse {
    prestations: ClientPrestation[];
    categories: string[];
}

interface UseClientPrestationsOptions {
    categorie?: string;
    enabled?: boolean;
}

/**
 * Hook to fetch available prestations for booking
 */
export function useClientPrestations(options: UseClientPrestationsOptions = {}) {
    const { categorie, enabled = true } = options;

    const params = new URLSearchParams();
    if (categorie) params.set("categorie", categorie);

    const queryString = params.toString();
    const endpoint = `/api/client/rdv/prestations${queryString ? `?${queryString}` : ""}`;

    return useQuery({
        queryKey: ["client", "prestations", { categorie }],
        queryFn: async () => {
            const data = await clientApiFetch<PrestationsResponse>(endpoint);
            return data;
        },
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutes (prestations don't change often)
    });
}

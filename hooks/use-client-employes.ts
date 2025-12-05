import { useQuery } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api/client-api";

export interface ClientEmploye {
    id: string;
    nom: string;
    prenom: string;
    couleur?: string;
    bio?: string;
    specialites?: string[];
    certifications?: string;
}

interface EmployesResponse {
    employes: ClientEmploye[];
}

interface UseClientEmployesOptions {
    enabled?: boolean;
}

/**
 * Hook to fetch available employees/practitioners
 */
export function useClientEmployes(options: UseClientEmployesOptions = {}) {
    const { enabled = true } = options;

    return useQuery({
        queryKey: ["client", "employes"],
        queryFn: async () => {
            const data = await clientApiFetch<EmployesResponse>("/api/client/rdv/employes");
            return data.employes;
        },
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

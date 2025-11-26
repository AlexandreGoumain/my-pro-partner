import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { TechnicienFormData } from "@/components/personnel/technicien-quick-add";

export interface Technicien {
    id: string;
    email: string;
    nom: string | null;
    prenom: string | null;
    telephone: string | null;
    photoUrl: string | null;
    poste: string | null;
    status: "ACTIVE" | "INVITED" | "INACTIVE";
    isActive: boolean;
    isPending: boolean;
    dateEmbauche: string | null;
    createdAt: string;
    camionnette: {
        id: string;
        nom: string;
        immatriculation: string;
    } | null;
    interventionsEnCours: number;
}

export interface PendingInvitation {
    id: string;
    email: string;
    nom: string | null;
    prenom: string | null;
    expiresAt: string;
    status: "pending";
}

interface TechniciensResponse {
    techniciens: Technicien[];
}

interface CreateTechnicienResponse {
    success: boolean;
    message: string;
    invitation: {
        id: string;
        email: string;
        prenom: string;
        nom: string;
        telephone: string;
        invitationUrl: string;
        expiresAt: string;
    };
}

// Query Keys
export const techniciensKeys = {
    all: ["techniciens"] as const,
};

/**
 * Hook pour récupérer la liste des techniciens
 */
export function useTechniciens() {
    return useQuery({
        queryKey: techniciensKeys.all,
        queryFn: async () => {
            const result = await api.get<TechniciensResponse>("/api/team/technicien");
            return result;
        },
    });
}

/**
 * Hook pour créer un nouveau technicien (envoie une invitation)
 */
export function useCreateTechnicien() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TechnicienFormData) => {
            const result = await api.post<CreateTechnicienResponse>(
                "/api/team/technicien",
                data
            );
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: techniciensKeys.all });
        },
    });
}

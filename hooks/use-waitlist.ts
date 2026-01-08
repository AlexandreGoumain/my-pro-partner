import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";

// ============================================================================
// Types
// ============================================================================

export interface JoinWaitlistInput {
    email: string;
    company?: string;
    phone?: string;
    templateType?: string;
    website?: string; // Honeypot
}

export interface JoinWaitlistResponse {
    success: boolean;
    message: string;
}

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Hook pour rejoindre la liste d'attente
 * Utilise useMutation de React Query pour gérer l'état de la requête
 */
export function useJoinWaitlist() {
    return useMutation({
        mutationFn: async (data: JoinWaitlistInput) =>
            api.post<JoinWaitlistResponse>("/api/waitlist", data),
    });
}

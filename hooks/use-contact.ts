import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";

// ============================================================================
// Types
// ============================================================================

export interface SendContactInput {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    website?: string; // Honeypot
}

export interface SendContactResponse {
    success: boolean;
    message: string;
}

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Hook pour envoyer un message de contact
 * Utilise useMutation de React Query pour gérer l'état de la requête
 */
export function useSendContact() {
    return useMutation({
        mutationFn: async (data: SendContactInput) =>
            api.post<SendContactResponse>("/api/contact", data),
    });
}

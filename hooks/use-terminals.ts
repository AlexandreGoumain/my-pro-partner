import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type {
    Terminal,
    StripeReader,
    RegisterTerminalInput,
} from "@/lib/types/pos";

// Query Keys
const TERMINALS_QUERY_KEY = ["terminals"];
const STRIPE_READERS_QUERY_KEY = ["stripe-readers"];

/**
 * Hook to fetch all terminals
 */
export function useTerminals() {
    return useQuery<{ terminals: Terminal[] }>({
        queryKey: TERMINALS_QUERY_KEY,
        queryFn: async () => {
            const response = await api.get("/api/terminal");
            return response;
        },
    });
}

/**
 * Hook to fetch available Stripe readers
 */
export function useStripeReaders(enabled = false) {
    return useQuery<{ terminals: StripeReader[] }>({
        queryKey: STRIPE_READERS_QUERY_KEY,
        queryFn: async () => {
            const response = await api.get("/api/terminal/list-stripe");
            return response;
        },
        enabled,
    });
}

/**
 * Hook to register a new terminal
 */
export function useRegisterTerminal() {
    const queryClient = useQueryClient();

    return useMutation<
        { terminal: Terminal },
        Error,
        RegisterTerminalInput
    >({
        mutationFn: async (data: RegisterTerminalInput) => {
            const response = await api.post("/api/terminal/register", data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TERMINALS_QUERY_KEY });
        },
    });
}

/**
 * Hook to sync a terminal
 */
export function useSyncTerminal() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (terminalId: string) => {
            await api.post(`/api/terminal/${terminalId}/sync`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TERMINALS_QUERY_KEY });
        },
    });
}

/**
 * Hook to delete a terminal
 */
export function useDeleteTerminal() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (terminalId: string) => {
            await api.delete(`/api/terminal/${terminalId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TERMINALS_QUERY_KEY });
        },
    });
}

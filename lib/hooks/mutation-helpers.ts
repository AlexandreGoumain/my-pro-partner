/**
 * Mutation Helpers
 *
 * Centralized mutation configuration with toast notifications and query invalidation.
 * Replaces 51+ repeated mutation patterns across hooks.
 *
 * @example
 * ```ts
 * // Before (repeated in every hook):
 * useMutation({
 *   mutationFn: async (data) => api.post("/api/resource", data),
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: ["resource"] });
 *     toast({ title: "Success", description: "Created!" });
 *   },
 *   onError: (error) => {
 *     toast({ title: "Error", variant: "destructive" });
 *   },
 * });
 *
 * // After (using helper):
 * useMutation(
 *   createMutationConfig({
 *     mutationFn: async (data) => api.post("/api/resource", data),
 *     invalidateKeys: [["resource"]],
 *     successMessage: "Ressource créée",
 *   })
 * );
 * ```
 */

import { toast } from "@/hooks/use-toast";
import {
    useMutation,
    useQueryClient,
    type QueryKey,
} from "@tanstack/react-query";

export interface MutationMessages {
    /** Success toast title */
    success?: string;
    /** Success toast description */
    successDescription?: string;
    /** Error toast title */
    error?: string;
    /** Function to extract error message from error object */
    getErrorMessage?: (error: unknown) => string;
}

export interface MutationConfigOptions<TData, TVariables, TContext = unknown> {
    /** The mutation function */
    mutationFn: (variables: TVariables) => Promise<TData>;
    /** Query keys to invalidate on success */
    invalidateKeys?: QueryKey[];
    /** Toast messages configuration */
    messages?: MutationMessages;
    /** Custom onSuccess callback (runs after invalidation and toast) */
    onSuccess?: (
        data: TData,
        variables: TVariables,
        context: TContext | undefined
    ) => void;
    /** Custom onError callback (runs after toast) */
    onError?: (
        error: Error,
        variables: TVariables,
        context: TContext | undefined
    ) => void;
    /** Custom onSettled callback */
    onSettled?: (
        data: TData | undefined,
        error: Error | null,
        variables: TVariables,
        context: TContext | undefined
    ) => void;
    /** Whether to show success toast. Default: true if successMessage provided */
    showSuccessToast?: boolean;
    /** Whether to show error toast. Default: true */
    showErrorToast?: boolean;
}

/**
 * Default error message extractor
 */
function defaultGetErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "Une erreur est survenue";
}

/**
 * Create a mutation configuration with toast notifications
 *
 * @param options - Mutation configuration options
 * @returns Mutation configuration object for useMutation
 */
export function createMutationConfig<TData, TVariables, TContext = unknown>(
    options: MutationConfigOptions<TData, TVariables, TContext>
) {
    const {
        mutationFn,
        invalidateKeys = [],
        messages = {},
        onSuccess: customOnSuccess,
        onError: customOnError,
        onSettled,
        showSuccessToast = !!messages.success,
        showErrorToast = true,
    } = options;

    const {
        success: successMessage,
        successDescription,
        error: errorMessage = "Erreur",
        getErrorMessage = defaultGetErrorMessage,
    } = messages;

    return {
        mutationFn,
        onSuccess: (
            data: TData,
            variables: TVariables,
            context: TContext | undefined
        ) => {
            // Show success toast
            if (showSuccessToast && successMessage) {
                toast({
                    title: successMessage,
                    description: successDescription,
                });
            }

            // Call custom onSuccess
            customOnSuccess?.(data, variables, context);
        },
        onError: (
            error: Error,
            variables: TVariables,
            context: TContext | undefined
        ) => {
            // Show error toast
            if (showErrorToast) {
                toast({
                    title: errorMessage,
                    description: getErrorMessage(error),
                    variant: "destructive" as const,
                });
            }

            // Call custom onError
            customOnError?.(error, variables, context);
        },
        onSettled,
        // Store invalidateKeys for the hook wrapper to use
        meta: { invalidateKeys },
    };
}

/**
 * Hook that wraps useMutation with automatic query invalidation
 *
 * @example
 * ```ts
 * const createMutation = useMutationWithInvalidation({
 *   mutationFn: (data) => api.post("/api/clients", data),
 *   invalidateKeys: [["clients"], ["clients", "stats"]],
 *   messages: {
 *     success: "Client créé",
 *     successDescription: "Le client a été créé avec succès",
 *   },
 * });
 * ```
 */
export function useMutationWithInvalidation<
    TData,
    TVariables,
    TContext = unknown,
>(options: MutationConfigOptions<TData, TVariables, TContext>) {
    const queryClient = useQueryClient();
    const { invalidateKeys = [] } = options;
    const config = createMutationConfig(options);

    return useMutation({
        ...config,
        onSuccess: (
            data: TData,
            variables: TVariables,
            context: TContext | undefined
        ) => {
            // Invalidate all specified query keys
            invalidateKeys.forEach((key) => {
                queryClient.invalidateQueries({ queryKey: key });
            });

            // Call the original onSuccess (which shows toast)
            config.onSuccess?.(data, variables, context);
        },
    });
}

/**
 * Helper to generate standard invalidation keys for a resource
 *
 * @example
 * ```ts
 * const keys = getResourceInvalidateKeys("clients");
 * // Returns: [["clients"], ["clients", "list"], ["clients", "stats"]]
 * ```
 */
export function getResourceInvalidateKeys(
    resourceName: string,
    additionalKeys: QueryKey[] = []
): QueryKey[] {
    return [
        [resourceName],
        [resourceName, "list"],
        [resourceName, "stats"],
        ...additionalKeys,
    ];
}

import { api } from "@/lib/api/fetch-client";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import type {
    PaymentLink,
    PaymentLinkFormData,
} from "@/lib/types/payment-link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hooks factory pour la gestion des liens de paiement
 * Utilise le pattern factory pour une gestion cohérente du cache
 */
const paymentLinkHooks = createResourceHooks<PaymentLink>({
    resourceName: "payment-links",
    endpoint: "/api/payment-link",
});

/**
 * Query keys exportées pour usage externe si nécessaire
 */
export const paymentLinkKeys = paymentLinkHooks.keys;

/**
 * Hook pour récupérer tous les liens de paiement
 * Utilise React Query avec cache automatique et invalidation
 */
export function usePaymentLinks() {
    return paymentLinkHooks.useList();
}

/**
 * Hook pour récupérer un lien de paiement spécifique
 */
export function usePaymentLink(id: string) {
    return paymentLinkHooks.useDetail(id);
}

/**
 * Hook pour créer un nouveau lien de paiement
 * Invalide automatiquement le cache après création
 */
export function useCreatePaymentLink() {
    const mutation = paymentLinkHooks.useCreate<PaymentLinkFormData>();

    return useMutation({
        mutationFn: mutation.mutateAsync,
        onSuccess: () => {
            toast.success("Lien créé avec succès !");
        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message || "Erreur lors de la création");
        },
    });
}

/**
 * Hook pour mettre à jour un lien de paiement
 * Invalide automatiquement le cache après mise à jour
 */
export function useUpdatePaymentLink() {
    const mutation = paymentLinkHooks.useUpdate<PaymentLinkFormData>();

    return useMutation({
        mutationFn: mutation.mutateAsync,
        onSuccess: () => {
            toast.success("Lien mis à jour avec succès !");
        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message || "Erreur lors de la mise à jour");
        },
    });
}

/**
 * Hook pour supprimer un lien de paiement
 * Invalide automatiquement le cache après suppression
 */
export function useDeletePaymentLink() {
    const mutation = paymentLinkHooks.useDelete();

    return useMutation({
        mutationFn: mutation.mutateAsync,
        onSuccess: () => {
            toast.success("Lien supprimé");
        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message || "Erreur lors de la suppression");
        },
    });
}

/**
 * Hook pour activer/désactiver un lien de paiement
 * Invalide automatiquement le cache après toggle
 */
export function useTogglePaymentLinkActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (linkId: string) => {
            const response = await api.post<{ actif: boolean }>(
                `/api/payment-link/${linkId}/toggle-active`
            );
            return response;
        },
        onSuccess: (data) => {
            // Invalide le cache pour forcer un rechargement
            queryClient.invalidateQueries({ queryKey: paymentLinkKeys.all });
            toast.success(data.actif ? "Lien activé" : "Lien désactivé");
        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message || "Erreur lors du changement de statut");
        },
    });
}

/**
 * Utilitaire pour copier le lien dans le presse-papiers
 * Non-mutative, ne nécessite pas de cache invalidation
 */
export function useCopyPaymentLink() {
    return {
        copyLink: (link: PaymentLink) => {
            const url = `${window.location.origin}/payment-link/${link.slug}`;
            navigator.clipboard.writeText(url);
            toast.success("Lien copié !");
        },
    };
}

/**
 * Utilitaire pour calculer le taux de conversion
 * Pure function, ne nécessite pas de cache
 */
export function usePaymentLinkStats() {
    return {
        getTauxConversion: (link: PaymentLink): string => {
            if (link.nombreVues === 0) return "0";
            return ((link.nombrePaiements / link.nombreVues) * 100).toFixed(1);
        },
    };
}

/**
 * Hook tout-en-un pour compatibilité avec l'ancien code
 * @deprecated Utilisez les hooks individuels pour plus de flexibilité
 */
export function usePaymentLinksLegacy() {
    const { data: paymentLinks = [], isLoading } = usePaymentLinks();
    const createMutation = useCreatePaymentLink();
    const deleteMutation = useDeletePaymentLink();
    const toggleMutation = useTogglePaymentLinkActive();
    const { copyLink } = useCopyPaymentLink();
    const { getTauxConversion } = usePaymentLinkStats();

    return {
        paymentLinks,
        isLoading,
        createPaymentLink: async (formData: PaymentLinkFormData) => {
            try {
                await createMutation.mutateAsync(formData);
                return true;
            } catch {
                return false;
            }
        },
        toggleActive: async (link: PaymentLink) => {
            await toggleMutation.mutateAsync(link.id);
        },
        deletePaymentLink: async (link: PaymentLink) => {
            if (
                !confirm(`Êtes-vous sûr de vouloir supprimer "${link.titre}" ?`)
            ) {
                return;
            }
            await deleteMutation.mutateAsync(link.id);
        },
        copyLink,
        getTauxConversion,
    };
}

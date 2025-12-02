/**
 * Status workflow operations for Reparations
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import {
    baseInvalidateKeys,
    type Reparation,
    type ReparationStatut,
} from "./types";

export function useUpdateReparationStatus() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; statut: ReparationStatut; notes?: string }
    >({
        mutationFn: ({ id, statut, notes }) =>
            api.post(`/api/reparations/${id}/status`, { statut, notes }),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Statut mis à jour",
            successDescription: "Le statut de la réparation a été modifié.",
        },
    });
}

export function useAssignTechnician() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; technicienId: string }
    >({
        mutationFn: ({ id, technicienId }) =>
            api.post(`/api/reparations/${id}/assign`, { technicienId }),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Technicien assigné",
            successDescription: "Le technicien a été assigné à la réparation.",
        },
    });
}

export function useAddDiagnostic() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; diagnostic: string; coutEstime?: number }
    >({
        mutationFn: ({ id, diagnostic, coutEstime }) =>
            api.post(`/api/reparations/${id}/diagnostic`, {
                diagnostic,
                coutEstime,
            }),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Diagnostic enregistré",
            successDescription: "Le diagnostic a été ajouté à la réparation.",
        },
    });
}

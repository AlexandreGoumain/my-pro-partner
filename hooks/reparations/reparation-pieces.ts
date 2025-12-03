/**
 * Pieces sub-resource operations for Reparations
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import { reparationKeys, type ReparationPiece } from "./types";

interface AddPieceData {
    reparationId: string;
    data: {
        articleId?: string;
        ressourceAtelierId?: string;
        designation: string;
        quantite: number;
        prixUnitaireHT: number;
        tauxTVA: number;
    };
}

export function useAddPiece() {
    return useMutationWithInvalidation<ReparationPiece, AddPieceData>({
        mutationFn: ({ reparationId, data }) =>
            api.post(`/api/reparations/${reparationId}/pieces`, data),
        invalidateKeys: [reparationKeys.all],
        messages: {
            success: "Pièce ajoutée",
            successDescription: "La pièce a été ajoutée à la réparation.",
        },
    });
}

export function useDeletePiece() {
    return useMutationWithInvalidation<
        void,
        { reparationId: string; pieceId: string }
    >({
        mutationFn: ({ reparationId, pieceId }) =>
            api.delete(`/api/reparations/${reparationId}/pieces/${pieceId}`),
        invalidateKeys: [reparationKeys.all],
        messages: {
            success: "Pièce retirée",
            successDescription: "La pièce a été retirée de la réparation.",
        },
    });
}

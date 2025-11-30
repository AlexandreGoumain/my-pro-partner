"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface EtatDesLieuxFilters {
    type?: string;
    bailId?: string;
    search?: string;
    planifies?: boolean;
}

export interface EtatDesLieuxWithRelations {
    id: string;
    bailId: string;
    typeEtat: "ENTREE" | "SORTIE";
    dateEtat: string;
    releveEau?: number;
    releveElec?: number;
    releveGaz?: number;
    constatations?: any;
    photos?: string[];
    signatureLocataire?: string;
    signatureProprietaire?: string;
    dateSignature?: string;
    retenueDepot?: number;
    motifRetenue?: string;
    documentUrl?: string;
    notes?: string;
    bail: {
        id: string;
        reference: string;
        bien: {
            id: string;
            titre: string;
            adresse?: string;
            ville?: string;
            surface?: number;
        };
        locatairePrincipal?: {
            id: string;
            nom: string;
            prenom: string;
            telephone?: string;
            email?: string;
        };
    };
}

export interface CreateEtatDesLieuxInput {
    bailId: string;
    typeEtat: "ENTREE" | "SORTIE";
    dateEtat: string;
    releveEau?: number;
    releveElec?: number;
    releveGaz?: number;
    constatations?: any;
    photos?: string[];
    notes?: string;
}

export interface UpdateEtatDesLieuxInput {
    releveEau?: number;
    releveElec?: number;
    releveGaz?: number;
    constatations?: any;
    photos?: string[];
    signatureLocataire?: string;
    signatureProprietaire?: string;
    dateSignature?: string;
    retenueDepot?: number;
    motifRetenue?: string;
    notes?: string;
}

export const etatsLieuxKeys = {
    all: ["etatsLieux"] as const,
    list: (filters?: EtatDesLieuxFilters) => ["etatsLieux", "list", filters] as const,
    detail: (id: string) => ["etatsLieux", "detail", id] as const,
    planifies: () => ["etatsLieux", "planifies"] as const,
};

async function fetchEtatsLieux(filters?: EtatDesLieuxFilters): Promise<EtatDesLieuxWithRelations[]> {
    const params = new URLSearchParams();
    if (filters?.type && filters.type !== "ALL") params.append("type", filters.type);
    if (filters?.bailId) params.append("bailId", filters.bailId);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.planifies) params.append("planifies", "true");

    const response = await fetch(`/api/gestion-locative/etats-lieux?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch etats des lieux");
    }
    const data = await response.json();
    return data.etatsLieux;
}

async function fetchEtatDesLieux(id: string): Promise<EtatDesLieuxWithRelations> {
    const response = await fetch(`/api/gestion-locative/etats-lieux/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch etat des lieux");
    }
    const data = await response.json();
    return data.etatDesLieux;
}

async function createEtatDesLieux(input: CreateEtatDesLieuxInput): Promise<EtatDesLieuxWithRelations> {
    const response = await fetch("/api/gestion-locative/etats-lieux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create etat des lieux");
    }
    const data = await response.json();
    return data.etatDesLieux;
}

async function updateEtatDesLieux(
    id: string,
    input: UpdateEtatDesLieuxInput
): Promise<EtatDesLieuxWithRelations> {
    const response = await fetch(`/api/gestion-locative/etats-lieux/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update etat des lieux");
    }
    const data = await response.json();
    return data.etatDesLieux;
}

async function signerEtatDesLieux(
    id: string,
    signatures: { signatureLocataire?: string; signatureProprietaire?: string }
): Promise<EtatDesLieuxWithRelations> {
    const response = await fetch(`/api/gestion-locative/etats-lieux/${id}/signer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signatures),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign etat des lieux");
    }
    const data = await response.json();
    return data.etatDesLieux;
}

// Hooks
export function useEtatsLieux(filters?: EtatDesLieuxFilters) {
    return useQuery({
        queryKey: etatsLieuxKeys.list(filters),
        queryFn: () => fetchEtatsLieux(filters),
    });
}

export function useEtatDesLieux(id: string) {
    return useQuery({
        queryKey: etatsLieuxKeys.detail(id),
        queryFn: () => fetchEtatDesLieux(id),
        enabled: !!id,
    });
}

export function useEtatsLieuxPlanifies() {
    return useQuery({
        queryKey: etatsLieuxKeys.planifies(),
        queryFn: () => fetchEtatsLieux({ planifies: true }),
    });
}

export function useCreateEtatDesLieux() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEtatDesLieux,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: etatsLieuxKeys.all });
        },
    });
}

export function useUpdateEtatDesLieux() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...input }: { id: string } & UpdateEtatDesLieuxInput) =>
            updateEtatDesLieux(id, input),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: etatsLieuxKeys.all });
            queryClient.invalidateQueries({
                queryKey: etatsLieuxKeys.detail(variables.id),
            });
        },
    });
}

export function useSignerEtatDesLieux() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            signatures,
        }: {
            id: string;
            signatures: { signatureLocataire?: string; signatureProprietaire?: string };
        }) => signerEtatDesLieux(id, signatures),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: etatsLieuxKeys.all });
            queryClient.invalidateQueries({
                queryKey: etatsLieuxKeys.detail(variables.id),
            });
        },
    });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CoproprietesFilters {
    search?: string;
}

export interface CoproprieteWithRelations {
    id: string;
    reference: string;
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    nbBatiments: number;
    nbLots: number;
    totalTantiemes: number;
    numeroImmatriculation?: string;
    dateImmatriculation?: string;
    dateCreation?: string;
    datePriseSyndic: string;
    dateFinMandat?: string;
    comptePrincipal?: string;
    compteTravaux?: string;
    reglementCopro?: string;
    notes?: string;
    _count?: {
        lots: number;
        appelsCharges: number;
        assemblees: number;
    };
}

export interface CreateCoproprieteInput {
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    nbBatiments?: number;
    nbLots: number;
    totalTantiemes: number;
    numeroImmatriculation?: string;
    dateImmatriculation?: string;
    dateCreation?: string;
    datePriseSyndic: string;
    comptePrincipal?: string;
    compteTravaux?: string;
    notes?: string;
}

export const coproprietesKeys = {
    all: ["coproprietes"] as const,
    list: (filters?: CoproprietesFilters) => ["coproprietes", "list", filters] as const,
    detail: (id: string) => ["coproprietes", "detail", id] as const,
};

async function fetchCoproprietes(filters?: CoproprietesFilters): Promise<CoproprieteWithRelations[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);

    const response = await fetch(`/api/syndic/coproprietes?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch coproprietes");
    }
    const data = await response.json();
    return data.coproprietes;
}

async function fetchCopropriete(id: string): Promise<CoproprieteWithRelations> {
    const response = await fetch(`/api/syndic/coproprietes/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch copropriete");
    }
    const data = await response.json();
    return data.copropriete;
}

async function createCopropriete(input: CreateCoproprieteInput): Promise<CoproprieteWithRelations> {
    const response = await fetch("/api/syndic/coproprietes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create copropriete");
    }
    const data = await response.json();
    return data.copropriete;
}

// Hooks
export function useCoproprietes(filters?: CoproprietesFilters) {
    return useQuery({
        queryKey: coproprietesKeys.list(filters),
        queryFn: () => fetchCoproprietes(filters),
    });
}

export function useCopropriete(id: string) {
    return useQuery({
        queryKey: coproprietesKeys.detail(id),
        queryFn: () => fetchCopropriete(id),
        enabled: !!id,
    });
}

export function useCreateCopropriete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCopropriete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: coproprietesKeys.all });
        },
    });
}

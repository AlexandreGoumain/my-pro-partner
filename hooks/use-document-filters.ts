import { useMemo, useState } from "react";
import type { DocumentStatus } from "@/lib/types/document.types";

interface DocumentWithClient {
    numero: string;
    dateEmission: Date;
    statut: DocumentStatus;
    total_ttc: number;
    client: {
        nom: string;
        prenom: string | null;
    };
}

interface UseDocumentFiltersReturn<T> {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    statusFilter: DocumentStatus | "TOUS";
    setStatusFilter: (status: DocumentStatus | "TOUS") => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    filteredAndSortedDocuments: T[];
}

/**
 * Custom hook for managing document filters, sorting, and view mode
 * Handles search, status filtering, sorting, and view mode (grid/list)
 *
 * @param documents - Array of documents to filter and sort
 * @returns Filter state, setters, and filtered/sorted documents
 */
export function useDocumentFilters<T extends DocumentWithClient>(
    documents: T[]
): UseDocumentFiltersReturn<T> {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<DocumentStatus | "TOUS">("TOUS");
    const [sortBy, setSortBy] = useState("Date récente");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredAndSortedDocuments = useMemo(() => {
        let filtered = documents;

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter((doc) => {
                const clientName = `${doc.client.nom} ${doc.client.prenom || ""}`.toLowerCase();
                return (
                    doc.numero.toLowerCase().includes(searchLower) ||
                    clientName.includes(searchLower)
                );
            });
        }

        // Filter by status
        if (statusFilter !== "TOUS") {
            filtered = filtered.filter((doc) => doc.statut === statusFilter);
        }

        // Sort documents
        const sorted = [...filtered];
        switch (sortBy) {
            case "Date récente":
                sorted.sort(
                    (a, b) =>
                        new Date(b.dateEmission).getTime() -
                        new Date(a.dateEmission).getTime()
                );
                break;
            case "Date ancienne":
                sorted.sort(
                    (a, b) =>
                        new Date(a.dateEmission).getTime() -
                        new Date(b.dateEmission).getTime()
                );
                break;
            case "Numéro croissant":
                sorted.sort((a, b) => a.numero.localeCompare(b.numero));
                break;
            case "Numéro décroissant":
                sorted.sort((a, b) => b.numero.localeCompare(a.numero));
                break;
            case "Montant croissant":
                sorted.sort((a, b) => a.total_ttc - b.total_ttc);
                break;
            case "Montant décroissant":
                sorted.sort((a, b) => b.total_ttc - a.total_ttc);
                break;
            case "Client A-Z":
                sorted.sort((a, b) => a.client.nom.localeCompare(b.client.nom));
                break;
            case "Client Z-A":
                sorted.sort((a, b) => b.client.nom.localeCompare(a.client.nom));
                break;
        }

        return sorted;
    }, [documents, searchTerm, statusFilter, sortBy]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        filteredAndSortedDocuments,
    };
}

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { DocumentStatus } from "@/lib/types/document.types";

interface UseDocumentListProps<T> {
    documents: T[];
    onConvertToInvoice?: (document: T) => Promise<void>;
}

interface UseDocumentListReturn<T> {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: DocumentStatus | "TOUS";
    setStatusFilter: (status: DocumentStatus | "TOUS") => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    filteredAndSortedDocuments: T[];
    handleConvertToInvoice: (document: T) => Promise<void>;
}

/**
 * Custom hook for managing document list pages
 * Handles filtering, sorting, and document operations
 *
 * @param props Documents and handlers
 * @returns Filters, handlers, and filtered documents
 */
export function useDocumentList<T extends { id: string; numero: string; statut: string; dateEmission: string; total_ttc: number; client: { nom: string; prenom?: string | null } }>({
    documents,
    onConvertToInvoice,
}: UseDocumentListProps<T>): UseDocumentListReturn<T> {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<DocumentStatus | "TOUS">("TOUS");
    const [sortBy, setSortBy] = useState("Date récente");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleConvertToInvoice = async (document: T) => {
        if (onConvertToInvoice) {
            await onConvertToInvoice(document);
            return;
        }

        try {
            const response = await fetch(`/api/documents/${document.id}/convert`, {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la conversion");
            }

            const data = await response.json();
            toast.success("Devis converti en facture avec succès");
            router.push(`/dashboard/documents/invoices/${data.invoice.id}`);
        } catch (error) {
            console.error("[Document List] Error converting document:", error);
            toast.error(error instanceof Error ? error.message : "Impossible de convertir le document");
        }
    };

    const filteredAndSortedDocuments = useMemo(() => {
        let filtered = [...documents];

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
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "Date récente":
                    return new Date(b.dateEmission).getTime() - new Date(a.dateEmission).getTime();
                case "Date ancienne":
                    return new Date(a.dateEmission).getTime() - new Date(b.dateEmission).getTime();
                case "Montant croissant":
                    return Number(a.total_ttc) - Number(b.total_ttc);
                case "Montant décroissant":
                    return Number(b.total_ttc) - Number(a.total_ttc);
                case "Client A-Z":
                    return a.client.nom.localeCompare(b.client.nom);
                case "Client Z-A":
                    return b.client.nom.localeCompare(a.client.nom);
                default:
                    return 0;
            }
        });

        return filtered;
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
        handleConvertToInvoice,
    };
}

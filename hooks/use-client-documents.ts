import type { ClientDocument } from "@/lib/types/document";
import { useEffect, useState } from "react";

interface UseClientDocumentsReturn {
    documents: ClientDocument[];
    isLoading: boolean;
    error: Error | null;
    downloadPDF: (documentId: string) => Promise<void>;
    refetch: () => Promise<void>;
}

export function useClientDocuments(): UseClientDocumentsReturn {
    const [documents, setDocuments] = useState<ClientDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem("clientToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const res = await fetch("/api/client/documents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch documents: ${res.status}`);
            }

            const data = await res.json();
            setDocuments(data.documents);
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error("Failed to fetch documents");
            setError(error);
            console.error("Failed to fetch documents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPDF = async (documentId: string) => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const res = await fetch(`/api/documents/${documentId}/pdf`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to download PDF: ${res.status}`);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `document-${documentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Failed to download PDF:", err);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return {
        documents,
        isLoading,
        error,
        downloadPDF,
        refetch: fetchDocuments,
    };
}

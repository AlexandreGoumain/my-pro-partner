import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DocumentLine {
    id: string;
    designation: string;
    description?: string | null;
    quantite: number;
    prix_unitaire_ht: number;
    tva_taux: number;
    remise_pourcent: number;
    montant_ht: number;
    montant_tva: number;
    montant_ttc: number;
}

interface Payment {
    id: string;
    date_paiement: string;
    montant: number;
    moyen_paiement: string;
    reference?: string | null;
    notes?: string | null;
}

interface Document {
    id: string;
    numero: string;
    type: string;
    dateEmission: string;
    dateEcheance?: string | null;
    statut: string;
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    acompte_montant: number;
    reste_a_payer: number;
    notes?: string | null;
    conditions_paiement?: string | null;
    lignes: DocumentLine[];
    paiements: Payment[];
}

interface UseClientDocumentDetailReturn {
    document: Document | null;
    isLoading: boolean;
    downloadPdf: () => Promise<void>;
    isDownloading: boolean;
}

/**
 * Custom hook for fetching and managing client document details
 */
export function useClientDocumentDetail(
    documentId: string
): UseClientDocumentDetailReturn {
    const router = useRouter();
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const fetchDocument = useCallback(async () => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) {
                router.push("/client/login");
                return;
            }

            const res = await fetch(`/api/client/documents/${documentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    router.push("/client/login");
                    return;
                }
                throw new Error("Erreur lors du chargement");
            }

            const data = await res.json();
            setDocument(data.document);
        } catch (error) {
            toast.error("Erreur lors du chargement du document");
        } finally {
            setIsLoading(false);
        }
    }, [documentId, router]);

    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    const downloadPdf = useCallback(async () => {
        if (!document) return;

        setIsDownloading(true);
        try {
            const token = localStorage.getItem("clientToken");
            const res = await fetch(
                `/api/client/documents/${documentId}/download`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Erreur lors du téléchargement");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = window.document.createElement("a");
            a.href = url;
            a.download = `${document.numero}.pdf`;
            window.document.body.appendChild(a);
            a.click();
            window.document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success("Document téléchargé avec succès");
        } catch (error) {
            toast.error("Erreur lors du téléchargement");
        } finally {
            setIsDownloading(false);
        }
    }, [documentId, document]);

    return {
        document,
        isLoading,
        downloadPdf,
        isDownloading,
    };
}

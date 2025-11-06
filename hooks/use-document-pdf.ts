import { useRef, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "@/hooks/use-documents";

interface UseDocumentPdfProps {
    documentId: string;
    documentType: "DEVIS" | "FACTURE" | "AVOIR";
    documentNumero: string;
    onClose?: () => void;
}

interface UseDocumentPdfReturn {
    contentRef: React.RefObject<HTMLDivElement>;
    isDownloading: boolean;
    isSending: boolean;
    handleDownloadPdf: () => Promise<void>;
    handlePrint: () => void;
    handleSendEmail: () => Promise<void>;
    getDocumentTypeLabel: () => string;
}

/**
 * Custom hook for managing document PDF operations
 * Handles PDF download, printing, and email sending
 *
 * @param props Document information and handlers
 * @returns PDF operation handlers and state
 */
export function useDocumentPdf({
    documentId,
    documentType,
    documentNumero,
    onClose,
}: UseDocumentPdfProps): UseDocumentPdfReturn {
    const queryClient = useQueryClient();
    const contentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const getDocumentTypeLabel = () => {
        const labels = {
            DEVIS: "Devis",
            FACTURE: "Facture",
            AVOIR: "Avoir",
        };
        return labels[documentType];
    };

    const handleDownloadPdf = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(`/api/documents/${documentId}/pdf`);

            if (!response.ok) {
                throw new Error("Erreur lors de la génération du PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = window.document.createElement("a");
            a.href = url;
            a.download = `${getDocumentTypeLabel()}_${documentNumero}.pdf`;

            window.document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            window.document.body.removeChild(a);

            toast.success("PDF téléchargé avec succès");
        } catch (error) {
            console.error("[PDF Dialog] Error downloading PDF:", error);
            toast.error("Erreur lors du téléchargement du PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrint = () => {
        const printContent = contentRef.current;
        if (!printContent) return;

        const printWindow = window.open("", "", "width=800,height=600");
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>${documentType} ${documentNumero}</title>
                    <style>
                        @media print {
                            @page {
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                            }
                        }
                        body {
                            font-family: system-ui, -apple-system, sans-serif;
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const handleSendEmail = async () => {
        try {
            setIsSending(true);
            const response = await fetch(`/api/documents/${documentId}/send`, {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'envoi de l'email");
            }

            const data = await response.json();

            // Invalidate queries to refresh document status
            queryClient.invalidateQueries({ queryKey: documentKeys.all });

            toast.success(data.message || "Document envoyé par email avec succès");
            onClose?.();
        } catch (error) {
            console.error("[PDF Dialog] Error sending email:", error);
            toast.error(error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email");
        } finally {
            setIsSending(false);
        }
    };

    return {
        contentRef,
        isDownloading,
        isSending,
        handleDownloadPdf,
        handlePrint,
        handleSendEmail,
        getDocumentTypeLabel,
    };
}

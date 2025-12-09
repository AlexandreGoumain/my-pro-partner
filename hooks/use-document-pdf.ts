import { useRef, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "@/hooks/use-documents";
import DOMPurify from "dompurify";

interface UseDocumentPdfProps {
    documentId: string;
    documentType: "DEVIS" | "FACTURE" | "AVOIR";
    documentNumero: string;
    onClose?: () => void;
}

interface UseDocumentPdfReturn {
    contentRef: React.RefObject<HTMLDivElement | null>;
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

        // Security: Sanitize HTML content to prevent XSS attacks
        const sanitizedContent = DOMPurify.sanitize(printContent.innerHTML, {
            ALLOWED_TAGS: [
                "div", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6",
                "table", "thead", "tbody", "tr", "th", "td",
                "ul", "ol", "li", "br", "hr", "strong", "b", "em", "i",
                "img", "svg", "path", "rect", "circle", "line", "polyline", "polygon",
            ],
            ALLOWED_ATTR: [
                "class", "style", "src", "alt", "width", "height",
                "colspan", "rowspan", "viewBox", "d", "fill", "stroke",
                "stroke-width", "cx", "cy", "r", "x", "y", "x1", "y1", "x2", "y2",
                "points", "transform",
            ],
            ALLOW_DATA_ATTR: false,
        });

        // Also sanitize dynamic values in the title
        const safeDocumentType = DOMPurify.sanitize(documentType);
        const safeDocumentNumero = DOMPurify.sanitize(documentNumero);

        printWindow.document.write(`
            <html>
                <head>
                    <title>${safeDocumentType} ${safeDocumentNumero}</title>
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
                    ${sanitizedContent}
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

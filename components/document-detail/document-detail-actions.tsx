import { Button } from "@/components/ui/button";
import { DocumentStatusManager } from "@/components/document-status-manager";
import { ArrowLeft, Download, Trash2, Receipt } from "lucide-react";
import { DocumentType, DocumentStatus } from "@/lib/types/document.types";

export interface DocumentDetailActionsProps {
    documentId: string;
    documentType: DocumentType;
    currentStatus: DocumentStatus;
    canConvert?: boolean;
    onBack: () => void;
    onGeneratePdf: () => void;
    onStatusChanged: () => void;
    onDelete: () => void;
    onConvert?: () => void;
}

/**
 * Reusable component for document detail page actions
 * Includes back, PDF, status manager, convert, and delete buttons
 */
export function DocumentDetailActions({
    documentId,
    documentType,
    currentStatus,
    canConvert = false,
    onBack,
    onGeneratePdf,
    onStatusChanged,
    onDelete,
    onConvert,
}: DocumentDetailActionsProps) {
    return (
        <>
            <Button
                onClick={onBack}
                variant="outline"
                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
            >
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                Retour
            </Button>
            <Button
                onClick={onGeneratePdf}
                variant="outline"
                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
            >
                <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                Générer PDF
            </Button>
            <DocumentStatusManager
                documentId={documentId}
                currentStatus={currentStatus}
                documentType={documentType}
                onStatusChanged={onStatusChanged}
            />
            {canConvert && onConvert && (
                <Button
                    onClick={onConvert}
                    className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                >
                    <Receipt className="w-4 h-4 mr-2" strokeWidth={2} />
                    Convertir en facture
                </Button>
            )}
            <Button
                onClick={onDelete}
                variant="outline"
                className="h-11 px-6 text-[14px] font-medium border-red-200 text-red-600 hover:bg-red-50"
            >
                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Supprimer
            </Button>
        </>
    );
}

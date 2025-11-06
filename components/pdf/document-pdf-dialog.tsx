"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DocumentTemplate } from "./document-template";
import { Download, Printer, Send } from "lucide-react";
import { useDocumentPdf } from "@/hooks/use-document-pdf";

interface DocumentPdfDialogProps {
    isOpen: boolean;
    onClose: () => void;
    document: any;
    company: any;
}

export function DocumentPdfDialog({
    isOpen,
    onClose,
    document,
    company,
}: DocumentPdfDialogProps) {
    const {
        contentRef,
        isDownloading,
        isSending,
        handleDownloadPdf,
        handlePrint,
        handleSendEmail,
    } = useDocumentPdf({
        documentId: document.id,
        documentType: document.type,
        documentNumero: document.numero,
        onClose,
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        Aperçu du document
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        {document.type} {document.numero}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-3 justify-end">
                        <Button
                            onClick={handleSendEmail}
                            disabled={isSending || isDownloading}
                            className="h-10 px-4 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
                        >
                            <Send className="w-4 h-4 mr-2" strokeWidth={2} />
                            {isSending ? "Envoi..." : "Envoyer par email"}
                        </Button>
                        <Button
                            onClick={handleDownloadPdf}
                            disabled={isDownloading || isSending}
                            variant="outline"
                            className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Download className="w-4 h-4 mr-2" strokeWidth={2} />
                            {isDownloading ? "Génération..." : "Télécharger PDF"}
                        </Button>
                        <Button
                            onClick={handlePrint}
                            disabled={isSending || isDownloading}
                            variant="outline"
                            className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Printer className="w-4 h-4 mr-2" strokeWidth={2} />
                            Imprimer
                        </Button>
                    </div>

                    <div
                        ref={contentRef}
                        className="border border-gray-200 rounded-lg overflow-hidden shadow-lg"
                    >
                        <DocumentTemplate
                            type={document.type}
                            numero={document.numero}
                            dateEmission={document.dateEmission}
                            dateEcheance={document.dateEcheance}
                            client={document.client}
                            company={company}
                            lignes={document.lignes}
                            total_ht={Number(document.total_ht)}
                            total_tva={Number(document.total_tva)}
                            total_ttc={Number(document.total_ttc)}
                            notes={document.notes}
                            conditions_paiement={document.conditions_paiement}
                            mentions_legales={company.mentions_legales}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

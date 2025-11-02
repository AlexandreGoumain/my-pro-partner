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
import { Download, Printer } from "lucide-react";
import { useRef } from "react";

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
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = contentRef.current;
        if (!printContent) return;

        const printWindow = window.open("", "", "width=800,height=600");
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>${document.type} ${document.numero}</title>
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
                            onClick={handlePrint}
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

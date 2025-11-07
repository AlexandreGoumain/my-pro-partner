"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Document {
    id: string;
    numero: string;
    type: "DEVIS" | "FACTURE" | "AVOIR";
    dateEmission: string;
    dateEcheance?: string;
    statut: string;
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    reste_a_payer: number;
}

const documentTypeLabels = {
    DEVIS: "Devis",
    FACTURE: "Facture",
    AVOIR: "Avoir",
};

const statusColors = {
    BROUILLON: "bg-black/5 text-black/60",
    ENVOYE: "bg-black/10 text-black/70",
    ACCEPTE: "bg-black/15 text-black/80",
    REFUSE: "bg-black/10 text-black/60",
    PAYE: "bg-black text-white",
    ANNULE: "bg-black/5 text-black/40",
};

const statusLabels = {
    BROUILLON: "Brouillon",
    ENVOYE: "Envoyé",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    PAYE: "Payé",
    ANNULE: "Annulé",
};

export default function ClientDocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch("/api/client/documents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async (documentId: string) => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch(`/api/documents/${documentId}/pdf`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `document-${documentId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Failed to download PDF:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-black/5 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                    Mes documents
                </h1>
                <p className="text-[14px] text-black/60 mt-1">
                    Consultez et téléchargez vos devis, factures et avoirs
                </p>
            </div>

            {/* Documents List */}
            {documents.length === 0 ? (
                <Card className="border-black/8 shadow-sm">
                    <div className="p-12 text-center">
                        <div className="rounded-full h-16 w-16 bg-black/5 flex items-center justify-center mx-auto mb-4">
                            <FileText
                                className="w-8 h-8 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                            Aucun document
                        </h3>
                        <p className="text-[14px] text-black/60">
                            Vos documents apparaîtront ici
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <Card
                            key={doc.id}
                            className="border-black/8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-[16px] font-semibold text-black">
                                                {documentTypeLabels[doc.type]}{" "}
                                                {doc.numero}
                                            </h3>
                                            <Badge
                                                variant="secondary"
                                                className={`border-0 text-[11px] h-5 px-2 ${
                                                    statusColors[
                                                        doc.statut as keyof typeof statusColors
                                                    ]
                                                }`}
                                            >
                                                {
                                                    statusLabels[
                                                        doc.statut as keyof typeof statusLabels
                                                    ]
                                                }
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-[13px] text-black/60">
                                            <span>
                                                Émis le{" "}
                                                {format(
                                                    new Date(doc.dateEmission),
                                                    "dd MMM yyyy",
                                                    { locale: fr }
                                                )}
                                            </span>
                                            {doc.dateEcheance && (
                                                <span>
                                                    Échéance :{" "}
                                                    {format(
                                                        new Date(doc.dateEcheance),
                                                        "dd MMM yyyy",
                                                        { locale: fr }
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-[18px] font-semibold text-black">
                                                {new Intl.NumberFormat("fr-FR", {
                                                    style: "currency",
                                                    currency: "EUR",
                                                }).format(Number(doc.total_ttc))}
                                            </p>
                                            {doc.reste_a_payer > 0 && (
                                                <p className="text-[13px] text-black/60">
                                                    Reste à payer :{" "}
                                                    {new Intl.NumberFormat("fr-FR", {
                                                        style: "currency",
                                                        currency: "EUR",
                                                    }).format(Number(doc.reste_a_payer))}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleDownloadPDF(doc.id)}
                                        variant="outline"
                                        className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                                    >
                                        <Download
                                            className="h-4 w-4 mr-2 text-black/60"
                                            strokeWidth={2}
                                        />
                                        <span className="text-black/80">PDF</span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

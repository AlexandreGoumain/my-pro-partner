"use client";

import {
    DocumentCard,
    DocumentsEmptyState,
    DocumentsLoadingSkeleton,
} from "@/components/client/documents";
import { PageHeader } from "@/components/ui/page-header";
import { useClientDocuments } from "@/hooks/use-client-documents";

export default function ClientDocumentsPage() {
    const { documents, isLoading, downloadPDF } = useClientDocuments();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Mes documents"
                    description="Consultez et téléchargez vos devis, factures et avoirs"
                />
                <DocumentsLoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Mes documents"
                description="Consultez et téléchargez vos devis, factures et avoirs"
            />

            {/* Documents List */}
            {documents.length === 0 ? (
                <DocumentsEmptyState />
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            onDownload={downloadPDF}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

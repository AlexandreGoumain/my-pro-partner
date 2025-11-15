"use client";

import {
    DocumentCard,
} from "@/components/client/documents";
import { ClientTabSkeleton } from "@/components/ui/client-tab-skeleton";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useClientDocuments } from "@/hooks/use-client-documents";
import { FileText } from "lucide-react";

export default function ClientDocumentsPage() {
    const { documents, isLoading, downloadPDF } = useClientDocuments();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mes documents"
                description="Consultez et téléchargez vos devis, factures et avoirs"
            />

            <ConditionalSkeleton
                isLoading={isLoading}
                fallback={<ClientTabSkeleton variant="documents" />}
            >

            {/* Documents List */}
            {documents.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="Aucun document"
                    description="Vos documents apparaîtront ici"
                />
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
            </ConditionalSkeleton>
        </div>
    );
}

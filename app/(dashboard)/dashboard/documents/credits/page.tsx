"use client";

import { DocumentListPage } from "@/components/documents";
import { useDocumentPage } from "@/hooks/use-document-page";
import { Document } from "@/lib/types/document.types";
import { FileText } from "lucide-react";
import { createColumns } from "./columns";

const CREDIT_COLUMN_LABELS: Record<string, string> = {
    select: "Sélection",
    numero: "Numéro",
    client: "Client",
    dateEmission: "Date d'émission",
    statut: "Statut",
    total_ttc: "Montant TTC",
    actions: "Actions",
};

export default function CreditsPage() {
    const page = useDocumentPage<Document>({
        documentType: "AVOIR",
        basePath: "/dashboard/documents/credits",
        createColumns,
    });

    return (
        <DocumentListPage
            title={page.label.title}
            description={page.label.description}
            emptyTitle={page.label.emptyTitle}
            emptyDescription={page.label.emptyDescription}
            createButtonLabel={page.label.new}
            emptyIcon={FileText}
            documents={page.documents}
            columns={page.columns}
            isLoading={page.isLoading}
            emptyMessage={page.label.notFound}
            itemLabel={page.label.plural}
            columnLabels={CREDIT_COLUMN_LABELS}
            onCreate={page.handlers.handleCreate}
        />
    );
}

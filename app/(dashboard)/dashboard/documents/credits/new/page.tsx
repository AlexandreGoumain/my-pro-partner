"use client";

import { DocumentFormPage } from "@/components/document-form/document-form-page";

export default function NewCreditNotePage() {
    return (
        <DocumentFormPage
            documentType="AVOIR"
            title="Nouvel avoir"
            description="Créez un nouvel avoir pour un remboursement client"
            redirectPath="/dashboard/documents/credits"
        />
    );
}

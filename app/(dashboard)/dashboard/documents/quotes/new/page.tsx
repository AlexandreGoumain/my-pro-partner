import { DocumentFormPage } from "@/components/document-form/document-form-page";

export default function NewQuotePage() {
    return (
        <DocumentFormPage
            documentType="DEVIS"
            title="Nouveau devis"
            description="Créez un devis pour votre client"
            redirectPath="/dashboard/documents/quotes"
        />
    );
}

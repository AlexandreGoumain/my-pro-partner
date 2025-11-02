import { DocumentFormPage } from "@/components/document-form/document-form-page";

export default function NewInvoicePage() {
    return (
        <DocumentFormPage
            documentType="FACTURE"
            title="Nouvelle facture"
            description="Créez une facture pour votre client"
            redirectPath="/dashboard/documents/invoices"
        />
    );
}

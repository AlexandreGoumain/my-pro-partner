import { DocumentFormPage } from "@/components/document-form/document-form-page";

export default function EditQuotePage() {
    return (
        <DocumentFormPage
            documentType="DEVIS"
            title="Modifier le devis"
            description="Modifiez les informations de votre devis"
            redirectPath="/dashboard/documents/quotes"
            mode="edit"
        />
    );
}

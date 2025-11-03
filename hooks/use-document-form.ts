import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LineItem } from "@/components/document-form/line-items-editor";
import type {
    Client,
    Article,
    DocumentFormData,
    DocumentType,
    DocumentStatus,
} from "@/lib/types/document.types";
import { DOCUMENT_DEFAULTS, MESSAGES } from "@/lib/constants/document.constants";
import { useClients } from "./use-clients";
import { useArticles } from "./use-articles";
import { useSeries } from "./use-series";

interface UseDocumentFormOptions {
    documentType: DocumentType;
    redirectPath: string;
}

export function useDocumentForm({ documentType, redirectPath }: UseDocumentFormOptions) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lines, setLines] = useState<LineItem[]>([]);

    // Utiliser React Query pour fetcher les données
    const { data: clientsData = [] } = useClients(DOCUMENT_DEFAULTS.FETCH_LIMIT);
    const { data: articlesData = [] } = useArticles();
    const { data: seriesData = [] } = useSeries();

    // Convertir les données pour le formulaire
    const clients = clientsData as unknown as Client[];
    const articles = articlesData as unknown as Article[];
    const series = seriesData as unknown[];

    const [formData, setFormData] = useState<DocumentFormData>({
        clientId: "",
        serieId: "", // Optional serie selection
        dateEmission: new Date().toISOString().split("T")[0],
        dateEcheance: "",
        validite_jours: DOCUMENT_DEFAULTS.VALIDITY_DAYS,
        notes: "",
        conditions_paiement: "",
    });

    // Calculer la date d'échéance par défaut une seule fois au montage
    useEffect(() => {
        const today = new Date();
        const expiryDate = new Date(today);
        expiryDate.setDate(today.getDate() + DOCUMENT_DEFAULTS.VALIDITY_DAYS);
        setFormData((prev) => ({
            ...prev,
            dateEcheance: expiryDate.toISOString().split("T")[0],
        }));
    }, []);

    const totals = useMemo(() => {
        const totalHT = lines.reduce((sum, line) => sum + line.montant_ht, 0);
        const totalTVA = lines.reduce((sum, line) => sum + line.montant_tva, 0);
        const totalTTC = lines.reduce((sum, line) => sum + line.montant_ttc, 0);

        return {
            totalHT: Math.round(totalHT * 100) / 100,
            totalTVA: Math.round(totalTVA * 100) / 100,
            totalTTC: Math.round(totalTTC * 100) / 100,
        };
    }, [lines]);

    const validateForm = (): boolean => {
        if (!formData.clientId) {
            toast.error(MESSAGES.ERRORS.SELECT_CLIENT);
            return false;
        }

        if (lines.length === 0) {
            toast.error(MESSAGES.ERRORS.ADD_LINE);
            return false;
        }

        return true;
    };

    const handleSubmit = async (statut: DocumentStatus) => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                type: documentType,
                clientId: formData.clientId,
                ...(formData.serieId && { serieId: formData.serieId }), // Optional serie
                dateEmission: formData.dateEmission,
                dateEcheance: formData.dateEcheance,
                validite_jours: formData.validite_jours,
                statut,
                notes: formData.notes,
                conditions_paiement: formData.conditions_paiement,
                total_ht: totals.totalHT,
                total_tva: totals.totalTVA,
                total_ttc: totals.totalTTC,
                lignes: lines.map((line, index) => ({
                    ordre: index + 1,
                    articleId: line.articleId || null,
                    designation: line.designation,
                    description: line.description || null,
                    quantite: line.quantite,
                    prix_unitaire_ht: line.prix_unitaire_ht,
                    tva_taux: line.tva_taux,
                    remise_pourcent: line.remise_pourcent,
                    montant_ht: line.montant_ht,
                    montant_tva: line.montant_tva,
                    montant_ttc: line.montant_ttc,
                })),
            };

            const response = await fetch("/api/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || MESSAGES.ERRORS.CREATE_DOCUMENT);
            }

            const data = await response.json();

            const successMessage =
                statut === "BROUILLON"
                    ? MESSAGES.SUCCESS.DRAFT_SAVED
                    : documentType === "DEVIS"
                    ? MESSAGES.SUCCESS.QUOTE_SENT
                    : MESSAGES.SUCCESS.INVOICE_SENT;

            toast.success(successMessage);
            router.push(`${redirectPath}/${data.document.id}`);
        } catch (error: any) {
            console.error("Error creating document:", error);
            toast.error(error.message || MESSAGES.ERRORS.CREATE_DOCUMENT);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        clients,
        series,
        articles,
        lines,
        setLines,
        totals,
        isSubmitting,
        handleSubmit,
    };
}

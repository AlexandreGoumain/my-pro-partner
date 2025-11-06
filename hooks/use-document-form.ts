import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
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
import { useDocument, documentKeys } from "./use-documents";

interface UseDocumentFormOptions {
    documentType: DocumentType;
    redirectPath: string;
    documentId?: string;
}

export function useDocumentForm({ documentType, redirectPath, documentId }: UseDocumentFormOptions) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lines, setLines] = useState<LineItem[]>([]);

    // Charger le document existant si en mode édition
    const { data: existingDocument, isLoading: isLoadingDocument } = useDocument(documentId || "");

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

    // Charger les données du document existant en mode édition
    useEffect(() => {
        if (existingDocument && documentId) {
            // Préremplir le formulaire avec les données existantes
            setFormData({
                clientId: existingDocument.client.id || "",
                serieId: existingDocument.serieId || "",
                dateEmission: existingDocument.dateEmission
                    ? new Date(existingDocument.dateEmission).toISOString().split("T")[0]
                    : "",
                dateEcheance: existingDocument.dateEcheance
                    ? new Date(existingDocument.dateEcheance).toISOString().split("T")[0]
                    : "",
                validite_jours: existingDocument.validite_jours || DOCUMENT_DEFAULTS.VALIDITY_DAYS,
                notes: existingDocument.notes || "",
                conditions_paiement: existingDocument.conditions_paiement || "",
            });

            // Préremplir les lignes
            const loadedLines: LineItem[] = existingDocument.lignes.map((ligne) => ({
                id: ligne.id,
                articleId: ligne.articleId || null,
                designation: ligne.designation,
                description: ligne.description || "",
                quantite: Number(ligne.quantite || 0),
                prix_unitaire_ht: Number(ligne.prix_unitaire_ht || 0),
                tva_taux: Number(ligne.tva_taux || 20),
                remise_pourcent: Number(ligne.remise_pourcent || 0),
                montant_ht: Number(ligne.montant_ht || 0),
                montant_tva: Number(ligne.montant_tva || 0),
                montant_ttc: Number(ligne.montant_ttc || 0),
            }));
            setLines(loadedLines);
        }
    }, [existingDocument, documentId]);

    // Calculer la date d'échéance par défaut une seule fois au montage (uniquement en mode création)
    useEffect(() => {
        if (!documentId) {
            const today = new Date();
            const expiryDate = new Date(today);
            expiryDate.setDate(today.getDate() + DOCUMENT_DEFAULTS.VALIDITY_DAYS);
            setFormData((prev) => ({
                ...prev,
                dateEcheance: expiryDate.toISOString().split("T")[0],
            }));
        }
    }, [documentId]);

    const totals = useMemo(() => {
        const totalHT = lines.reduce((sum, line) => sum + Number(line.montant_ht || 0), 0);
        const totalTVA = lines.reduce((sum, line) => sum + Number(line.montant_tva || 0), 0);
        const totalTTC = lines.reduce((sum, line) => sum + Number(line.montant_ttc || 0), 0);

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

        // Vérifier que chaque ligne a au moins une désignation
        const emptyLines = lines.filter(
            (line) => !line.designation || line.designation.trim() === ""
        );
        if (emptyLines.length > 0) {
            toast.error("Veuillez remplir la désignation pour toutes les lignes");
            return false;
        }

        // Vérifier qu'il y a au moins une ligne avec un montant > 0
        const validLines = lines.filter((line) => Number(line.montant_ttc || 0) > 0);
        if (validLines.length === 0) {
            toast.error("Au moins une ligne doit avoir un montant supérieur à 0");
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

            const isEditMode = !!documentId;
            const url = isEditMode ? `/api/documents/${documentId}` : "/api/documents";
            const method = isEditMode ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || MESSAGES.ERRORS.CREATE_DOCUMENT);
            }

            const data = await response.json();

            // Invalider toutes les requêtes de documents pour rafraîchir les données
            queryClient.invalidateQueries({ queryKey: documentKeys.all });

            const successMessage = isEditMode
                ? "Document mis à jour avec succès"
                : statut === "BROUILLON"
                ? MESSAGES.SUCCESS.DRAFT_SAVED
                : documentType === "DEVIS"
                ? MESSAGES.SUCCESS.QUOTE_SENT
                : MESSAGES.SUCCESS.INVOICE_SENT;

            toast.success(successMessage);
            router.push(`${redirectPath}/${data.document?.id || documentId}`);
        } catch (error: any) {
            console.error("[Document Form] Error creating/updating document:", error);
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
        isLoadingDocument,
        handleSubmit,
    };
}

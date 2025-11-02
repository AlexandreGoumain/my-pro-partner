"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { LineItemsEditor, LineItem } from "@/components/document-form/line-items-editor";
import { DocumentTotals } from "@/components/document-form/document-totals";
import { ClientCombobox } from "@/components/document-form/client-combobox";
import { ArrowLeft, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function NewQuotePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clients, setClients] = useState<Array<{ id: string; nom: string; prenom: string | null; email: string | null; telephone: string | null }>>([]);
    const [articles, setArticles] = useState<Array<{ id: string; nom: string; reference?: string; type: "PRODUIT" | "SERVICE"; prix_ht: number; tva_taux: number }>>([]);

    const [formData, setFormData] = useState({
        clientId: "",
        dateEmission: new Date().toISOString().split("T")[0],
        dateEcheance: "",
        validite_jours: 30,
        notes: "",
        conditions_paiement: "",
    });

    const [lines, setLines] = useState<LineItem[]>([]);

    useEffect(() => {
        fetchClients();
        fetchArticles();

        // Calculate default expiry date
        const today = new Date();
        const expiryDate = new Date(today);
        expiryDate.setDate(today.getDate() + 30);
        setFormData(prev => ({
            ...prev,
            dateEcheance: expiryDate.toISOString().split("T")[0]
        }));
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch("/api/clients?limit=1000");
            if (!response.ok) throw new Error("Erreur lors du chargement des clients");
            const data = await response.json();
            // L'API retourne { data: clients, pagination: {...} }
            setClients(data.data || data.clients || []);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Impossible de charger les clients");
        }
    };

    const fetchArticles = async () => {
        try {
            const response = await fetch("/api/articles?limit=1000");
            if (!response.ok) throw new Error("Erreur lors du chargement des articles");
            const data = await response.json();
            // L'API retourne { data: articles, pagination: {...} }
            setArticles(data.data || data.articles || []);
        } catch (error) {
            console.error("Error fetching articles:", error);
            toast.error("Impossible de charger les articles");
        }
    };

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

    const handleSubmit = async (statut: "BROUILLON" | "ENVOYE") => {
        if (!formData.clientId) {
            toast.error("Veuillez sélectionner un client");
            return;
        }

        if (lines.length === 0) {
            toast.error("Veuillez ajouter au moins une ligne");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                type: "DEVIS",
                clientId: formData.clientId,
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
                throw new Error(error.message || "Erreur lors de la création du devis");
            }

            const data = await response.json();

            toast.success(
                statut === "BROUILLON"
                    ? "Devis enregistré en brouillon"
                    : "Devis créé et envoyé avec succès"
            );

            router.push(`/dashboard/documents/quotes/${data.document.id}`);
        } catch (error: any) {
            console.error("Error creating quote:", error);
            toast.error(error.message || "Impossible de créer le devis");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Nouveau devis"
                description="Créez un devis pour votre client"
                actions={
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                        Retour
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 border-black/8 shadow-sm">
                        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                            Informations générales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="client" className="text-[14px] font-medium">
                                    Client *
                                </Label>
                                <ClientCombobox
                                    clients={clients}
                                    value={formData.clientId}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, clientId: value }))
                                    }
                                    triggerClassName="h-11 text-[14px] border-black/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateEmission" className="text-[14px] font-medium">
                                    Date d&apos;émission
                                </Label>
                                <Input
                                    id="dateEmission"
                                    type="date"
                                    value={formData.dateEmission}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            dateEmission: e.target.value,
                                        }))
                                    }
                                    className="h-11 border-black/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateEcheance" className="text-[14px] font-medium">
                                    Date d&apos;échéance
                                </Label>
                                <Input
                                    id="dateEcheance"
                                    type="date"
                                    value={formData.dateEcheance}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            dateEcheance: e.target.value,
                                        }))
                                    }
                                    className="h-11 border-black/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="validite" className="text-[14px] font-medium">
                                    Validité (jours)
                                </Label>
                                <Input
                                    id="validite"
                                    type="number"
                                    value={formData.validite_jours}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            validite_jours: parseInt(e.target.value) || 30,
                                        }))
                                    }
                                    className="h-11 border-black/10"
                                />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <Label htmlFor="conditions" className="text-[14px] font-medium">
                                Conditions de paiement
                            </Label>
                            <Input
                                id="conditions"
                                value={formData.conditions_paiement}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        conditions_paiement: e.target.value,
                                    }))
                                }
                                placeholder="Ex: Paiement à 30 jours"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <Label htmlFor="notes" className="text-[14px] font-medium">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                                }
                                placeholder="Notes ou commentaires additionnels..."
                                className="min-h-[100px] border-black/10"
                            />
                        </div>
                    </Card>

                    <LineItemsEditor
                        lines={lines}
                        onChange={setLines}
                        articles={articles}
                    />
                </div>

                <div className="space-y-6">
                    <DocumentTotals
                        totalHT={totals.totalHT}
                        totalTVA={totals.totalTVA}
                        totalTTC={totals.totalTTC}
                    />

                    <div className="space-y-3">
                        <Button
                            onClick={() => handleSubmit("ENVOYE")}
                            disabled={isSubmitting}
                            className="w-full h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                        >
                            <Send className="w-4 h-4 mr-2" strokeWidth={2} />
                            {isSubmitting ? "Enregistrement..." : "Créer et envoyer"}
                        </Button>
                        <Button
                            onClick={() => handleSubmit("BROUILLON")}
                            disabled={isSubmitting}
                            variant="outline"
                            className="w-full h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Save className="w-4 h-4 mr-2" strokeWidth={2} />
                            Enregistrer en brouillon
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

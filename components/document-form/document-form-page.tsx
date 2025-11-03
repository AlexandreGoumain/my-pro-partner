"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { LineItemsEditor } from "./line-items-editor";
import { DocumentTotals } from "./document-totals";
import { ClientCombobox } from "./client-combobox";
import { SerieCombobox } from "./serie-combobox";
import { ArrowLeft, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDocumentForm } from "@/hooks/use-document-form";
import type { DocumentType } from "@/lib/types/document.types";

interface DocumentFormPageProps {
    documentType: DocumentType;
    title: string;
    description: string;
    redirectPath: string;
}

export function DocumentFormPage({
    documentType,
    title,
    description,
    redirectPath,
}: DocumentFormPageProps) {
    const router = useRouter();
    const {
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
    } = useDocumentForm({ documentType, redirectPath });

    return (
        <div className="space-y-6">
            <PageHeader
                title={title}
                description={description}
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
                                <Label htmlFor="serie" className="text-[14px] font-medium">
                                    Série de numérotation
                                </Label>
                                <SerieCombobox
                                    series={series}
                                    value={formData.serieId || ""}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, serieId: value }))
                                    }
                                    triggerClassName="h-11 text-[14px] border-black/10"
                                />
                                <p className="text-[12px] text-black/40">
                                    Laissez vide pour utiliser la série par défaut
                                </p>
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

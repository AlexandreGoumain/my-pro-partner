"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SerieDocument, ResetCompteur } from "@/lib/types/settings";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileText, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FormatBuilder } from "./format-builder";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface SerieDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serie?: SerieDocument | null;
    onSave: (data: Partial<SerieDocument>) => Promise<void>;
}

// Templates simplifiés avec preview
const SIMPLE_TEMPLATES = [
    {
        id: "factures-classiques",
        nom: "Factures classiques",
        description: "Format simple et professionnel",
        code: "FACT",
        format: "{CODE}{NUM5}",
        preview: "FACT-00001",
        pour_devis: false,
        pour_factures: true,
        pour_avoirs: false,
    },
    {
        id: "devis-simples",
        nom: "Devis simples",
        description: "Numérotation claire pour vos devis",
        code: "DEV",
        format: "{CODE}{NUM5}",
        preview: "DEV-00001",
        pour_devis: true,
        pour_factures: false,
        pour_avoirs: false,
    },
    {
        id: "tout-en-un",
        nom: "Tout-en-un",
        description: "Une série pour tous vos documents",
        code: "DOC",
        format: "{CODE}-{YEAR}-{NUM5}",
        preview: "DOC-2025-00001",
        pour_devis: true,
        pour_factures: true,
        pour_avoirs: true,
    },
    {
        id: "par-annee",
        nom: "Par année",
        description: "Recommence chaque année",
        code: "FACT",
        format: "{CODE}-{YEAR}-{NUM5}",
        preview: "FACT-2025-00001",
        pour_devis: false,
        pour_factures: true,
        pour_avoirs: false,
        reset: "ANNUEL" as ResetCompteur,
    },
];

export function SerieDialogSimple({ open, onOpenChange, serie, onSave }: SerieDialogProps) {
    const isEdit = !!serie;
    const [isSaving, setIsSaving] = useState(false);
    const [showTemplates, setShowTemplates] = useState(!isEdit);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        nom: "",
        description: "",
        couleur: "#000000",
        pour_devis: false,
        pour_factures: false,
        pour_avoirs: false,
        format_numero: "{CODE}{NUM5}",
        reset_compteur: "AUCUN" as ResetCompteur,
        est_defaut_devis: false,
        est_defaut_factures: false,
        est_defaut_avoirs: false,
    });

    useEffect(() => {
        if (serie) {
            setFormData({
                code: serie.code,
                nom: serie.nom,
                description: serie.description || "",
                couleur: serie.couleur || "#000000",
                pour_devis: serie.pour_devis,
                pour_factures: serie.pour_factures,
                pour_avoirs: serie.pour_avoirs,
                format_numero: serie.format_numero,
                reset_compteur: serie.reset_compteur,
                est_defaut_devis: serie.est_defaut_devis,
                est_defaut_factures: serie.est_defaut_factures,
                est_defaut_avoirs: serie.est_defaut_avoirs,
            });
            setShowTemplates(false);
        } else {
            setFormData({
                code: "",
                nom: "",
                description: "",
                couleur: "#000000",
                pour_devis: false,
                pour_factures: false,
                pour_avoirs: false,
                format_numero: "{CODE}{NUM5}",
                reset_compteur: "AUCUN" as ResetCompteur,
                est_defaut_devis: false,
                est_defaut_factures: false,
                est_defaut_avoirs: false,
            });
            setShowTemplates(true);
        }
    }, [serie, open]);

    const handleTemplateSelect = (template: typeof SIMPLE_TEMPLATES[number]) => {
        setFormData((prev) => ({
            ...prev,
            code: template.code,
            nom: template.nom,
            format_numero: template.format,
            pour_devis: template.pour_devis,
            pour_factures: template.pour_factures,
            pour_avoirs: template.pour_avoirs,
            reset_compteur: template.reset || "AUCUN",
            // Auto-définir par défaut si une seule option cochée
            est_defaut_devis: template.pour_devis && !template.pour_factures && !template.pour_avoirs,
            est_defaut_factures: template.pour_factures && !template.pour_devis && !template.pour_avoirs,
            est_defaut_avoirs: template.pour_avoirs && !template.pour_devis && !template.pour_factures,
        }));
        setShowTemplates(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await onSave(formData);
            // Le parent gère la fermeture de la modale après succès
        } catch (error) {
            console.error("Error saving serie:", error);
            // En cas d'erreur, on garde la modale ouverte pour que l'utilisateur puisse corriger
        } finally {
            setIsSaving(false);
        }
    };

    // Générer le preview du numéro
    const getPreview = () => {
        if (!formData.code) return "Entrez un nom ci-dessus";

        let preview = formData.format_numero;
        preview = preview.replace("{CODE}", formData.code);
        preview = preview.replace("{NUM5}", "00001");
        preview = preview.replace("{NUM4}", "0001");
        preview = preview.replace("{NUM3}", "001");
        preview = preview.replace("{YEAR}", "2025");
        preview = preview.replace("{YEAR2}", "25");
        preview = preview.replace("{MONTH}", "01");
        preview = preview.replace("{TYPE}", "FACT");

        return preview;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        {isEdit ? "Modifier la série" : "Créer une série de numérotation"}
                    </DialogTitle>
                    <DialogDescription className="text-[14px]">
                        {isEdit
                            ? "Modifiez les paramètres de cette série"
                            : "Choisissez un modèle ou créez votre propre série"}
                    </DialogDescription>
                </DialogHeader>

                {/* Templates visuels */}
                {showTemplates && !isEdit && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {SIMPLE_TEMPLATES.map((template) => (
                                <Card
                                    key={template.id}
                                    className="p-4 border-black/8 hover:border-black/20 cursor-pointer transition-all duration-200 hover:shadow-md"
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-black/5">
                                                <FileText className="h-5 w-5 text-black/60" strokeWidth={2} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[15px] font-semibold text-black">
                                                    {template.nom}
                                                </h4>
                                                <p className="text-[12px] text-black/40 mt-0.5">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-black/5 rounded-md p-3 text-center">
                                            <div className="text-[11px] text-black/40 mb-1">Exemple de numéro</div>
                                            <code className="text-[18px] font-mono font-semibold text-black">
                                                {template.preview}
                                            </code>
                                        </div>

                                        <div className="flex gap-1.5">
                                            {template.pour_devis && (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-black/10">
                                                    Devis
                                                </Badge>
                                            )}
                                            {template.pour_factures && (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-black/10">
                                                    Factures
                                                </Badge>
                                            )}
                                            {template.pour_avoirs && (
                                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-black/10">
                                                    Avoirs
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowTemplates(false)}
                            className="w-full h-11 border-black/10 hover:bg-black/5"
                        >
                            Créer une série personnalisée
                        </Button>
                    </div>
                )}

                {/* Formulaire simplifié */}
                {(!showTemplates || isEdit) && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Preview permanent */}
                        <div className="bg-black/5 rounded-lg p-4 border border-black/10">
                            <div className="text-center">
                                <div className="text-[12px] text-black/40 mb-2">Aperçu du prochain numéro</div>
                                <code className="text-[24px] font-mono font-bold text-black">
                                    {getPreview()}
                                </code>
                            </div>
                        </div>

                        {/* Nom de la série */}
                        <div className="space-y-2">
                            <Label htmlFor="nom" className="text-[15px] font-medium">
                                Nom de la série
                            </Label>
                            <Input
                                id="nom"
                                value={formData.nom}
                                onChange={(e) => {
                                    const nom = e.target.value;
                                    const code = nom
                                        .toUpperCase()
                                        .replace(/[^A-Z0-9]/g, "")
                                        .slice(0, 10);
                                    setFormData((prev) => ({ ...prev, nom, code }));
                                }}
                                placeholder="Ex: Mes factures 2025"
                                className="h-12 text-[15px] border-black/10"
                                required
                            />
                            <p className="text-[12px] text-black/40">
                                Le code <code className="font-mono font-semibold">{formData.code || "AUTO"}</code> sera généré automatiquement
                            </p>
                        </div>

                        {/* Types de documents */}
                        <div className="space-y-3">
                            <Label className="text-[15px] font-medium">
                                Pour quels documents ?
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                <Card
                                    className={`p-4 cursor-pointer transition-all duration-200 ${
                                        formData.pour_devis
                                            ? "border-black bg-black/5"
                                            : "border-black/10 hover:border-black/20"
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newValue = !formData.pour_devis;
                                        setFormData((prev) => ({
                                            ...prev,
                                            pour_devis: newValue,
                                            est_defaut_devis: newValue && !prev.pour_factures && !prev.pour_avoirs,
                                        }));
                                    }}
                                >
                                    <div className="flex items-center gap-2 pointer-events-none">
                                        <Checkbox checked={formData.pour_devis} />
                                        <span className="text-[14px] font-medium">Devis</span>
                                    </div>
                                </Card>

                                <Card
                                    className={`p-4 cursor-pointer transition-all duration-200 ${
                                        formData.pour_factures
                                            ? "border-black bg-black/5"
                                            : "border-black/10 hover:border-black/20"
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newValue = !formData.pour_factures;
                                        setFormData((prev) => ({
                                            ...prev,
                                            pour_factures: newValue,
                                            est_defaut_factures: newValue && !prev.pour_devis && !prev.pour_avoirs,
                                        }));
                                    }}
                                >
                                    <div className="flex items-center gap-2 pointer-events-none">
                                        <Checkbox checked={formData.pour_factures} />
                                        <span className="text-[14px] font-medium">Factures</span>
                                    </div>
                                </Card>

                                <Card
                                    className={`p-4 cursor-pointer transition-all duration-200 ${
                                        formData.pour_avoirs
                                            ? "border-black bg-black/5"
                                            : "border-black/10 hover:border-black/20"
                                    }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newValue = !formData.pour_avoirs;
                                        setFormData((prev) => ({
                                            ...prev,
                                            pour_avoirs: newValue,
                                            est_defaut_avoirs: newValue && !prev.pour_devis && !prev.pour_factures,
                                        }));
                                    }}
                                >
                                    <div className="flex items-center gap-2 pointer-events-none">
                                        <Checkbox checked={formData.pour_avoirs} />
                                        <span className="text-[14px] font-medium">Avoirs</span>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Utiliser par défaut */}
                        {(formData.pour_devis || formData.pour_factures || formData.pour_avoirs) && (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                                <h4 className="text-[14px] font-medium text-black mb-2">
                                    Utiliser par défaut ?
                                </h4>
                                <p className="text-[12px] text-black/60 mb-3">
                                    Cochez pour utiliser automatiquement cette série lors de la création de documents
                                </p>
                                <div className="space-y-2">
                                    {formData.pour_devis && (
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="defaut_devis"
                                                checked={formData.est_defaut_devis}
                                                onCheckedChange={(checked) =>
                                                    setFormData((prev) => ({ ...prev, est_defaut_devis: checked as boolean }))
                                                }
                                            />
                                            <Label htmlFor="defaut_devis" className="text-[13px] font-normal cursor-pointer">
                                                Par défaut pour les devis
                                            </Label>
                                        </div>
                                    )}
                                    {formData.pour_factures && (
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="defaut_factures"
                                                checked={formData.est_defaut_factures}
                                                onCheckedChange={(checked) =>
                                                    setFormData((prev) => ({ ...prev, est_defaut_factures: checked as boolean }))
                                                }
                                            />
                                            <Label htmlFor="defaut_factures" className="text-[13px] font-normal cursor-pointer">
                                                Par défaut pour les factures
                                            </Label>
                                        </div>
                                    )}
                                    {formData.pour_avoirs && (
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="defaut_avoirs"
                                                checked={formData.est_defaut_avoirs}
                                                onCheckedChange={(checked) =>
                                                    setFormData((prev) => ({ ...prev, est_defaut_avoirs: checked as boolean }))
                                                }
                                            />
                                            <Label htmlFor="defaut_avoirs" className="text-[13px] font-normal cursor-pointer">
                                                Par défaut pour les avoirs
                                            </Label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Options avancées */}
                        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-between h-11 text-[14px] text-black/60 hover:text-black hover:bg-black/5"
                                >
                                    <span>Options avancées</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                            showAdvanced ? "rotate-180" : ""
                                        }`}
                                        strokeWidth={2}
                                    />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4">
                                {/* Format personnalisé */}
                                <div className="space-y-2">
                                    <Label className="text-[14px] font-medium">
                                        Format de numérotation
                                    </Label>
                                    <FormatBuilder
                                        value={formData.format_numero}
                                        code={formData.code}
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, format_numero: value }))
                                        }
                                    />
                                </div>

                                {/* Reset du compteur */}
                                <div className="space-y-2">
                                    <Label htmlFor="reset-compteur" className="text-[14px] font-medium">
                                        Réinitialisation du compteur
                                    </Label>
                                    <Select
                                        value={formData.reset_compteur}
                                        onValueChange={(value: ResetCompteur) =>
                                            setFormData((prev) => ({ ...prev, reset_compteur: value }))
                                        }
                                    >
                                        <SelectTrigger id="reset-compteur" className="h-11 border-black/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AUCUN">Jamais (compteur continu)</SelectItem>
                                            <SelectItem value="ANNUEL">Chaque année (01/01)</SelectItem>
                                            <SelectItem value="MENSUEL">Chaque mois</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-[14px] font-medium">
                                        Description (optionnel)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                        placeholder="Note pour vous aider à identifier cette série..."
                                        className="min-h-[60px] border-black/10"
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSaving}
                                className="border-black/10 hover:bg-black/5"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving || !formData.nom}
                                className="bg-black hover:bg-black/90 text-white"
                            >
                                {isSaving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer la série"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

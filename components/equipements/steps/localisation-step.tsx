"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { EquipementCreateInput } from "@/lib/types/equipement";

interface LocalisationStepProps {
    formData: Partial<EquipementCreateInput>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<EquipementCreateInput>>>;
}

export function LocalisationStep({
    formData,
    setFormData,
}: LocalisationStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">Localisation & Contrôle</h3>
                <p className="text-[13px] text-black/50">
                    Emplacement de l&apos;équipement et paramètres de contrôle
                </p>
            </div>

            {/* Location in home */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium">
                    Emplacement dans le logement
                </Label>
                <Input
                    value={formData.emplacement || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            emplacement: e.target.value,
                        }))
                    }
                    placeholder="Ex: Cave, garage, buanderie..."
                    className="h-11 border-black/10"
                />
            </div>

            {/* Address (if different from client) */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium">
                    Adresse (si différente du client)
                </Label>
                <Input
                    value={formData.adresse || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            adresse: e.target.value,
                        }))
                    }
                    placeholder="Laisser vide si même adresse que le client"
                    className="h-11 border-black/10"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Code postal</Label>
                    <Input
                        value={formData.codePostal || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                codePostal: e.target.value,
                            }))
                        }
                        placeholder="Code postal"
                        className="h-11 border-black/10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Ville</Label>
                    <Input
                        value={formData.ville || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                ville: e.target.value,
                            }))
                        }
                        placeholder="Ville"
                        className="h-11 border-black/10"
                    />
                </div>
            </div>

            {/* Accessibility */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium">Accessibilité</Label>
                <Input
                    value={formData.accessibilite || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            accessibilite: e.target.value,
                        }))
                    }
                    placeholder="Ex: Clé sous paillasson, code 1234..."
                    className="h-11 border-black/10"
                />
            </div>

            {/* Mandatory Control */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-black/[0.02] border border-black/8">
                <div className="space-y-1">
                    <Label className="text-[14px] font-medium">
                        Contrôle obligatoire
                    </Label>
                    <p className="text-[12px] text-black/40">
                        Chaudières gaz, fioul et bois : contrôle annuel obligatoire
                    </p>
                </div>
                <Switch
                    checked={formData.controleObligatoire}
                    onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                            ...prev,
                            controleObligatoire: checked,
                        }))
                    }
                />
            </div>

            {formData.controleObligatoire && (
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">
                        Fréquence de contrôle
                    </Label>
                    <Select
                        value={String(formData.frequenceControleAnnuel || 12)}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                frequenceControleAnnuel: parseInt(value),
                            }))
                        }
                    >
                        <SelectTrigger className="h-11 border-black/10 w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="6">6 mois</SelectItem>
                            <SelectItem value="12">12 mois (annuel)</SelectItem>
                            <SelectItem value="24">24 mois</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium">Notes</Label>
                <Textarea
                    value={formData.notes || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                        }))
                    }
                    placeholder="Informations complémentaires..."
                    className="min-h-[80px] border-black/10 resize-none"
                />
            </div>
        </div>
    );
}

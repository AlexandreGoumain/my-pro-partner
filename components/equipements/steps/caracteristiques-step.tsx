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
import {
    TYPE_ENERGIE_LABELS,
    type EquipementCreateInput,
    type TypeEnergie,
} from "@/lib/types/equipement";

interface CaracteristiquesStepProps {
    formData: Partial<EquipementCreateInput>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<EquipementCreateInput>>>;
}

export function CaracteristiquesStep({
    formData,
    setFormData,
}: CaracteristiquesStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">Caractéristiques</h3>
                <p className="text-[13px] text-black/50">
                    Puissance, énergie et dates importantes
                </p>
            </div>

            {/* Power & Energy */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Puissance (kW)</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={formData.puissanceKw || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                puissanceKw: e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                            }))
                        }
                        placeholder="Ex: 24"
                        className="h-11 border-black/10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Type d&apos;énergie</Label>
                    <Select
                        value={formData.typeEnergie || ""}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                typeEnergie: value as TypeEnergie,
                            }))
                        }
                    >
                        <SelectTrigger className="h-11 border-black/10">
                            <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(TYPE_ENERGIE_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">
                        Date d&apos;installation
                    </Label>
                    <Input
                        type="date"
                        value={formData.dateInstallation || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                dateInstallation: e.target.value,
                            }))
                        }
                        className="h-11 border-black/10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Mise en service</Label>
                    <Input
                        type="date"
                        value={formData.dateMiseEnService || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                dateMiseEnService: e.target.value,
                            }))
                        }
                        className="h-11 border-black/10"
                    />
                </div>
            </div>

            {/* Warranty & Installer */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Fin de garantie</Label>
                    <Input
                        type="date"
                        value={formData.garantieJusquau || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                garantieJusquau: e.target.value,
                            }))
                        }
                        className="h-11 border-black/10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Installé par</Label>
                    <Input
                        value={formData.installePar || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                installePar: e.target.value,
                            }))
                        }
                        placeholder="Nom de l'installateur"
                        className="h-11 border-black/10"
                    />
                </div>
            </div>
        </div>
    );
}

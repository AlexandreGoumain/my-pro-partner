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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateMission } from "@/hooks/use-missions";
import type { MissionWithDetails, TypeFacturation } from "@/lib/types/mission";
import {
    TYPE_FACTURATION,
    TYPE_FACTURATION_DESCRIPTIONS,
    TYPE_FACTURATION_LABELS,
} from "@/lib/types/mission";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

export interface MissionEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mission: MissionWithDetails;
}

export function MissionEditDialog({
    open,
    onOpenChange,
    mission,
}: MissionEditDialogProps) {
    const updateMission = useUpdateMission();

    const [nom, setNom] = useState(mission.nom);
    const [description, setDescription] = useState(mission.description || "");
    const [typeFact, setTypeFact] = useState<TypeFacturation>(mission.typeFact);
    const [montantForfait, setMontantForfait] = useState(
        mission.montantForfait?.toString() || ""
    );
    const [tauxHoraire, setTauxHoraire] = useState(
        mission.tauxHoraire?.toString() || ""
    );
    const [budgetHeures, setBudgetHeures] = useState(
        mission.budgetHeures
            ? Math.floor(mission.budgetHeures / 60).toString()
            : ""
    );
    const [dateDebut, setDateDebut] = useState(
        mission.dateDebut?.split("T")[0] || ""
    );
    const [dateFin, setDateFin] = useState(
        mission.dateFin?.split("T")[0] || ""
    );
    const [dateEcheance, setDateEcheance] = useState(
        mission.dateEcheance?.split("T")[0] || ""
    );

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                setNom(mission.nom);
                setDescription(mission.description || "");
                setTypeFact(mission.typeFact);
                setMontantForfait(mission.montantForfait?.toString() || "");
                setTauxHoraire(mission.tauxHoraire?.toString() || "");
                setBudgetHeures(
                    mission.budgetHeures
                        ? Math.floor(mission.budgetHeures / 60).toString()
                        : ""
                );
                setDateDebut(mission.dateDebut?.split("T")[0] || "");
                setDateFin(mission.dateFin?.split("T")[0] || "");
                setDateEcheance(mission.dateEcheance?.split("T")[0] || "");
            }
            onOpenChange(newOpen);
        },
        [mission, onOpenChange]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await updateMission.mutateAsync({
            id: mission.id,
            data: {
                nom: nom.trim(),
                description: description.trim() || undefined,
                typeFact,
                montantForfait: montantForfait
                    ? parseFloat(montantForfait)
                    : undefined,
                tauxHoraire: tauxHoraire ? parseFloat(tauxHoraire) : undefined,
                budgetHeures: budgetHeures
                    ? parseInt(budgetHeures) * 60
                    : undefined,
                dateDebut: dateDebut || undefined,
                dateFin: dateFin || undefined,
                dateEcheance: dateEcheance || undefined,
            },
        });

        onOpenChange(false);
    };

    const isValid = nom.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-[18px] font-semibold">
                            Modifier la mission
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-black/40">
                            {mission.numero}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        {/* Nom */}
                        <div className="space-y-2">
                            <Label htmlFor="nom" className="text-[13px]">
                                Nom de la mission *
                            </Label>
                            <Input
                                id="nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Ex: Audit stratégique Q4"
                                className="h-10"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-[13px]"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description détaillée..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        {/* Type facturation */}
                        <div className="space-y-2">
                            <Label htmlFor="typeFact" className="text-[13px]">
                                Type de facturation
                            </Label>
                            <Select
                                value={typeFact}
                                onValueChange={(v) =>
                                    setTypeFact(v as TypeFacturation)
                                }
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_FACTURATION.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            <div>
                                                <div className="font-medium">
                                                    {
                                                        TYPE_FACTURATION_LABELS[
                                                            type
                                                        ]
                                                    }
                                                </div>
                                                <div className="text-[11px] text-black/40">
                                                    {
                                                        TYPE_FACTURATION_DESCRIPTIONS[
                                                            type
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Montant forfait */}
                        {typeFact === "FORFAIT" && (
                            <div className="space-y-2">
                                <Label
                                    htmlFor="montantForfait"
                                    className="text-[13px]"
                                >
                                    Montant du forfait (€)
                                </Label>
                                <Input
                                    id="montantForfait"
                                    type="number"
                                    step="0.01"
                                    value={montantForfait}
                                    onChange={(e) =>
                                        setMontantForfait(e.target.value)
                                    }
                                    placeholder="5000"
                                    className="h-10"
                                />
                            </div>
                        )}

                        {/* Taux horaire */}
                        {(typeFact === "REGIE" || typeFact === "MIXTE") && (
                            <div className="space-y-2">
                                <Label
                                    htmlFor="tauxHoraire"
                                    className="text-[13px]"
                                >
                                    Taux horaire (€/h)
                                </Label>
                                <Input
                                    id="tauxHoraire"
                                    type="number"
                                    step="0.01"
                                    value={tauxHoraire}
                                    onChange={(e) =>
                                        setTauxHoraire(e.target.value)
                                    }
                                    placeholder="80"
                                    className="h-10"
                                />
                            </div>
                        )}

                        {/* Budget heures */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="budgetHeures"
                                className="text-[13px]"
                            >
                                Budget heures (optionnel)
                            </Label>
                            <Input
                                id="budgetHeures"
                                type="number"
                                value={budgetHeures}
                                onChange={(e) =>
                                    setBudgetHeures(e.target.value)
                                }
                                placeholder="40"
                                className="h-10"
                            />
                            <p className="text-[11px] text-black/40">
                                Nombre d&apos;heures prévues pour cette mission
                            </p>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="dateDebut"
                                    className="text-[13px]"
                                >
                                    Début
                                </Label>
                                <Input
                                    id="dateDebut"
                                    type="date"
                                    value={dateDebut}
                                    onChange={(e) =>
                                        setDateDebut(e.target.value)
                                    }
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="dateFin"
                                    className="text-[13px]"
                                >
                                    Fin prévue
                                </Label>
                                <Input
                                    id="dateFin"
                                    type="date"
                                    value={dateFin}
                                    onChange={(e) => setDateFin(e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="dateEcheance"
                                    className="text-[13px]"
                                >
                                    Échéance
                                </Label>
                                <Input
                                    id="dateEcheance"
                                    type="date"
                                    value={dateEcheance}
                                    onChange={(e) =>
                                        setDateEcheance(e.target.value)
                                    }
                                    className="h-10"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            className="h-10"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isValid || updateMission.isPending}
                            className="h-10 bg-black hover:bg-black/90"
                        >
                            {updateMission.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

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
import { useCreateEcheance, useUpdateEcheance } from "@/hooks/use-echeances";
import {
    type EcheanceFiscale,
    type Mission,
    PERIODICITE_ECHEANCE,
    PERIODICITE_LABELS,
    type PeriodiciteEcheance,
    STATUT_ECHEANCE,
    STATUT_ECHEANCE_LABELS,
    type StatutEcheance,
    TYPE_DOSSIER_COMPTABLE,
    TYPE_DOSSIER_LABELS,
    type TypeDossierComptable,
} from "@/lib/types/mission";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

export interface EcheanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    missions: Mission[];
    echeance?: EcheanceFiscale | null;
    defaultMissionId?: string;
}

export function EcheanceDialog({
    open,
    onOpenChange,
    missions,
    echeance,
    defaultMissionId,
}: EcheanceDialogProps) {
    const createEcheance = useCreateEcheance();
    const updateEcheance = useUpdateEcheance();

    const [missionId, setMissionId] = useState(defaultMissionId || "");
    const [type, setType] = useState<TypeDossierComptable>("TVA");
    const [libelle, setLibelle] = useState("");
    const [dateEcheance, setDateEcheance] = useState("");
    const [periodicite, setPeriodicite] =
        useState<PeriodiciteEcheance>("PONCTUEL");
    const [exerciceFiscal, setExerciceFiscal] = useState("");
    const [notes, setNotes] = useState("");
    const [statut, setStatut] = useState<StatutEcheance>("A_VENIR");

    const isEditMode = !!echeance;

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                if (echeance) {
                    // Edit mode
                    setMissionId(echeance.missionId);
                    setType(echeance.type);
                    setLibelle(echeance.libelle);
                    setDateEcheance(echeance.dateEcheance.split("T")[0]);
                    setPeriodicite(echeance.periodicite);
                    setExerciceFiscal(echeance.exerciceFiscal || "");
                    setNotes(echeance.notes || "");
                    setStatut(echeance.statut);
                } else {
                    // Create mode - auto-generate libelle
                    const year = new Date().getFullYear().toString();
                    setMissionId(defaultMissionId || "");
                    setType("TVA");
                    setLibelle(`${TYPE_DOSSIER_LABELS["TVA"]} ${year}`);
                    setDateEcheance("");
                    setPeriodicite("PONCTUEL");
                    setExerciceFiscal(year);
                    setNotes("");
                    setStatut("A_VENIR");
                }
            }
            onOpenChange(newOpen);
        },
        [echeance, defaultMissionId, onOpenChange]
    );

    // Handle type change - auto-generate libelle for new echeances
    const handleTypeChange = useCallback(
        (newType: TypeDossierComptable) => {
            setType(newType);
            if (!isEditMode) {
                const year = exerciceFiscal || new Date().getFullYear().toString();
                setLibelle(`${TYPE_DOSSIER_LABELS[newType]} ${year}`);
            }
        },
        [isEditMode, exerciceFiscal]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedMission = missions.find((m) => m.id === missionId);
        if (!selectedMission) return;

        if (echeance) {
            // Update existing
            await updateEcheance.mutateAsync({
                id: echeance.id,
                data: {
                    type,
                    libelle,
                    dateEcheance,
                    periodicite,
                    exerciceFiscal: exerciceFiscal || undefined,
                    notes: notes || undefined,
                    statut,
                },
            });
        } else {
            // Create new
            await createEcheance.mutateAsync({
                missionId,
                clientId: selectedMission.clientId,
                type,
                libelle,
                dateEcheance,
                periodicite,
                exerciceFiscal: exerciceFiscal || undefined,
                notes: notes || undefined,
            });
        }

        onOpenChange(false);
    };

    const isLoading = createEcheance.isPending || updateEcheance.isPending;
    const isValid = missionId && type && libelle.trim() && dateEcheance;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-[18px] font-semibold">
                            {isEditMode
                                ? "Modifier l'échéance"
                                : "Nouvelle échéance fiscale"}
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-black/40">
                            {isEditMode
                                ? "Modifiez les détails de cette échéance"
                                : "Ajoutez une échéance fiscale à suivre"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Mission/Dossier */}
                        <div className="space-y-2">
                            <Label htmlFor="mission" className="text-[13px]">
                                Dossier *
                            </Label>
                            <Select
                                value={missionId}
                                onValueChange={setMissionId}
                                disabled={isEditMode}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Sélectionner un dossier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {missions
                                        .filter(
                                            (m) =>
                                                m.statut === "EN_COURS" ||
                                                m.statut === "VALIDEE" ||
                                                m.id === missionId
                                        )
                                        .map((mission) => (
                                            <SelectItem
                                                key={mission.id}
                                                value={mission.id}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-black/60">
                                                        {mission.numero}
                                                    </span>
                                                    <span>{mission.nom}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type and Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-[13px]">
                                    Type *
                                </Label>
                                <Select
                                    value={type}
                                    onValueChange={(v) =>
                                        handleTypeChange(v as TypeDossierComptable)
                                    }
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TYPE_DOSSIER_COMPTABLE.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {TYPE_DOSSIER_LABELS[t]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {isEditMode && (
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="statut"
                                        className="text-[13px]"
                                    >
                                        Statut
                                    </Label>
                                    <Select
                                        value={statut}
                                        onValueChange={(v) =>
                                            setStatut(v as StatutEcheance)
                                        }
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUT_ECHEANCE.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {STATUT_ECHEANCE_LABELS[s]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {!isEditMode && (
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="periodicite"
                                        className="text-[13px]"
                                    >
                                        Périodicité
                                    </Label>
                                    <Select
                                        value={periodicite}
                                        onValueChange={(v) =>
                                            setPeriodicite(
                                                v as PeriodiciteEcheance
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PERIODICITE_ECHEANCE.map((p) => (
                                                <SelectItem key={p} value={p}>
                                                    {PERIODICITE_LABELS[p]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        {/* Libelle */}
                        <div className="space-y-2">
                            <Label htmlFor="libelle" className="text-[13px]">
                                Libellé *
                            </Label>
                            <Input
                                id="libelle"
                                value={libelle}
                                onChange={(e) => setLibelle(e.target.value)}
                                placeholder="Ex: TVA CA3 Octobre 2024"
                                className="h-10"
                            />
                        </div>

                        {/* Date and Exercice */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="dateEcheance"
                                    className="text-[13px]"
                                >
                                    Date limite *
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
                            <div className="space-y-2">
                                <Label
                                    htmlFor="exerciceFiscal"
                                    className="text-[13px]"
                                >
                                    Exercice fiscal
                                </Label>
                                <Input
                                    id="exerciceFiscal"
                                    value={exerciceFiscal}
                                    onChange={(e) =>
                                        setExerciceFiscal(e.target.value)
                                    }
                                    placeholder="2024"
                                    className="h-10"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-[13px]">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Notes internes..."
                                rows={2}
                                className="resize-none"
                            />
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
                            disabled={!isValid || isLoading}
                            className="h-10 bg-black hover:bg-black/90"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isEditMode ? (
                                "Modifier"
                            ) : (
                                "Créer"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

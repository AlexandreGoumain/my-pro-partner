"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCreateTemps, useUpdateTemps } from "@/hooks/use-temps";
import type { EntreeTemps, Mission } from "@/lib/types/mission";
import { minutesToHHMM, parseHHMMToMinutes } from "@/lib/types/mission";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

export interface TimeEntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    missions: Mission[];
    entry?: EntreeTemps | null;
    defaultMissionId?: string;
    defaultDate?: string;
}

export function TimeEntryDialog({
    open,
    onOpenChange,
    missions,
    entry,
    defaultMissionId,
    defaultDate,
}: TimeEntryDialogProps) {
    const createTemps = useCreateTemps();
    const updateTemps = useUpdateTemps();

    const [missionId, setMissionId] = useState(defaultMissionId || "");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [duree, setDuree] = useState("01:00");
    const [description, setDescription] = useState("");
    const [facturable, setFacturable] = useState(true);

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                if (entry) {
                    // Edit mode
                    setMissionId(entry.missionId);
                    setDate(entry.date.split("T")[0]);
                    setDuree(minutesToHHMM(entry.duree));
                    setDescription(entry.description);
                    setFacturable(entry.facturable);
                } else {
                    // Create mode
                    setMissionId(defaultMissionId || "");
                    setDate(defaultDate || new Date().toISOString().split("T")[0]);
                    setDuree("01:00");
                    setDescription("");
                    setFacturable(true);
                }
            }
            onOpenChange(newOpen);
        },
        [entry, defaultMissionId, defaultDate, onOpenChange]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dureeMinutes = parseHHMMToMinutes(duree);

        if (entry) {
            // Update existing entry
            await updateTemps.mutateAsync({
                id: entry.id,
                data: {
                    date,
                    duree: dureeMinutes,
                    description,
                    facturable,
                },
            });
        } else {
            // Create new entry
            await createTemps.mutateAsync({
                missionId,
                date,
                duree: dureeMinutes,
                description,
                facturable,
            });
        }

        onOpenChange(false);
    };

    const isLoading = createTemps.isPending || updateTemps.isPending;
    const isValid = missionId && date && duree && description.trim();

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-[18px] font-semibold">
                            {entry ? "Modifier l'entrée" : "Saisir du temps"}
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-black/40">
                            {entry
                                ? "Modifiez les détails de cette entrée de temps"
                                : "Enregistrez le temps passé sur une mission"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Mission */}
                        <div className="space-y-2">
                            <Label htmlFor="mission" className="text-[13px]">
                                Mission *
                            </Label>
                            <Select
                                value={missionId}
                                onValueChange={setMissionId}
                                disabled={!!entry}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Sélectionner une mission" />
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

                        {/* Date and Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-[13px]">
                                    Date *
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duree" className="text-[13px]">
                                    Durée (HH:MM) *
                                </Label>
                                <Input
                                    id="duree"
                                    type="time"
                                    value={duree}
                                    onChange={(e) => setDuree(e.target.value)}
                                    className="h-10"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-[13px]"
                            >
                                Description *
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Décrivez le travail effectué..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        {/* Facturable */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="facturable"
                                checked={facturable}
                                onCheckedChange={(checked) =>
                                    setFacturable(checked as boolean)
                                }
                            />
                            <Label
                                htmlFor="facturable"
                                className="text-[13px] font-normal cursor-pointer"
                            >
                                Temps facturable au client
                            </Label>
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
                            ) : entry ? (
                                "Modifier"
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

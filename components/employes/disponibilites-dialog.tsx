"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    JOURS_SEMAINE,
    useEmployeDisponibilites,
    useUpdateEmployeDisponibilites,
    type DisponibiliteCreateInput,
    type Employe,
} from "@/hooks/use-employes";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

interface DisponibilitesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    employe: Employe | null;
}

interface DaySchedule {
    enabled: boolean;
    slots: { heureDebut: string; heureFin: string; pause: boolean }[];
}

type WeekSchedule = Record<number, DaySchedule>;

// Helper to build schedule from disponibilites data
function buildScheduleFromData(
    disponibilites: Array<{
        jourSemaine: number;
        heureDebut: string;
        heureFin: string;
        pause: boolean;
    }>
): WeekSchedule {
    const newSchedule: WeekSchedule = {};
    // Initialize all days
    for (let i = 0; i < 7; i++) {
        newSchedule[i] = { enabled: false, slots: [] };
    }
    // Fill with existing data
    for (const dispo of disponibilites) {
        newSchedule[dispo.jourSemaine].enabled = true;
        newSchedule[dispo.jourSemaine].slots.push({
            heureDebut: dispo.heureDebut,
            heureFin: dispo.heureFin,
            pause: dispo.pause,
        });
    }
    return newSchedule;
}

export function DisponibilitesDialog({
    open,
    onOpenChange,
    onSuccess,
    employe,
}: DisponibilitesDialogProps) {
    const [schedule, setSchedule] = useState<WeekSchedule>({});
    const [lastDataKey, setLastDataKey] = useState<string | null>(null);

    const { data: disponibilites } = useEmployeDisponibilites(
        employe?.id || ""
    );
    const updateDisponibilites = useUpdateEmployeDisponibilites();

    // Compute a stable key for the current disponibilites data
    const dataKey = disponibilites ? JSON.stringify(disponibilites) : null;

    // Handle dialog open/close
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen && disponibilites) {
                setSchedule(buildScheduleFromData(disponibilites));
                setLastDataKey(dataKey);
            } else if (!newOpen) {
                // Reset tracking when closing so we re-initialize on next open
                setLastDataKey(null);
            }
            onOpenChange(newOpen);
        },
        [disponibilites, dataKey, onOpenChange]
    );

    // Initialize schedule when data arrives while dialog is already open
    // This is needed because disponibilites loads async
    if (open && disponibilites && dataKey !== lastDataKey) {
        setSchedule(buildScheduleFromData(disponibilites));
        setLastDataKey(dataKey);
    }

    const toggleDay = (day: number) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                enabled: !prev[day]?.enabled,
                slots: prev[day]?.enabled
                    ? []
                    : [
                          {
                              heureDebut: "09:00",
                              heureFin: "18:00",
                              pause: false,
                          },
                      ],
            },
        }));
    };

    const addSlot = (day: number) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: [
                    ...(prev[day]?.slots || []),
                    { heureDebut: "09:00", heureFin: "18:00", pause: false },
                ],
            },
        }));
    };

    const removeSlot = (day: number, slotIndex: number) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.filter((_, i) => i !== slotIndex),
            },
        }));
    };

    const updateSlot = (
        day: number,
        slotIndex: number,
        field: "heureDebut" | "heureFin" | "pause",
        value: string | boolean
    ) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.map((slot, i) =>
                    i === slotIndex ? { ...slot, [field]: value } : slot
                ),
            },
        }));
    };

    const handleSave = async () => {
        if (!employe) return;

        const disponibilitesInput: DisponibiliteCreateInput[] = [];
        for (const [day, daySchedule] of Object.entries(schedule)) {
            if (daySchedule.enabled) {
                for (const slot of daySchedule.slots) {
                    disponibilitesInput.push({
                        jourSemaine: parseInt(day),
                        heureDebut: slot.heureDebut,
                        heureFin: slot.heureFin,
                        pause: slot.pause,
                    });
                }
            }
        }

        try {
            await updateDisponibilites.mutateAsync({
                employeId: employe.id,
                disponibilites: disponibilitesInput,
            });
            onSuccess();
        } catch {
            // Error handled by mutation
        }
    };

    const isPending = updateDisponibilites.isPending;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        Horaires de {employe?.prenom} {employe?.nom}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {JOURS_SEMAINE.map(({ value: day, label }) => (
                        <div
                            key={day}
                            className="border border-black/10 rounded-lg p-4"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Label className="text-[15px] font-medium">
                                    {label}
                                </Label>
                                <Switch
                                    checked={schedule[day]?.enabled || false}
                                    onCheckedChange={() => toggleDay(day)}
                                />
                            </div>

                            {schedule[day]?.enabled && (
                                <div className="space-y-2">
                                    {schedule[day].slots.map(
                                        (slot, slotIndex) => (
                                            <div
                                                key={slotIndex}
                                                className="flex items-center gap-2"
                                            >
                                                <Input
                                                    type="time"
                                                    value={slot.heureDebut}
                                                    onChange={(e) =>
                                                        updateSlot(
                                                            day,
                                                            slotIndex,
                                                            "heureDebut",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-9 text-[13px] border-black/10 w-28"
                                                />
                                                <span className="text-black/40">
                                                    à
                                                </span>
                                                <Input
                                                    type="time"
                                                    value={slot.heureFin}
                                                    onChange={(e) =>
                                                        updateSlot(
                                                            day,
                                                            slotIndex,
                                                            "heureFin",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-9 text-[13px] border-black/10 w-28"
                                                />
                                                <div className="flex items-center gap-2 ml-2">
                                                    <Switch
                                                        checked={slot.pause}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            updateSlot(
                                                                day,
                                                                slotIndex,
                                                                "pause",
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <span className="text-[13px] text-black/50">
                                                        Pause
                                                    </span>
                                                </div>
                                                {schedule[day].slots.length >
                                                    1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-black/40 hover:text-red-600"
                                                        onClick={() =>
                                                            removeSlot(
                                                                day,
                                                                slotIndex
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        )
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-[13px] border-black/10 mt-2"
                                        onClick={() => addSlot(day)}
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Ajouter un créneau
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <DialogActionButtons
                    onCancel={() => handleOpenChange(false)}
                    onSubmit={handleSave}
                    isLoading={isPending}
                    submitLabel="Enregistrer"
                    type="button"
                />
            </DialogContent>
        </Dialog>
    );
}

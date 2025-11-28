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
import { useCreateMission } from "@/hooks/use-missions";
import { useToast } from "@/hooks/use-toast";
import {
    TYPE_FACTURATION,
    TYPE_FACTURATION_DESCRIPTIONS,
    TYPE_FACTURATION_LABELS,
    type MissionCreateInput,
    type TypeFacturation,
} from "@/lib/types/mission";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Client {
    id: string;
    nom: string;
    prenom?: string | null;
}

interface MissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clients: Client[];
    onSuccess?: () => void;
}

export function MissionDialog({
    open,
    onOpenChange,
    clients,
    onSuccess,
}: MissionDialogProps) {
    const { toast } = useToast();
    const createMission = useCreateMission();

    const [formData, setFormData] = useState<Partial<MissionCreateInput>>({
        nom: "",
        description: "",
        clientId: "",
        typeFact: "REGIE",
        tauxHoraire: 80,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nom?.trim()) {
            toast({
                title: "Erreur",
                description: "Le nom de la mission est requis",
                variant: "destructive",
            });
            return;
        }

        if (!formData.clientId) {
            toast({
                title: "Erreur",
                description: "Veuillez sélectionner un client",
                variant: "destructive",
            });
            return;
        }

        try {
            await createMission.mutateAsync(formData as MissionCreateInput);
            toast({
                title: "Mission créée",
                description: `La mission "${formData.nom}" a été créée avec succès`,
            });
            onOpenChange(false);
            setFormData({
                nom: "",
                description: "",
                clientId: "",
                typeFact: "REGIE",
                tauxHoraire: 80,
            });
            onSuccess?.();
        } catch (error) {
            toast({
                title: "Erreur",
                description:
                    error instanceof Error
                        ? error.message
                        : "Impossible de créer la mission",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-[18px] font-semibold tracking-[-0.01em]">
                            Nouvelle mission
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-black/40">
                            Créez une nouvelle mission de consulting
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-6">
                        {/* Nom */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="nom"
                                className="text-[13px] font-medium"
                            >
                                Nom de la mission *
                            </Label>
                            <Input
                                id="nom"
                                value={formData.nom}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nom: e.target.value,
                                    })
                                }
                                placeholder="Ex: Audit stratégique Q1 2024"
                                className="h-11"
                            />
                        </div>

                        {/* Client */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="client"
                                className="text-[13px] font-medium"
                            >
                                Client *
                            </Label>
                            <Select
                                value={formData.clientId}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        clientId: value,
                                    })
                                }
                            >
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Sélectionner un client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.nom}
                                            {client.prenom
                                                ? ` ${client.prenom}`
                                                : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type de facturation */}
                        <div className="grid gap-2">
                            <Label className="text-[13px] font-medium">
                                Mode de facturation
                            </Label>
                            <Select
                                value={formData.typeFact}
                                onValueChange={(value: TypeFacturation) =>
                                    setFormData({
                                        ...formData,
                                        typeFact: value,
                                    })
                                }
                            >
                                <SelectTrigger className="h-11">
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
                                                <div className="text-[12px] text-black/40">
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

                        {/* Montant forfait (si FORFAIT ou MIXTE) */}
                        {(formData.typeFact === "FORFAIT" ||
                            formData.typeFact === "MIXTE") && (
                            <div className="grid gap-2">
                                <Label className="text-[13px] font-medium">
                                    Montant forfait (€)
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.montantForfait || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            montantForfait: parseFloat(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    placeholder="5000"
                                    className="h-11"
                                />
                            </div>
                        )}

                        {/* Taux horaire (si REGIE ou MIXTE) */}
                        {(formData.typeFact === "REGIE" ||
                            formData.typeFact === "MIXTE") && (
                            <div className="grid gap-2">
                                <Label className="text-[13px] font-medium">
                                    Taux horaire (€/h)
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.tauxHoraire || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tauxHoraire: parseFloat(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    placeholder="80"
                                    className="h-11"
                                />
                            </div>
                        )}

                        {/* Budget heures */}
                        <div className="grid gap-2">
                            <Label className="text-[13px] font-medium">
                                Budget estimé (heures)
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                value={
                                    formData.budgetHeures
                                        ? formData.budgetHeures / 60
                                        : ""
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        budgetHeures:
                                            parseFloat(e.target.value) * 60,
                                    })
                                }
                                placeholder="40"
                                className="h-11"
                            />
                            <p className="text-[12px] text-black/40">
                                Optionnel. Permet de suivre l&apos;avancement.
                            </p>
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label className="text-[13px] font-medium">
                                Description
                            </Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Décrivez le périmètre de la mission..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-11 px-6 text-[14px] font-medium"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMission.isPending}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90"
                        >
                            {createMission.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Créer la mission
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

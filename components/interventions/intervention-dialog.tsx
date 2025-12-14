"use client";

import { AddressInputGroup } from "@/components/ui/address-input-group";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCapabilities } from "@/hooks/use-capabilities";
import { useInterventionDialog } from "@/hooks/use-intervention-dialog";
import {
    EQUIPEMENTS_PAR_METIER,
    INTERVENTIONS_PAR_METIER,
    PRIORITE_INTERVENTION,
    PRIORITE_LABELS,
    TYPE_EQUIPEMENT_LABELS,
    TYPE_INTERVENTION,
    TYPE_INTERVENTION_LABELS,
    type PrioriteIntervention,
    type TypeEquipement,
    type TypeIntervention,
} from "@/lib/types/intervention";
import { cn } from "@/lib/utils";
import { ChevronDown, MapPin, UserPlus, Users } from "lucide-react";

interface InterventionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const CLIENT_MODE_OPTIONS = [
    {
        value: "existing" as const,
        label: "Client existant",
        icon: <Users className="w-4 h-4" strokeWidth={2} />,
    },
    {
        value: "new" as const,
        label: "Nouveau client",
        icon: <UserPlus className="w-4 h-4" strokeWidth={2} />,
    },
];

export function InterventionDialog({
    open,
    onOpenChange,
    onSuccess,
}: InterventionDialogProps) {
    const { businessType } = useCapabilities();

    const {
        form,
        formKey,
        clients,
        selectedClient,
        isLoading,
        updateField,
        handleOpenChange,
        handleSubmit,
        setShowDetails,
    } = useInterventionDialog({
        open,
        onOpenChange,
        onSuccess,
        businessType,
    });

    const interventionTypes =
        INTERVENTIONS_PAR_METIER[
            businessType as keyof typeof INTERVENTIONS_PAR_METIER
        ] || TYPE_INTERVENTION;
    const equipmentTypes = EQUIPEMENTS_PAR_METIER[
        businessType as keyof typeof EQUIPEMENTS_PAR_METIER
    ] || [
        ...EQUIPEMENTS_PAR_METIER.PLOMBERIE,
        ...EQUIPEMENTS_PAR_METIER.CHAUFFAGE,
        ...EQUIPEMENTS_PAR_METIER.MENUISERIE,
    ];
    const uniqueEquipmentTypes = [...new Set(equipmentTypes)];

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        Nouvelle intervention
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/40">
                        Créez rapidement une nouvelle intervention
                    </DialogDescription>
                </DialogHeader>

                <form
                    key={formKey}
                    onSubmit={handleSubmit}
                    className="space-y-4 mt-2"
                >
                    {/* Client Mode Toggle */}
                    <SegmentedControl
                        value={form.clientMode}
                        onValueChange={(v) => updateField("clientMode", v)}
                        options={CLIENT_MODE_OPTIONS}
                    />

                    {/* Existing Client Select */}
                    {form.clientMode === "existing" && (
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium">
                                Client <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.clientId}
                                onValueChange={(v) =>
                                    updateField("clientId", v)
                                }
                            >
                                <SelectTrigger className="h-11 border-black/10">
                                    <SelectValue placeholder="Sélectionner un client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.prenom
                                                ? `${client.prenom} ${client.nom}`
                                                : client.nom}
                                            {client.telephone &&
                                                ` - ${client.telephone}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedClient?.ville && (
                                <div className="flex items-center gap-1.5 text-[12px] text-black/50">
                                    <MapPin
                                        className="w-3 h-3"
                                        strokeWidth={2}
                                    />
                                    <span>
                                        {selectedClient.adresse},{" "}
                                        {selectedClient.codePostal}{" "}
                                        {selectedClient.ville}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* New Client Form */}
                    {form.clientMode === "new" && (
                        <div className="space-y-3 p-3 rounded-lg bg-black/[0.02] border border-black/8">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[12px] font-medium text-black/60">
                                        Prénom
                                    </Label>
                                    <Input
                                        value={form.newClientPrenom}
                                        onChange={(e) =>
                                            updateField(
                                                "newClientPrenom",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Prénom"
                                        className="h-10 border-black/10 text-[13px]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[12px] font-medium text-black/60">
                                        Nom{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={form.newClientNom}
                                        onChange={(e) =>
                                            updateField(
                                                "newClientNom",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nom"
                                        className="h-10 border-black/10 text-[13px]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-medium text-black/60">
                                    Téléphone{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={form.newClientTelephone}
                                    onChange={(e) =>
                                        updateField(
                                            "newClientTelephone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="06 12 34 56 78"
                                    className="h-10 border-black/10 text-[13px]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Type & Priority */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium">
                                Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.typeIntervention}
                                onValueChange={(v) =>
                                    updateField(
                                        "typeIntervention",
                                        v as TypeIntervention
                                    )
                                }
                            >
                                <SelectTrigger className="h-11 border-black/10">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {interventionTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {
                                                TYPE_INTERVENTION_LABELS[
                                                    type as TypeIntervention
                                                ]
                                            }
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium">
                                Priorité
                            </Label>
                            <Select
                                value={form.priorite}
                                onValueChange={(v) =>
                                    updateField(
                                        "priorite",
                                        v as PrioriteIntervention
                                    )
                                }
                            >
                                <SelectTrigger className="h-11 border-black/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRIORITE_INTERVENTION.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {PRIORITE_LABELS[p]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) =>
                                updateField("description", e.target.value)
                            }
                            placeholder="Décrivez brièvement le problème..."
                            className="min-h-[80px] border-black/10 resize-none"
                        />
                    </div>

                    {/* Address - Always visible for new client, collapsible for existing */}
                    {form.clientMode === "new" ? (
                        <AddressInputGroup
                            label="Adresse d'intervention"
                            required
                            value={{
                                adresse: form.adresse,
                                codePostal: form.codePostal,
                                ville: form.ville,
                            }}
                            onChange={({ adresse, codePostal, ville }) => {
                                updateField("adresse", adresse);
                                updateField("codePostal", codePostal);
                                updateField("ville", ville);
                            }}
                        />
                    ) : (
                        <Collapsible
                            open={form.showDetails}
                            onOpenChange={setShowDetails}
                        >
                            <CollapsibleTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-[13px] font-medium text-black/60 hover:text-black transition-colors"
                                >
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 transition-transform",
                                            form.showDetails && "rotate-180"
                                        )}
                                        strokeWidth={2}
                                    />
                                    {form.showDetails
                                        ? "Masquer les détails"
                                        : "Plus de détails"}
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4">
                                {/* Address override */}
                                <AddressInputGroup
                                    label="Adresse d'intervention"
                                    compact
                                    bordered
                                    value={{
                                        adresse: form.adresse,
                                        codePostal: form.codePostal,
                                        ville: form.ville,
                                    }}
                                    onChange={({
                                        adresse,
                                        codePostal,
                                        ville,
                                    }) => {
                                        updateField("adresse", adresse);
                                        updateField("codePostal", codePostal);
                                        updateField("ville", ville);
                                    }}
                                />

                                {/* Equipment */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-medium">
                                            Équipement
                                        </Label>
                                        <Select
                                            value={form.equipement}
                                            onValueChange={(v) =>
                                                updateField("equipement", v)
                                            }
                                        >
                                            <SelectTrigger className="h-10 border-black/10 text-[13px]">
                                                <SelectValue placeholder="Optionnel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {uniqueEquipmentTypes.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {
                                                                TYPE_EQUIPEMENT_LABELS[
                                                                    type as TypeEquipement
                                                                ]
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-medium">
                                            Marque
                                        </Label>
                                        <Input
                                            value={form.marqueEquipement}
                                            onChange={(e) =>
                                                updateField(
                                                    "marqueEquipement",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Optionnel"
                                            className="h-10 border-black/10 text-[13px]"
                                        />
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-medium">
                                        Date prévisionnelle
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        value={form.datePrevisionnelle}
                                        onChange={(e) =>
                                            updateField(
                                                "datePrevisionnelle",
                                                e.target.value
                                            )
                                        }
                                        className="h-10 border-black/10 text-[13px]"
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {/* Actions */}
                    <DialogActionButtons
                        onCancel={() => handleOpenChange(false)}
                        submitLabel="Créer"
                        isLoading={isLoading}
                        className="pt-2"
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}

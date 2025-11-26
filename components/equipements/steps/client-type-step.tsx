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
import type { Client } from "@/hooks/use-clients";
import type { EquipementCreateInput } from "@/lib/types/equipement";
import {
    EQUIPEMENTS_PAR_METIER,
    TYPE_EQUIPEMENT_LABELS,
    type TypeEquipement,
} from "@/lib/types/intervention";
import { useMemo, useState } from "react";

interface ClientTypeStepProps {
    formData: Partial<EquipementCreateInput>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<EquipementCreateInput>>>;
    clients: Client[];
    preselectedClientId?: string;
}

export function ClientTypeStep({
    formData,
    setFormData,
    clients,
    preselectedClientId,
}: ClientTypeStepProps) {
    const [searchClient, setSearchClient] = useState("");

    const filteredClients = useMemo(() => {
        if (!searchClient) return clients.slice(0, 50);
        const s = searchClient.toLowerCase();
        return clients
            .filter(
                (c) =>
                    c.nom?.toLowerCase().includes(s) ||
                    c.prenom?.toLowerCase().includes(s) ||
                    c.telephone?.includes(s)
            )
            .slice(0, 50);
    }, [clients, searchClient]);

    const equipementTypes = EQUIPEMENTS_PAR_METIER.CHAUFFAGE;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-[16px] font-medium">Client et type</h3>
                <p className="text-[13px] text-black/50">
                    Sélectionnez le client et le type d&apos;équipement
                </p>
            </div>

            {/* Client Selection */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium">
                    Client <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={formData.clientId}
                    onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, clientId: value }))
                    }
                    disabled={!!preselectedClientId}
                >
                    <SelectTrigger className="h-11 border-black/10">
                        <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                        <div className="p-2">
                            <Input
                                placeholder="Rechercher un client..."
                                value={searchClient}
                                onChange={(e) => setSearchClient(e.target.value)}
                                className="h-9"
                            />
                        </div>
                        {filteredClients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.prenom} {client.nom}
                                {client.ville && ` - ${client.ville}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Selected client info */}
            {formData.clientId && (
                <div className="rounded-lg border border-black/10 p-4 bg-black/[0.02]">
                    {(() => {
                        const client = clients.find((c) => c.id === formData.clientId);
                        if (!client) return null;
                        return (
                            <div className="space-y-1">
                                <p className="text-[14px] font-medium">
                                    {client.prenom} {client.nom}
                                </p>
                                {client.adresse && (
                                    <p className="text-[13px] text-black/60">
                                        {client.adresse}
                                        {client.codePostal && `, ${client.codePostal}`}
                                        {client.ville && ` ${client.ville}`}
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Equipment Type */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium">
                    Type d&apos;équipement <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={formData.type}
                    onValueChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            type: value as TypeEquipement,
                        }))
                    }
                >
                    <SelectTrigger className="h-11 border-black/10">
                        <SelectValue placeholder="Type d'équipement" />
                    </SelectTrigger>
                    <SelectContent>
                        {equipementTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {TYPE_EQUIPEMENT_LABELS[type as TypeEquipement]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Brand & Model */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">
                        Marque <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        value={formData.marque || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, marque: e.target.value }))
                        }
                        placeholder="Ex: De Dietrich, Viessmann..."
                        className="h-11 border-black/10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-medium">Modèle</Label>
                    <Input
                        value={formData.modele || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, modele: e.target.value }))
                        }
                        placeholder="Ex: Vitodens 200-W"
                        className="h-11 border-black/10"
                    />
                </div>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
                <Label className="text-[13px] font-medium">Numéro de série</Label>
                <Input
                    value={formData.numeroSerie || ""}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, numeroSerie: e.target.value }))
                    }
                    placeholder="Numéro de série de l'équipement"
                    className="h-11 border-black/10"
                />
            </div>
        </div>
    );
}

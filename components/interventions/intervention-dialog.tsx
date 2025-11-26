"use client";

import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { useCapabilities } from "@/hooks/use-capabilities";
import { useCreateIntervention } from "@/hooks/use-interventions";
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
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, MapPin, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface InterventionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

interface Client {
    id: string;
    nom: string;
    prenom?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
}

type ClientMode = "existing" | "new";

export function InterventionDialog({
    open,
    onOpenChange,
    onSuccess,
}: InterventionDialogProps) {
    // Get business type for filtering
    const { businessType } = useCapabilities();

    // Client mode
    const [clientMode, setClientMode] = useState<ClientMode>("existing");

    // Existing client
    const [clientId, setClientId] = useState("");

    // New client info
    const [newClientNom, setNewClientNom] = useState("");
    const [newClientPrenom, setNewClientPrenom] = useState("");
    const [newClientTelephone, setNewClientTelephone] = useState("");

    // Form state
    const [typeIntervention, setTypeIntervention] = useState<
        TypeIntervention | ""
    >("");
    const [priorite, setPriorite] = useState<PrioriteIntervention>("NORMALE");
    const [description, setDescription] = useState("");

    // Address
    const [adresse, setAdresse] = useState("");
    const [codePostal, setCodePostal] = useState("");
    const [ville, setVille] = useState("");

    // Optional details
    const [showDetails, setShowDetails] = useState(false);
    const [equipement, setEquipement] = useState<TypeEquipement | "">("");
    const [marqueEquipement, setMarqueEquipement] = useState("");
    const [datePrevisionnelle, setDatePrevisionnelle] = useState("");

    // Fetch clients
    const { data: clientsData } = useQuery({
        queryKey: ["clients", "list", { limit: 100 }],
        queryFn: async () => {
            const response = await fetch("/api/clients?limit=100");
            if (!response.ok) throw new Error("Failed to fetch clients");
            return response.json();
        },
        enabled: open,
    });

    const clients: Client[] = clientsData?.items || clientsData?.clients || [];
    const selectedClient = clients.find((c) => c.id === clientId);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setClientMode("existing");
            setClientId("");
            setNewClientNom("");
            setNewClientPrenom("");
            setNewClientTelephone("");
            setTypeIntervention("");
            setPriorite("NORMALE");
            setDescription("");
            setAdresse("");
            setCodePostal("");
            setVille("");
            setShowDetails(false);
            setEquipement("");
            setMarqueEquipement("");
            setDatePrevisionnelle("");
        }
    }, [open]);

    // Auto-fill address when existing client changes
    useEffect(() => {
        if (clientMode === "existing" && selectedClient) {
            setAdresse(selectedClient.adresse || "");
            setCodePostal(selectedClient.codePostal || "");
            setVille(selectedClient.ville || "");
        }
    }, [selectedClient, clientMode]);

    // Clear address when switching to new client
    useEffect(() => {
        if (clientMode === "new") {
            setAdresse("");
            setCodePostal("");
            setVille("");
        }
    }, [clientMode]);

    const createIntervention = useCreateIntervention();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate client
        if (clientMode === "existing" && !clientId) {
            toast.error("Veuillez sélectionner un client");
            return;
        }

        if (clientMode === "new") {
            if (!newClientNom.trim()) {
                toast.error("Le nom du client est requis");
                return;
            }
            if (!newClientTelephone.trim()) {
                toast.error("Le téléphone du client est requis");
                return;
            }
        }

        if (!typeIntervention || !description) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }

        if (description.length < 10) {
            toast.error("La description doit faire au moins 10 caractères");
            return;
        }

        if (!adresse || !codePostal || !ville) {
            toast.error("L'adresse est incomplète");
            return;
        }

        if (!/^\d{5}$/.test(codePostal)) {
            toast.error("Code postal invalide");
            return;
        }

        const payload = {
            // Client info
            ...(clientMode === "existing"
                ? { clientId }
                : {
                      newClient: {
                          nom: newClientNom.trim(),
                          prenom: newClientPrenom.trim() || undefined,
                          telephone: newClientTelephone.trim(),
                      },
                  }),
            typeIntervention,
            priorite,
            description,
            adresse,
            codePostal,
            ville,
            equipement: equipement || undefined,
            marqueEquipement: marqueEquipement || undefined,
            datePrevisionnelle: datePrevisionnelle || undefined,
        };

        createIntervention.mutate(payload, {
            onSuccess: () => {
                toast.success(
                    clientMode === "new"
                        ? "Intervention créée et client ajouté"
                        : "Intervention créée"
                );
                onSuccess();
            },
            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la création"
                );
            },
        });
    };

    const isLoading = createIntervention.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        Nouvelle intervention
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/40">
                        Créez rapidement une nouvelle intervention
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Client Mode Toggle */}
                    <div className="flex gap-2 p-1 bg-black/[0.03] rounded-lg">
                        <button
                            type="button"
                            onClick={() => setClientMode("existing")}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[13px] font-medium transition-all",
                                clientMode === "existing"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-black/50 hover:text-black/70"
                            )}
                        >
                            <Users className="w-4 h-4" strokeWidth={2} />
                            Client existant
                        </button>
                        <button
                            type="button"
                            onClick={() => setClientMode("new")}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[13px] font-medium transition-all",
                                clientMode === "new"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-black/50 hover:text-black/70"
                            )}
                        >
                            <UserPlus className="w-4 h-4" strokeWidth={2} />
                            Nouveau client
                        </button>
                    </div>

                    {/* Existing Client Select */}
                    {clientMode === "existing" && (
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium">
                                Client <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={clientId}
                                onValueChange={setClientId}
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
                    {clientMode === "new" && (
                        <div className="space-y-3 p-3 rounded-lg bg-black/[0.02] border border-black/8">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[12px] font-medium text-black/60">
                                        Prénom
                                    </Label>
                                    <Input
                                        value={newClientPrenom}
                                        onChange={(e) =>
                                            setNewClientPrenom(e.target.value)
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
                                        value={newClientNom}
                                        onChange={(e) =>
                                            setNewClientNom(e.target.value)
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
                                    value={newClientTelephone}
                                    onChange={(e) =>
                                        setNewClientTelephone(e.target.value)
                                    }
                                    placeholder="06 12 34 56 78"
                                    className="h-10 border-black/10 text-[13px]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Type & Priority - side by side */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium">
                                Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={typeIntervention}
                                onValueChange={(v) =>
                                    setTypeIntervention(v as TypeIntervention)
                                }
                            >
                                <SelectTrigger className="h-11 border-black/10">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(
                                        INTERVENTIONS_PAR_METIER[
                                            businessType as keyof typeof INTERVENTIONS_PAR_METIER
                                        ] || TYPE_INTERVENTION
                                    ).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {TYPE_INTERVENTION_LABELS[type as TypeIntervention]}
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
                                value={priorite}
                                onValueChange={(v) =>
                                    setPriorite(v as PrioriteIntervention)
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez brièvement le problème..."
                            className="min-h-[80px] border-black/10 resize-none"
                        />
                    </div>

                    {/* Address - Always visible for new client, collapsible for existing */}
                    {clientMode === "new" ? (
                        <div className="space-y-3">
                            <Label className="text-[13px] font-medium">
                                Adresse d'intervention{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                                placeholder="Adresse"
                                className="h-11 border-black/10"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    value={codePostal}
                                    onChange={(e) =>
                                        setCodePostal(e.target.value)
                                    }
                                    placeholder="Code postal"
                                    maxLength={5}
                                    className="h-11 border-black/10"
                                />
                                <Input
                                    value={ville}
                                    onChange={(e) => setVille(e.target.value)}
                                    placeholder="Ville"
                                    className="h-11 border-black/10"
                                />
                            </div>
                        </div>
                    ) : (
                        /* Collapsible Details for existing client */
                        <Collapsible
                            open={showDetails}
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
                                            showDetails && "rotate-180"
                                        )}
                                        strokeWidth={2}
                                    />
                                    {showDetails
                                        ? "Masquer les détails"
                                        : "Plus de détails"}
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4">
                                {/* Address override */}
                                <div className="space-y-3 p-3 rounded-lg bg-black/[0.02] border border-black/8">
                                    <Label className="text-[12px] font-medium text-black/60">
                                        Adresse d'intervention
                                    </Label>
                                    <Input
                                        value={adresse}
                                        onChange={(e) =>
                                            setAdresse(e.target.value)
                                        }
                                        placeholder="Adresse"
                                        className="h-10 border-black/10 text-[13px]"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            value={codePostal}
                                            onChange={(e) =>
                                                setCodePostal(e.target.value)
                                            }
                                            placeholder="Code postal"
                                            maxLength={5}
                                            className="h-10 border-black/10 text-[13px]"
                                        />
                                        <Input
                                            value={ville}
                                            onChange={(e) =>
                                                setVille(e.target.value)
                                            }
                                            placeholder="Ville"
                                            className="h-10 border-black/10 text-[13px]"
                                        />
                                    </div>
                                </div>

                                {/* Equipment */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-medium">
                                            Équipement
                                        </Label>
                                        <Select
                                            value={equipement}
                                            onValueChange={(v) =>
                                                setEquipement(
                                                    v as TypeEquipement
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-10 border-black/10 text-[13px]">
                                                <SelectValue placeholder="Optionnel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    EQUIPEMENTS_PAR_METIER[
                                                        businessType as keyof typeof EQUIPEMENTS_PAR_METIER
                                                    ] || [
                                                        ...EQUIPEMENTS_PAR_METIER.PLOMBERIE,
                                                        ...EQUIPEMENTS_PAR_METIER.CHAUFFAGE,
                                                        ...EQUIPEMENTS_PAR_METIER.MENUISERIE,
                                                    ]
                                                )
                                                    .filter(
                                                        (v, i, a) =>
                                                            a.indexOf(v) === i
                                                    )
                                                    .map((type) => (
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
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-medium">
                                            Marque
                                        </Label>
                                        <Input
                                            value={marqueEquipement}
                                            onChange={(e) =>
                                                setMarqueEquipement(
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
                                        value={datePrevisionnelle}
                                        onChange={(e) =>
                                            setDatePrevisionnelle(
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
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-11 px-6 border-black/10 hover:bg-black/5"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-11 px-6 bg-black hover:bg-black/90"
                        >
                            {isLoading && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Créer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

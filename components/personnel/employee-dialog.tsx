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
import type { Employee } from "@/hooks/use-employees";
import { useState, useEffect } from "react";
import type { StatutEmploye, TypeContrat } from "@/lib/types/personnel.types";
import { STATUT_LABELS, TYPE_CONTRAT_LABELS } from "@/lib/types/personnel.types";

export interface EmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee?: Employee | null;
    onSubmit: (data: EmployeeFormData) => void;
    isLoading?: boolean;
}

export interface EmployeeFormData {
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    dateNaissance?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    pays?: string;
    poste: string;
    departement?: string;
    statut: StatutEmploye;
    typeContrat: TypeContrat;
    dateEmbauche: string;
    dateFin?: string;
    salaireBrut: number;
    devise?: string;
    heuresHebdo?: number;
    joursTravail?: string;
    notes?: string;
    competences?: string;
    congesRestants?: number;
    congesPris?: number;
}

const defaultFormData: EmployeeFormData = {
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
    poste: "",
    departement: "",
    statut: "ACTIF",
    typeContrat: "CDI",
    dateEmbauche: new Date().toISOString().split("T")[0],
    dateFin: "",
    salaireBrut: 0,
    devise: "EUR",
    heuresHebdo: 35,
    joursTravail: "",
    notes: "",
    competences: "",
    congesRestants: 25,
    congesPris: 0,
};

export function EmployeeDialog({
    open,
    onOpenChange,
    employee,
    onSubmit,
    isLoading,
}: EmployeeDialogProps) {
    const [formData, setFormData] = useState<EmployeeFormData>(defaultFormData);

    useEffect(() => {
        if (employee) {
            setFormData({
                prenom: employee.prenom,
                nom: employee.nom,
                email: employee.email,
                telephone: employee.telephone || "",
                dateNaissance: employee.dateNaissance
                    ? new Date(employee.dateNaissance).toISOString().split("T")[0]
                    : "",
                adresse: employee.adresse || "",
                ville: employee.ville || "",
                codePostal: employee.codePostal || "",
                pays: employee.pays || "France",
                poste: employee.poste,
                departement: employee.departement || "",
                statut: employee.statut,
                typeContrat: employee.typeContrat,
                dateEmbauche: new Date(employee.dateEmbauche).toISOString().split("T")[0],
                dateFin: employee.dateFin
                    ? new Date(employee.dateFin).toISOString().split("T")[0]
                    : "",
                salaireBrut: Number(employee.salaireBrut),
                devise: employee.devise || "EUR",
                heuresHebdo: employee.heuresHebdo || 35,
                joursTravail: employee.joursTravail || "",
                notes: employee.notes || "",
                competences: employee.competences || "",
                congesRestants: employee.congesRestants || 25,
                congesPris: employee.congesPris || 0,
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [employee]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isEditMode = !!employee;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                        {isEditMode ? "Modifier l'employé" : "Nouvel employé"}
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        {isEditMode
                            ? "Modifiez les informations de l'employé"
                            : "Ajoutez un nouvel employé à votre équipe"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <h3 className="text-[15px] font-semibold text-black">
                                Informations personnelles
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="prenom" className="text-[13px] font-medium text-black/70">
                                    Prénom *
                                </Label>
                                <Input
                                    id="prenom"
                                    value={formData.prenom}
                                    onChange={(e) =>
                                        setFormData({ ...formData, prenom: e.target.value })
                                    }
                                    required
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nom" className="text-[13px] font-medium text-black/70">
                                    Nom *
                                </Label>
                                <Input
                                    id="nom"
                                    value={formData.nom}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nom: e.target.value })
                                    }
                                    required
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[13px] font-medium text-black/70">
                                    Email *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telephone" className="text-[13px] font-medium text-black/70">
                                    Téléphone
                                </Label>
                                <Input
                                    id="telephone"
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, telephone: e.target.value })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateNaissance" className="text-[13px] font-medium text-black/70">
                                Date de naissance
                            </Label>
                            <Input
                                id="dateNaissance"
                                type="date"
                                value={formData.dateNaissance}
                                onChange={(e) =>
                                    setFormData({ ...formData, dateNaissance: e.target.value })
                                }
                                className="border-black/10 focus:border-black/30"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adresse" className="text-[13px] font-medium text-black/70">
                                Adresse
                            </Label>
                            <Input
                                id="adresse"
                                value={formData.adresse}
                                onChange={(e) =>
                                    setFormData({ ...formData, adresse: e.target.value })
                                }
                                className="border-black/10 focus:border-black/30"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="codePostal" className="text-[13px] font-medium text-black/70">
                                    Code postal
                                </Label>
                                <Input
                                    id="codePostal"
                                    value={formData.codePostal}
                                    onChange={(e) =>
                                        setFormData({ ...formData, codePostal: e.target.value })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ville" className="text-[13px] font-medium text-black/70">
                                    Ville
                                </Label>
                                <Input
                                    id="ville"
                                    value={formData.ville}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ville: e.target.value })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pays" className="text-[13px] font-medium text-black/70">
                                    Pays
                                </Label>
                                <Input
                                    id="pays"
                                    value={formData.pays}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pays: e.target.value })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informations professionnelles */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <h3 className="text-[15px] font-semibold text-black">
                                Informations professionnelles
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="poste" className="text-[13px] font-medium text-black/70">
                                    Poste *
                                </Label>
                                <Input
                                    id="poste"
                                    value={formData.poste}
                                    onChange={(e) =>
                                        setFormData({ ...formData, poste: e.target.value })
                                    }
                                    required
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="departement" className="text-[13px] font-medium text-black/70">
                                    Département
                                </Label>
                                <Input
                                    id="departement"
                                    value={formData.departement}
                                    onChange={(e) =>
                                        setFormData({ ...formData, departement: e.target.value })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="statut" className="text-[13px] font-medium text-black/70">
                                    Statut *
                                </Label>
                                <Select
                                    value={formData.statut}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, statut: value as StatutEmploye })
                                    }
                                >
                                    <SelectTrigger className="border-black/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(STATUT_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="typeContrat" className="text-[13px] font-medium text-black/70">
                                    Type de contrat *
                                </Label>
                                <Select
                                    value={formData.typeContrat}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, typeContrat: value as TypeContrat })
                                    }
                                >
                                    <SelectTrigger className="border-black/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(TYPE_CONTRAT_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dateEmbauche" className="text-[13px] font-medium text-black/70">
                                    Date d&apos;embauche *
                                </Label>
                                <Input
                                    id="dateEmbauche"
                                    type="date"
                                    value={formData.dateEmbauche}
                                    onChange={(e) =>
                                        setFormData({ ...formData, dateEmbauche: e.target.value })
                                    }
                                    required
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateFin" className="text-[13px] font-medium text-black/70">
                                    Date de fin (optionnel)
                                </Label>
                                <Input
                                    id="dateFin"
                                    type="date"
                                    value={formData.dateFin}
                                    onChange={(e) =>
                                        setFormData({ ...formData, dateFin: e.target.value })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="salaireBrut" className="text-[13px] font-medium text-black/70">
                                    Salaire brut *
                                </Label>
                                <Input
                                    id="salaireBrut"
                                    type="number"
                                    step="0.01"
                                    value={formData.salaireBrut}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            salaireBrut: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    required
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="devise" className="text-[13px] font-medium text-black/70">
                                    Devise
                                </Label>
                                <Input
                                    id="devise"
                                    value={formData.devise}
                                    onChange={(e) =>
                                        setFormData({ ...formData, devise: e.target.value })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="heuresHebdo" className="text-[13px] font-medium text-black/70">
                                    Heures hebdomadaires
                                </Label>
                                <Input
                                    id="heuresHebdo"
                                    type="number"
                                    value={formData.heuresHebdo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            heuresHebdo: parseInt(e.target.value) || 35,
                                        })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="joursTravail" className="text-[13px] font-medium text-black/70">
                                    Jours de travail
                                </Label>
                                <Input
                                    id="joursTravail"
                                    value={formData.joursTravail}
                                    onChange={(e) =>
                                        setFormData({ ...formData, joursTravail: e.target.value })
                                    }
                                    placeholder="Ex: Lundi - Vendredi"
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Congés */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <h3 className="text-[15px] font-semibold text-black">
                                Gestion des congés
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="congesRestants" className="text-[13px] font-medium text-black/70">
                                    Congés restants (jours)
                                </Label>
                                <Input
                                    id="congesRestants"
                                    type="number"
                                    value={formData.congesRestants}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            congesRestants: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="congesPris" className="text-[13px] font-medium text-black/70">
                                    Congés pris (jours)
                                </Label>
                                <Input
                                    id="congesPris"
                                    type="number"
                                    value={formData.congesPris}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            congesPris: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="border-black/10 focus:border-black/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes et compétences */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <h3 className="text-[15px] font-semibold text-black">
                                Informations complémentaires
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="competences" className="text-[13px] font-medium text-black/70">
                                Compétences
                            </Label>
                            <Textarea
                                id="competences"
                                value={formData.competences}
                                onChange={(e) =>
                                    setFormData({ ...formData, competences: e.target.value })
                                }
                                rows={3}
                                className="border-black/10 focus:border-black/30 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-[13px] font-medium text-black/70">
                                Notes
                            </Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                }
                                rows={3}
                                className="border-black/10 focus:border-black/30 resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-black/10 hover:bg-black/5"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-black hover:bg-black/90 text-white"
                        >
                            {isLoading
                                ? "Enregistrement..."
                                : isEditMode
                                ? "Enregistrer"
                                : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

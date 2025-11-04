"use client";

import { Input } from "@/components/ui/input";
import { CompanySettings } from "@/lib/types/settings";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { Building2 } from "lucide-react";

interface GeneralTabProps {
    settings: CompanySettings;
    onChange: (field: string, value: string) => void;
}

export function GeneralTab({ settings, onChange }: GeneralTabProps) {
    return (
        <div className="space-y-8">
            <SettingsSection
                icon={Building2}
                title="Informations générales"
                description="Gérez les informations de votre entreprise"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label
                            htmlFor="nom"
                            className="text-[14px] font-medium"
                        >
                            Nom de l&apos;entreprise *
                        </Label>
                        <Input
                            id="nom"
                            value={settings.nom_entreprise || ""}
                            onChange={(e) =>
                                onChange("nom_entreprise", e.target.value)
                            }
                            placeholder="Ex: Mon Entreprise SARL"
                            className="h-11 border-black/10"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="siret"
                            className="text-[14px] font-medium"
                        >
                            SIRET
                        </Label>
                        <Input
                            id="siret"
                            value={settings.siret || ""}
                            onChange={(e) => onChange("siret", e.target.value)}
                            placeholder="123 456 789 00012"
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="tva"
                            className="text-[14px] font-medium"
                        >
                            TVA Intracommunautaire
                        </Label>
                        <Input
                            id="tva"
                            value={settings.tva_intra || ""}
                            onChange={(e) =>
                                onChange("tva_intra", e.target.value)
                            }
                            placeholder="FR12345678901"
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label
                            htmlFor="adresse"
                            className="text-[14px] font-medium"
                        >
                            Adresse
                        </Label>
                        <Input
                            id="adresse"
                            value={settings.adresse || ""}
                            onChange={(e) =>
                                onChange("adresse", e.target.value)
                            }
                            placeholder="123 Rue de la République"
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cp" className="text-[14px] font-medium">
                            Code postal
                        </Label>
                        <Input
                            id="cp"
                            value={settings.code_postal || ""}
                            onChange={(e) =>
                                onChange("code_postal", e.target.value)
                            }
                            placeholder="75001"
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="ville"
                            className="text-[14px] font-medium"
                        >
                            Ville
                        </Label>
                        <Input
                            id="ville"
                            value={settings.ville || ""}
                            onChange={(e) => onChange("ville", e.target.value)}
                            placeholder="Paris"
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="telephone"
                            className="text-[14px] font-medium"
                        >
                            Téléphone
                        </Label>
                        <Input
                            id="telephone"
                            value={settings.telephone || ""}
                            onChange={(e) =>
                                onChange("telephone", e.target.value)
                            }
                            placeholder="01 23 45 67 89"
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-[14px] font-medium"
                        >
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={settings.email || ""}
                            onChange={(e) => onChange("email", e.target.value)}
                            placeholder="contact@monentreprise.fr"
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label
                            htmlFor="web"
                            className="text-[14px] font-medium"
                        >
                            Site web
                        </Label>
                        <Input
                            id="web"
                            value={settings.site_web || ""}
                            onChange={(e) =>
                                onChange("site_web", e.target.value)
                            }
                            placeholder="https://monentreprise.fr"
                            className="h-11 border-black/10"
                        />
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}

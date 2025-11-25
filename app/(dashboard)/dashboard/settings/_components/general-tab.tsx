"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { CompanySettings } from "@/lib/types/settings";
import { Building2, Hash } from "lucide-react";

interface GeneralTabProps {
    settings: CompanySettings;
    onChange: (field: string, value: string) => void;
}

interface FormFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    hint?: string;
    className?: string;
}

function FormField({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required,
    hint,
    className = "",
}: FormFieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className="text-[14px] font-medium">
                {label} {required && "*"}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-11 border-black/10"
                required={required}
            />
            {hint && <p className="text-[12px] text-black/60">{hint}</p>}
        </div>
    );
}

export function GeneralTab({ settings, onChange }: GeneralTabProps) {
    return (
        <div className="space-y-8">
            <SettingsSection
                icon={Building2}
                title="Informations entreprise"
                description="Informations légales et coordonnées"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                    <FormField
                        id="nom"
                        label="Nom de l'entreprise"
                        value={settings.nom_entreprise || ""}
                        onChange={(value) => onChange("nom_entreprise", value)}
                        placeholder="Mon Entreprise SARL"
                        required
                        className="md:col-span-2"
                    />

                    <FormField
                        id="siret"
                        label="SIRET"
                        value={settings.siret || ""}
                        onChange={(value) => onChange("siret", value)}
                        placeholder="123 456 789 00012"
                    />

                    <FormField
                        id="tva"
                        label="TVA Intracommunautaire"
                        value={settings.tva_intra || ""}
                        onChange={(value) => onChange("tva_intra", value)}
                        placeholder="FR12345678901"
                    />

                    <FormField
                        id="adresse"
                        label="Adresse"
                        value={settings.adresse || ""}
                        onChange={(value) => onChange("adresse", value)}
                        placeholder="123 Rue de la République"
                        className="md:col-span-2"
                    />

                    <FormField
                        id="cp"
                        label="Code postal"
                        value={settings.code_postal || ""}
                        onChange={(value) => onChange("code_postal", value)}
                        placeholder="75001"
                    />

                    <FormField
                        id="ville"
                        label="Ville"
                        value={settings.ville || ""}
                        onChange={(value) => onChange("ville", value)}
                        placeholder="Paris"
                    />

                    <FormField
                        id="telephone"
                        label="Téléphone"
                        value={settings.telephone || ""}
                        onChange={(value) => onChange("telephone", value)}
                        placeholder="01 23 45 67 89"
                    />

                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        value={settings.email || ""}
                        onChange={(value) => onChange("email", value)}
                        placeholder="contact@monentreprise.fr"
                    />

                    <FormField
                        id="web"
                        label="Site web"
                        value={settings.site_web || ""}
                        onChange={(value) => onChange("site_web", value)}
                        placeholder="https://monentreprise.fr"
                        className="md:col-span-2"
                    />
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Hash}
                title="Préfixes articles"
                description="Préfixes pour la génération automatique des références"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                    <FormField
                        id="prefixe_produit"
                        label="Préfixe produits"
                        value={settings.prefixe_produit || "PRD"}
                        onChange={(value) => onChange("prefixe_produit", value)}
                        placeholder="PRD"
                        hint="Ex: PRD-001, PRD-002..."
                    />

                    <FormField
                        id="prefixe_service"
                        label="Préfixe services"
                        value={settings.prefixe_service || "SRV"}
                        onChange={(value) => onChange("prefixe_service", value)}
                        placeholder="SRV"
                        hint="Ex: SRV-001, SRV-002..."
                    />
                </div>
            </SettingsSection>
        </div>
    );
}

"use client";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "@/components/ui/settings-section";
import { PreferenceSettings } from "@/lib/types/settings";
import { Calendar, DollarSign, Globe } from "lucide-react";

interface PreferencesTabProps {
    preferences: PreferenceSettings;
    onChange: (field: string, value: string) => void;
}

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    hint?: string;
}

function SelectField({ id, label, value, onChange, options, hint }: SelectFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-[14px] font-medium">
                {label}
            </Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id={id} className="h-11 border-black/10">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hint && <p className="text-[12px] text-black/50">{hint}</p>}
        </div>
    );
}

export function PreferencesTab({ preferences, onChange }: PreferencesTabProps) {
    return (
        <div className="space-y-6">
            <SettingsSection
                icon={Globe}
                title="Localisation"
                description="Paramètres régionaux de l'application"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <SelectField
                        id="langue"
                        label="Langue"
                        value={preferences.langue || "fr"}
                        onChange={(value) => onChange("langue", value)}
                        options={[
                            { value: "fr", label: "Français" },
                            { value: "en", label: "English" },
                            { value: "es", label: "Español" },
                            { value: "de", label: "Deutsch" },
                        ]}
                        hint="Langue d'affichage de l'interface"
                    />

                    <SelectField
                        id="timezone"
                        label="Fuseau horaire"
                        value={preferences.timezone || "Europe/Paris"}
                        onChange={(value) => onChange("timezone", value)}
                        options={[
                            { value: "Europe/Paris", label: "Paris (GMT+1)" },
                            { value: "Europe/London", label: "Londres (GMT+0)" },
                            { value: "America/New_York", label: "New York (GMT-5)" },
                            { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)" },
                            { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
                        ]}
                        hint="Fuseau horaire pour les dates"
                    />
                </div>
            </SettingsSection>

            <SettingsSection
                icon={DollarSign}
                title="Devise et formats"
                description="Formats d'affichage des montants"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <SelectField
                        id="devise"
                        label="Devise"
                        value={preferences.devise || "EUR"}
                        onChange={(value) => onChange("devise", value)}
                        options={[
                            { value: "EUR", label: "Euro (EUR)" },
                            { value: "USD", label: "Dollar US (USD)" },
                            { value: "GBP", label: "Livre Sterling (GBP)" },
                            { value: "CHF", label: "Franc Suisse (CHF)" },
                            { value: "CAD", label: "Dollar Canadien (CAD)" },
                        ]}
                        hint="Devise utilisée dans les documents"
                    />

                    <SelectField
                        id="format_nombre"
                        label="Format nombres"
                        value={preferences.format_nombre || "fr"}
                        onChange={(value) => onChange("format_nombre", value)}
                        options={[
                            { value: "fr", label: "1 234,56 (Français)" },
                            { value: "en", label: "1,234.56 (Anglais)" },
                            { value: "de", label: "1.234,56 (Allemand)" },
                        ]}
                        hint="Format d'affichage des montants"
                    />
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Calendar}
                title="Formats de date"
                description="Format d'affichage des dates"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <SelectField
                        id="format_date"
                        label="Format de date"
                        value={preferences.format_date || "DD/MM/YYYY"}
                        onChange={(value) => onChange("format_date", value)}
                        options={[
                            { value: "DD/MM/YYYY", label: "31/12/2025 (Français)" },
                            { value: "MM/DD/YYYY", label: "12/31/2025 (US)" },
                            { value: "YYYY-MM-DD", label: "2025-12-31 (ISO)" },
                            { value: "DD.MM.YYYY", label: "31.12.2025 (Allemand)" },
                        ]}
                        hint="Format d'affichage des dates"
                    />

                    <SelectField
                        id="premier_jour"
                        label="Premier jour semaine"
                        value={preferences.premier_jour || "lundi"}
                        onChange={(value) => onChange("premier_jour", value)}
                        options={[
                            { value: "lundi", label: "Lundi" },
                            { value: "dimanche", label: "Dimanche" },
                            { value: "samedi", label: "Samedi" },
                        ]}
                        hint="Premier jour dans les calendriers"
                    />
                </div>
            </SettingsSection>
        </div>
    );
}

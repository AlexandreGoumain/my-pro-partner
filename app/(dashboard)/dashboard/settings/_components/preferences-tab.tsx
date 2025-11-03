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

export function PreferencesTab({ preferences, onChange }: PreferencesTabProps) {
    return (
        <div className="space-y-6">
            <SettingsSection
                icon={Globe}
                title="Localisation"
                description="Configurez les paramètres régionaux de votre application"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <div className="space-y-2">
                        <Label
                            htmlFor="langue"
                            className="text-[14px] font-medium"
                        >
                            Langue
                        </Label>
                        <Select
                            value={preferences.langue || "fr"}
                            onValueChange={(value) => onChange("langue", value)}
                        >
                            <SelectTrigger
                                id="langue"
                                className="h-11 border-black/10"
                            >
                                <SelectValue placeholder="Sélectionner une langue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                                <SelectItem value="en">🇬🇧 English</SelectItem>
                                <SelectItem value="es">🇪🇸 Español</SelectItem>
                                <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[12px] text-black/40">
                            Langue d&apos;affichage de l&apos;interface
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="timezone"
                            className="text-[14px] font-medium"
                        >
                            Fuseau horaire
                        </Label>
                        <Select
                            value={preferences.timezone || "Europe/Paris"}
                            onValueChange={(value) =>
                                onChange("timezone", value)
                            }
                        >
                            <SelectTrigger
                                id="timezone"
                                className="h-11 border-black/10"
                            >
                                <SelectValue placeholder="Sélectionner un fuseau horaire" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Europe/Paris">
                                    Europe/Paris (GMT+1)
                                </SelectItem>
                                <SelectItem value="Europe/London">
                                    Europe/London (GMT+0)
                                </SelectItem>
                                <SelectItem value="America/New_York">
                                    America/New York (GMT-5)
                                </SelectItem>
                                <SelectItem value="America/Los_Angeles">
                                    America/Los Angeles (GMT-8)
                                </SelectItem>
                                <SelectItem value="Asia/Tokyo">
                                    Asia/Tokyo (GMT+9)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[12px] text-black/40">
                            Fuseau horaire pour les dates et heures
                        </p>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={DollarSign}
                title="Devise et formats"
                description="Configurez les formats d'affichage des montants"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <div className="space-y-2">
                        <Label
                            htmlFor="devise"
                            className="text-[14px] font-medium"
                        >
                            Devise par défaut
                        </Label>
                        <Select
                            value={preferences.devise || "EUR"}
                            onValueChange={(value) => onChange("devise", value)}
                        >
                            <SelectTrigger
                                id="devise"
                                className="h-11 border-black/10"
                            >
                                <SelectValue placeholder="Sélectionner une devise" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">
                                    € Euro (EUR)
                                </SelectItem>
                                <SelectItem value="USD">
                                    $ Dollar US (USD)
                                </SelectItem>
                                <SelectItem value="GBP">
                                    £ Livre Sterling (GBP)
                                </SelectItem>
                                <SelectItem value="CHF">
                                    CHF Franc Suisse (CHF)
                                </SelectItem>
                                <SelectItem value="CAD">
                                    $ Dollar Canadien (CAD)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[12px] text-black/40">
                            Devise utilisée dans les documents
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="format_nombre"
                            className="text-[14px] font-medium"
                        >
                            Format des nombres
                        </Label>
                        <Select
                            value={preferences.format_nombre || "fr"}
                            onValueChange={(value) =>
                                onChange("format_nombre", value)
                            }
                        >
                            <SelectTrigger
                                id="format_nombre"
                                className="h-11 border-black/10"
                            >
                                <SelectValue placeholder="Sélectionner un format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fr">
                                    1 234,56 (Français)
                                </SelectItem>
                                <SelectItem value="en">
                                    1,234.56 (Anglais)
                                </SelectItem>
                                <SelectItem value="de">
                                    1.234,56 (Allemand)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[12px] text-black/40">
                            Format d&apos;affichage des montants
                        </p>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Calendar}
                title="Formats de date"
                description="Configurez le format d'affichage des dates"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <div className="space-y-2">
                        <Label
                            htmlFor="format_date"
                            className="text-[14px] font-medium"
                        >
                            Format de date
                        </Label>
                        <Select
                            value={preferences.format_date || "DD/MM/YYYY"}
                            onValueChange={(value) =>
                                onChange("format_date", value)
                            }
                        >
                            <SelectTrigger
                                id="format_date"
                                className="h-11 border-black/10"
                            >
                                <SelectValue placeholder="Sélectionner un format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DD/MM/YYYY">
                                    31/12/2025 (Français)
                                </SelectItem>
                                <SelectItem value="MM/DD/YYYY">
                                    12/31/2025 (US)
                                </SelectItem>
                                <SelectItem value="YYYY-MM-DD">
                                    2025-12-31 (ISO)
                                </SelectItem>
                                <SelectItem value="DD.MM.YYYY">
                                    31.12.2025 (Allemand)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[12px] text-black/40">
                            Format d&apos;affichage des dates
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="premier_jour"
                            className="text-[14px] font-medium"
                        >
                            Premier jour de la semaine
                        </Label>
                        <Select
                            value={preferences.premier_jour || "lundi"}
                            onValueChange={(value) =>
                                onChange("premier_jour", value)
                            }
                        >
                            <SelectTrigger
                                id="premier_jour"
                                className="h-11 border-black/10"
                            >
                                <SelectValue placeholder="Sélectionner un jour" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lundi">Lundi</SelectItem>
                                <SelectItem value="dimanche">
                                    Dimanche
                                </SelectItem>
                                <SelectItem value="samedi">Samedi</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[12px] text-black/40">
                            Premier jour dans les calendriers
                        </p>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}

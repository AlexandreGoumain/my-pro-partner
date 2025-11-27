"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetadataField } from "@/components/ui/metadata-field";
import {
    Apple,
    Gamepad2,
    Laptop,
    Monitor,
    Package,
    Server,
    Smartphone,
    Tablet,
    Usb,
} from "lucide-react";

interface RepairDeviceInfoProps {
    reparation: {
        typeAppareil: string;
        marque?: string | null;
        modele?: string | null;
        numeroSerie?: string | null;
        motAuthentification?: string | null;
        panne: string;
        etatVisuel?: string | null;
        accessoires?: string | null;
    };
}

const deviceIcons: Record<string, any> = {
    PC_PORTABLE: Laptop,
    PC_BUREAU: Monitor,
    MAC: Apple,
    SMARTPHONE: Smartphone,
    TABLETTE: Tablet,
    CONSOLE_JEU: Gamepad2,
    SERVEUR: Server,
    PERIPHERIQUE: Usb,
    AUTRE: Package,
};

const deviceLabels: Record<string, string> = {
    PC_PORTABLE: "PC Portable",
    PC_BUREAU: "PC Bureau",
    MAC: "Mac",
    SMARTPHONE: "Smartphone",
    TABLETTE: "Tablette",
    CONSOLE_JEU: "Console de jeu",
    SERVEUR: "Serveur",
    PERIPHERIQUE: "Périphérique",
    AUTRE: "Autre",
};

export function RepairDeviceInfo({ reparation }: RepairDeviceInfoProps) {
    const Icon = deviceIcons[reparation.typeAppareil] || Package;

    return (
        <Card className="border-black/10 shadow-sm">
            <CardHeader>
                <CardTitle className="text-[18px] font-semibold flex items-center gap-2">
                    <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
                    Informations de l&apos;appareil
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Device Type */}
                <MetadataField
                    label="Type d'appareil"
                    value={
                        deviceLabels[reparation.typeAppareil] ||
                        reparation.typeAppareil
                    }
                />

                {/* Brand & Model */}
                {(reparation.marque || reparation.modele) && (
                    <div className="grid grid-cols-2 gap-4">
                        {reparation.marque && (
                            <MetadataField
                                label="Marque"
                                value={reparation.marque}
                            />
                        )}
                        {reparation.modele && (
                            <MetadataField
                                label="Modèle"
                                value={reparation.modele}
                            />
                        )}
                    </div>
                )}

                {/* Serial Number */}
                {reparation.numeroSerie && (
                    <MetadataField
                        label="Numéro de série"
                        value={
                            <span className="font-mono">
                                {reparation.numeroSerie}
                            </span>
                        }
                    />
                )}

                {/* Authentication */}
                {reparation.motAuthentification && (
                    <MetadataField
                        label="Mot de passe / Code PIN"
                        value={<span className="font-mono">••••••••</span>}
                    />
                )}

                {/* Issue Description */}
                <MetadataField
                    label="Description de la panne"
                    value={reparation.panne}
                    preserveWhitespace
                />

                {/* Visual Condition */}
                {reparation.etatVisuel && (
                    <MetadataField
                        label="État visuel"
                        value={reparation.etatVisuel}
                        preserveWhitespace
                    />
                )}

                {/* Accessories */}
                {reparation.accessoires && (
                    <MetadataField
                        label="Accessoires inclus"
                        value={reparation.accessoires}
                    />
                )}
            </CardContent>
        </Card>
    );
}

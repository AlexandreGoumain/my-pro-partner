"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Laptop,
  Monitor,
  Apple,
  Smartphone,
  Tablet,
  Gamepad2,
  Server,
  Usb,
  Package,
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
          Informations de l'appareil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Type */}
        <div>
          <div className="text-[13px] font-medium text-black/40 mb-1">
            Type d'appareil
          </div>
          <div className="text-[14px] text-black">
            {deviceLabels[reparation.typeAppareil] || reparation.typeAppareil}
          </div>
        </div>

        {/* Brand & Model */}
        {(reparation.marque || reparation.modele) && (
          <div className="grid grid-cols-2 gap-4">
            {reparation.marque && (
              <div>
                <div className="text-[13px] font-medium text-black/40 mb-1">
                  Marque
                </div>
                <div className="text-[14px] text-black">
                  {reparation.marque}
                </div>
              </div>
            )}
            {reparation.modele && (
              <div>
                <div className="text-[13px] font-medium text-black/40 mb-1">
                  Modèle
                </div>
                <div className="text-[14px] text-black">
                  {reparation.modele}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Serial Number */}
        {reparation.numeroSerie && (
          <div>
            <div className="text-[13px] font-medium text-black/40 mb-1">
              Numéro de série
            </div>
            <div className="text-[14px] text-black font-mono">
              {reparation.numeroSerie}
            </div>
          </div>
        )}

        {/* Authentication */}
        {reparation.motAuthentification && (
          <div>
            <div className="text-[13px] font-medium text-black/40 mb-1">
              Mot de passe / Code PIN
            </div>
            <div className="text-[14px] text-black font-mono">
              ••••••••
            </div>
          </div>
        )}

        {/* Issue Description */}
        <div>
          <div className="text-[13px] font-medium text-black/40 mb-1">
            Description de la panne
          </div>
          <div className="text-[14px] text-black whitespace-pre-wrap">
            {reparation.panne}
          </div>
        </div>

        {/* Visual Condition */}
        {reparation.etatVisuel && (
          <div>
            <div className="text-[13px] font-medium text-black/40 mb-1">
              État visuel
            </div>
            <div className="text-[14px] text-black whitespace-pre-wrap">
              {reparation.etatVisuel}
            </div>
          </div>
        )}

        {/* Accessories */}
        {reparation.accessoires && (
          <div>
            <div className="text-[13px] font-medium text-black/40 mb-1">
              Accessoires inclus
            </div>
            <div className="text-[14px] text-black">
              {reparation.accessoires}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

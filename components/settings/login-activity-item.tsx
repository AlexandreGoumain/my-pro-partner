"use client";

import { Badge } from "@/components/ui/badge";

interface LoginActivityItemProps {
    location: string;
    timestamp: string;
    device: string;
    isCurrent?: boolean;
}

/**
 * Item d'activité de connexion
 * Affiche une connexion au compte avec localisation, timestamp et device
 */
export function LoginActivityItem({
    location,
    timestamp,
    device,
    isCurrent = false,
}: LoginActivityItemProps) {
    return (
        <div className="flex items-center justify-between border-b border-black/8 py-3 last:border-0">
            <div>
                <div className="text-[14px] font-medium text-black">
                    Connexion depuis {location}
                </div>
                <p className="mt-0.5 text-[13px] text-black/40">
                    {timestamp} • {device}
                </p>
            </div>
            {isCurrent && (
                <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700"
                >
                    Actuelle
                </Badge>
            )}
        </div>
    );
}

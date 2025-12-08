"use client";

import { Shield, Clock, HeadphonesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
    {
        icon: <Shield className="h-4 w-4" strokeWidth={2} />,
        text: "Données sécurisées",
    },
    {
        icon: <Clock className="h-4 w-4" strokeWidth={2} />,
        text: "Annulation à tout moment",
    },
    {
        icon: <HeadphonesIcon className="h-4 w-4" strokeWidth={2} />,
        text: "Support prioritaire",
    },
];

interface SuccessTrustSignalsProps {
    className?: string;
}

/**
 * Signaux de confiance pour rassurer l'utilisateur
 */
export function SuccessTrustSignals({ className }: SuccessTrustSignalsProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-center gap-6",
                className
            )}
        >
            {TRUST_ITEMS.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2 text-black/40"
                >
                    {item.icon}
                    <span className="text-[12px] font-medium">{item.text}</span>
                </div>
            ))}
        </div>
    );
}

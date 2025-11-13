"use client";

import { FullPageErrorState } from "@/components/ui/full-page-error-state";
import { ErrorPageProps } from "@/lib/types/error";
import { AlertCircle } from "lucide-react";

export default function Error({ error, reset }: ErrorPageProps) {
    return (
        <FullPageErrorState
            icon={AlertCircle}
            title="Une erreur est survenue"
            description={
                error.message ||
                "Quelque chose s'est mal passé. Veuillez réessayer."
            }
            primaryAction={{
                label: "Réessayer",
                onClick: reset,
            }}
            secondaryAction={{
                label: "Retour à l'accueil",
                href: "/",
            }}
        />
    );
}

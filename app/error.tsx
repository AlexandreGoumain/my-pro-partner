"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="mx-auto max-w-md space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-3">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Une erreur est survenue
                    </h1>
                    <p className="text-muted-foreground">
                        {error.message ||
                            "Quelque chose s'est mal passé. Veuillez réessayer."}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button onClick={reset} className="flex-1">
                        Réessayer
                    </Button>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Retour à l&apos;accueil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

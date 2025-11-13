"use client";

/**
 * Page affichée quand l'utilisateur est hors ligne
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
    const handleReload = () => {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto">
                        <WifiOff className="w-8 h-8 text-gray-600" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Vous êtes hors ligne
                        </h1>
                        <p className="text-muted-foreground">
                            Impossible de se connecter au serveur. Vérifiez
                            votre connexion internet.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button onClick={handleReload} className="w-full">
                            Réessayer
                        </Button>

                        <p className="text-sm text-muted-foreground">
                            Vos données sont sauvegardées localement et seront
                            synchronisées automatiquement dès que vous serez de
                            nouveau en ligne.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

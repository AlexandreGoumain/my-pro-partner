/**
 * EXEMPLE D'UTILISATION COMPLET
 *
 * Ce fichier montre comment intégrer les composants de pricing
 * dans une page réelle de l'application.
 *
 * ⚠️ Ceci est un exemple - ne pas utiliser directement en production
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LimitReachedDialog, LimitIndicator, FeatureBadge } from "@/components/paywall";
import { useLimitDialog } from "@/hooks/use-limit-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";

/**
 * Exemple 1 : Page Clients avec gestion de limite
 */
export function ExampleClientsPage() {
    // Simuler les données utilisateur
    const userPlan = "FREE"; // En réalité : récupérer depuis auth
    const clientsCount = 9; // En réalité : compter depuis la DB

    // Hook qui gère tout le state du dialog automatiquement
    const { checkLimit, dialogProps } = useLimitDialog(userPlan);

    // État pour le dialog de création
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    async function handleCreateClient() {
        // Vérifier la limite AVANT d'ouvrir le formulaire
        // Si limite atteinte, le dialog s'affiche automatiquement
        if (!checkLimit("maxClients", clientsCount)) {
            return; // Bloqué - dialog de pricing affiché
        }

        // Si OK, ouvrir le formulaire de création
        setCreateDialogOpen(true);
    }

    async function handleSubmitClient(formData: any) {
        // Appel API pour créer le client
        const response = await fetch("/api/clients", {
            method: "POST",
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const error = await response.json();

            // Gérer l'erreur de limite côté serveur (double vérification)
            if (error.code === "LIMIT_REACHED") {
                setCreateDialogOpen(false);
                // Le dialog de limite s'affichera automatiquement
                return;
            }
        }

        // Succès
        setCreateDialogOpen(false);
        // Recharger la liste...
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header avec indicateur de limite */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Clients
                    </h1>
                    <p className="text-[14px] text-black/60 mt-1">
                        Gérez votre portefeuille clients
                    </p>
                </div>

                <Button
                    onClick={handleCreateClient}
                    className="bg-black hover:bg-black/90 text-white h-11 px-6"
                >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                    Créer un client
                </Button>
            </div>

            {/* Carte avec indicateur de limite */}
            <Card className="border-black/10">
                <CardHeader>
                    <CardTitle className="text-[16px] font-semibold text-black flex items-center gap-2">
                        <Users className="w-5 h-5 text-black/60" strokeWidth={2} />
                        Utilisation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LimitIndicator
                        userPlan={userPlan}
                        limitKey="maxClients"
                        currentValue={clientsCount}
                        label="Clients"
                        showProgress
                        showUpgradeLink
                    />
                </CardContent>
            </Card>

            {/* Liste des clients... */}
            <div className="grid gap-4">
                {/* Composants de liste ici */}
            </div>

            {/* Dialog de limite - S'affiche automatiquement quand checkLimit() retourne false */}
            <LimitReachedDialog {...dialogProps} />

            {/* Dialog de création de client (exemple simplifié) */}
            {/* <CreateClientDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} /> */}
        </div>
    );
}

/**
 * Exemple 2 : Feature premium avec badge
 */
export function ExamplePremiumFeature() {
    const userPlan = "STARTER"; // N'a pas la feature "hasAdvancedAnalytics"

    const { checkFeature, dialogProps } = useLimitDialog(userPlan);

    function handleViewAnalytics() {
        // Vérifier si la feature est disponible
        if (!checkFeature("hasAdvancedAnalytics")) {
            return; // Dialog s'affiche automatiquement
        }

        // Rediriger vers les analytics avancées
        window.location.href = "/analytics/advanced";
    }

    return (
        <div className="space-y-4">
            <Card className="border-black/10 hover:border-black/20 transition-all cursor-pointer" onClick={handleViewAnalytics}>
                <CardHeader>
                    <CardTitle className="text-[16px] font-semibold text-black flex items-center gap-2">
                        Analytics avancées
                        <FeatureBadge requiredPlan="PRO" compact />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-[14px] text-black/60">
                        Analyse détaillée de rentabilité, prédictions de CA, segmentation avancée
                    </p>
                </CardContent>
            </Card>

            {/* Dialog de limite */}
            <LimitReachedDialog {...dialogProps} />
        </div>
    );
}

/**
 * Exemple 3 : Utilisation manuelle du dialog (sans le hook)
 */
export function ExampleManualDialog() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const userPlan = "FREE";
    const documentsThisMonth = 10;

    function handleCreateDocument() {
        // Vérification manuelle
        if (documentsThisMonth >= 10) {
            setDialogOpen(true);
            return;
        }

        // Créer le document...
    }

    return (
        <div className="space-y-4">
            <Button onClick={handleCreateDocument}>Créer une facture</Button>

            <LimitReachedDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                userPlan={userPlan}
                limitKey="maxDocumentsPerMonth"
                customTitle="Limite mensuelle atteinte"
                customMessage="Vous avez atteint votre limite de 10 documents ce mois-ci. Passez au plan Starter pour créer des documents illimités."
                onUpgradeClick={() => {
                    console.log("User clicked upgrade");
                    // Analytics, etc.
                }}
            />
        </div>
    );
}

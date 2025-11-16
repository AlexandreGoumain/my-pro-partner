"use client";

import { RegisterTerminalDialog, TerminalsGrid } from "@/components/terminals";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { FEATURE_FLAGS } from "@/lib/config/features.config";
import { useTerminalsPage } from "@/hooks/use-terminals-page";
import { Plus, WifiOff, Lock } from "lucide-react";

export default function TerminalsPage() {
    const page = useTerminalsPage();

    // Si la feature est désactivée, afficher un message
    if (!FEATURE_FLAGS.ENABLE_PAYMENT_TERMINALS) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Terminaux de Paiement"
                    description="Fonctionnalité temporairement désactivée"
                />
                <EmptyState
                    icon={Lock}
                    title="Fonctionnalité désactivée"
                    description="Les terminaux de paiement physiques nécessitent du matériel Stripe Terminal. Cette fonctionnalité sera disponible prochainement."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Terminaux de Paiement"
                description="Gérez vos terminaux physiques Stripe Terminal"
                actions={
                    <PrimaryActionButton
                        icon={Plus}
                        onClick={() => {
                            page.setRegisterDialogOpen(true);
                            page.loadStripeReaders();
                        }}
                    >
                        Enregistrer un terminal
                    </PrimaryActionButton>
                }
            />

            {page.isLoading ? (
                <GridSkeleton
                    itemCount={4}
                    gridColumns={{ md: 2, lg: 3 }}
                    gap={5}
                    itemHeight="h-40"
                />
            ) : page.terminals.length === 0 ? (
                <EmptyState
                    icon={WifiOff}
                    title="Aucun terminal enregistré"
                    description="Enregistrez votre premier terminal Stripe pour commencer"
                    action={{
                        label: "Enregistrer un terminal",
                        onClick: () => {
                            page.setRegisterDialogOpen(true);
                            page.loadStripeReaders();
                        },
                    }}
                />
            ) : (
                <TerminalsGrid
                    terminals={page.terminals}
                    onSync={page.handleSyncTerminal}
                    onDelete={page.handleDeleteTerminal}
                />
            )}

            <RegisterTerminalDialog
                open={page.registerDialogOpen}
                onOpenChange={page.setRegisterDialogOpen}
                stripeReaders={page.stripeReaders}
                isLoadingReaders={page.isLoadingReaders}
                selectedReader={page.selectedReader}
                onReaderChange={page.setSelectedReader}
                terminalLabel={page.terminalLabel}
                onLabelChange={page.setTerminalLabel}
                terminalLocation={page.terminalLocation}
                onLocationChange={page.setTerminalLocation}
                onRegister={page.handleRegisterTerminal}
                registering={page.registering}
            />
        </div>
    );
}

"use client";

import { RegisterTerminalDialog, TerminalsGrid } from "@/components/terminals";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useTerminalsPage } from "@/hooks/use-terminals-page";
import { Plus, WifiOff } from "lucide-react";

export default function TerminalsPage() {
    const page = useTerminalsPage();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Terminaux de Paiement"
                description="Gérez vos terminaux physiques Stripe Terminal"
                actions={
                    <Button
                        onClick={() => {
                            page.setRegisterDialogOpen(true);
                            page.loadStripeReaders();
                        }}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Enregistrer un terminal
                    </Button>
                }
            />

            {page.isLoading ? (
                <div className="text-center py-12">
                    <p className="text-[14px] text-black/40">Chargement...</p>
                </div>
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

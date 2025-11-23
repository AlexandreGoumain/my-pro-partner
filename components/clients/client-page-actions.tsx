"use client";

import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Mail, Plus, Upload } from "lucide-react";

export interface ClientPageActionsProps {
    /**
     * Handler pour ouvrir le dialog d'import CSV
     */
    onImportClick: () => void;

    /**
     * Handler pour créer un client manuellement (avec vérification de limite)
     */
    onCreateClick: () => void;

    /**
     * Handler pour inviter un client par email (avec vérification de limite)
     */
    onInviteClick: () => void;
}

/**
 * Composant des actions du header de la page clients
 *
 * Affiche les boutons d'import CSV et de création/invitation de clients.
 *
 * @example
 * ```tsx
 * <ClientPageActions
 *   onImportClick={() => setImportDialogOpen(true)}
 *   onCreateClick={handleCreateWithLimitCheck}
 *   onInviteClick={handleInviteWithLimitCheck}
 * />
 * ```
 */
export function ClientPageActions({
    onImportClick,
    onCreateClick,
    onInviteClick,
}: ClientPageActionsProps) {
    return (
        <div className="flex items-center gap-3">
            <Button
                onClick={onImportClick}
                variant="outline"
                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
            >
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                Importer CSV
            </Button>

            <Button
                onClick={onInviteClick}
                variant="outline"
                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
            >
                <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                Inviter par email
            </Button>

            <PrimaryActionButton onClick={onCreateClick}>
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                Nouveau client
            </PrimaryActionButton>
        </div>
    );
}

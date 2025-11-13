"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Mail, Plus, Upload, UserPlus } from "lucide-react";

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
        <>
            <Button
                onClick={onImportClick}
                variant="outline"
                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
            >
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                Importer CSV
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouveau client
                        <ChevronDown className="w-4 h-4 ml-2" strokeWidth={2} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                        onClick={onCreateClick}
                        className="cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Créer manuellement
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onInviteClick}
                        className="cursor-pointer"
                    >
                        <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                        Inviter par email
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

import { useState } from "react";
import { toast } from "sonner";
import type {
    Terminal,
    StripeReader,
    RegisterTerminalInput,
} from "@/lib/types/pos";
import {
    useTerminals,
    useStripeReaders,
    useRegisterTerminal,
    useSyncTerminal,
    useDeleteTerminal,
} from "@/hooks/use-terminals";

export interface TerminalsPageHandlers {
    // Data
    terminals: Terminal[];
    stripeReaders: StripeReader[];
    isLoading: boolean;
    isLoadingReaders: boolean;

    // Register Dialog
    registerDialogOpen: boolean;
    setRegisterDialogOpen: (open: boolean) => void;
    selectedReader: string;
    setSelectedReader: (id: string) => void;
    terminalLabel: string;
    setTerminalLabel: (label: string) => void;
    terminalLocation: string;
    setTerminalLocation: (location: string) => void;
    registering: boolean;

    // Handlers
    handleRegisterTerminal: () => Promise<void>;
    handleSyncTerminal: (terminalId: string) => Promise<void>;
    handleDeleteTerminal: (terminalId: string) => Promise<void>;
    loadStripeReaders: () => void;
}

export function useTerminalsPage(): TerminalsPageHandlers {
    // State
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
    const [selectedReader, setSelectedReader] = useState("");
    const [terminalLabel, setTerminalLabel] = useState("");
    const [terminalLocation, setTerminalLocation] = useState("");

    // Queries
    const { data: terminalsData, isLoading } = useTerminals();
    const {
        data: readersData,
        isLoading: isLoadingReaders,
        refetch: refetchReaders,
    } = useStripeReaders(registerDialogOpen);

    // Mutations
    const registerMutation = useRegisterTerminal();
    const syncMutation = useSyncTerminal();
    const deleteMutation = useDeleteTerminal();

    const terminals = terminalsData?.terminals || [];
    const stripeReaders = readersData?.terminals || [];

    // Handlers
    const handleRegisterTerminal = async () => {
        if (!selectedReader || !terminalLabel) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            const input: RegisterTerminalInput = {
                stripeTerminalId: selectedReader,
                label: terminalLabel,
                location: terminalLocation || undefined,
            };

            await registerMutation.mutateAsync(input);

            toast.success("Terminal enregistré avec succès");
            setRegisterDialogOpen(false);
            setSelectedReader("");
            setTerminalLabel("");
            setTerminalLocation("");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors de l'enregistrement");
        }
    };

    const handleSyncTerminal = async (terminalId: string) => {
        try {
            await syncMutation.mutateAsync(terminalId);
            toast.success("Terminal synchronisé");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors de la synchronisation");
        }
    };

    const handleDeleteTerminal = async (terminalId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce terminal ?")) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(terminalId);
            toast.success("Terminal supprimé");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors de la suppression");
        }
    };

    const loadStripeReaders = () => {
        refetchReaders();
    };

    return {
        // Data
        terminals,
        stripeReaders,
        isLoading,
        isLoadingReaders,

        // Register Dialog
        registerDialogOpen,
        setRegisterDialogOpen,
        selectedReader,
        setSelectedReader,
        terminalLabel,
        setTerminalLabel,
        terminalLocation,
        setTerminalLocation,
        registering: registerMutation.isPending,

        // Handlers
        handleRegisterTerminal,
        handleSyncTerminal,
        handleDeleteTerminal,
        loadStripeReaders,
    };
}

"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientsPaginated, type Client } from "@/hooks/use-clients";
import { useBiens, type BienWithRelations } from "@/hooks/immobilier/use-biens";
import { useCreateBail, type CreateBailInput } from "@/hooks/immobilier/use-baux";
import { bailCreateSchema, defaultValues, type BailFormValues } from "./types";

interface UseCreateBailFormProps {
    onSuccess?: () => void;
    onOpenChange: (open: boolean) => void;
}

export function useCreateBailForm({ onSuccess, onOpenChange }: UseCreateBailFormProps) {
    // Search states
    const [locataireSearch, setLocataireSearch] = useState("");
    const [locataireOpen, setLocataireOpen] = useState(false);
    const [selectedLocataire, setSelectedLocataire] = useState<Client | null>(null);

    const [proprietaireSearch, setProprietaireSearch] = useState("");
    const [proprietaireOpen, setProprietaireOpen] = useState(false);
    const [selectedProprietaire, setSelectedProprietaire] = useState<Client | null>(null);

    const [bienOpen, setBienOpen] = useState(false);
    const [selectedBien, setSelectedBien] = useState<BienWithRelations | null>(null);

    const [formKey, setFormKey] = useState(0);

    // Data fetching
    const { data: biens = [] } = useBiens({ statut: "DISPONIBLE" });
    const { data: locatairesData } = useClientsPaginated(
        locataireSearch.length >= 2
            ? { search: locataireSearch, limit: 10 }
            : undefined
    );
    const { data: proprietairesData } = useClientsPaginated(
        proprietaireSearch.length >= 2
            ? { search: proprietaireSearch, limit: 10 }
            : undefined
    );
    const createBail = useCreateBail();

    const form = useForm<BailFormValues>({
        resolver: zodResolver(bailCreateSchema),
        defaultValues,
    });

    // Handle dialog open/close
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                form.reset(defaultValues);
                setSelectedLocataire(null);
                setSelectedProprietaire(null);
                setSelectedBien(null);
                setLocataireSearch("");
                setProprietaireSearch("");
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [form, onOpenChange]
    );

    // Handle selections
    const handleLocataireSelect = useCallback(
        (client: Client) => {
            setSelectedLocataire(client);
            form.setValue("locataireId", client.id);
            setLocataireOpen(false);
        },
        [form]
    );

    const handleProprietaireSelect = useCallback(
        (client: Client) => {
            setSelectedProprietaire(client);
            form.setValue("proprietaireId", client.id);
            setProprietaireOpen(false);
        },
        [form]
    );

    const handleBienSelect = useCallback(
        (bien: BienWithRelations) => {
            setSelectedBien(bien);
            form.setValue("bienId", bien.id);
            // If bien has a proprietaire, auto-select it
            if (bien.proprietaire) {
                setSelectedProprietaire(bien.proprietaire as Client);
                form.setValue("proprietaireId", bien.proprietaire.id);
            }
            setBienOpen(false);
        },
        [form]
    );

    const loyerHC = form.watch("loyerHC");
    const provisions = form.watch("provisions");
    const loyerCC = loyerHC + provisions;

    function onSubmit(values: BailFormValues) {
        const input: CreateBailInput = {
            bienId: values.bienId,
            locataireId: values.locataireId,
            proprietaireId: values.proprietaireId,
            typeBail: values.typeBail as CreateBailInput["typeBail"],
            dateDebut: values.dateDebut.toISOString(),
            dureeMois: values.dureeMois,
            loyerHC: values.loyerHC,
            charges: values.provisions,
            depotGarantie: values.depotGarantie,
        };

        createBail.mutate(input, {
            onSuccess: () => {
                onSuccess?.();
                onOpenChange(false);
            },
            onError: (error) => {
                form.setError("root", {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Une erreur est survenue",
                });
            },
        });
    }

    return {
        form,
        formKey,
        // Locataire
        locataireSearch,
        setLocataireSearch,
        locataireOpen,
        setLocataireOpen,
        selectedLocataire,
        locataires: locatairesData?.data || [],
        handleLocataireSelect,
        // Proprietaire
        proprietaireSearch,
        setProprietaireSearch,
        proprietaireOpen,
        setProprietaireOpen,
        selectedProprietaire,
        proprietaires: proprietairesData?.data || [],
        handleProprietaireSelect,
        // Bien
        bienOpen,
        setBienOpen,
        selectedBien,
        biens,
        handleBienSelect,
        // Form
        handleOpenChange,
        onSubmit,
        isLoading: createBail.isPending,
        // Computed
        loyerHC,
        provisions,
        loyerCC,
    };
}

import { useStores, useCreateStore, useUpdateStore, useDeleteStore, type Store } from "@/hooks/use-stores";
import { useLimitDialog } from "@/components/providers/limit-dialog-provider";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useCallback } from "react";
import { type PlanLimits } from "@/lib/pricing-config";
import { mapStoreToDisplay, type StoreDisplay } from "@/lib/types/store";

export interface StoresPageHandlers {
    // Data
    stores: Store[];
    displayStores: StoreDisplay[];
    isLoading: boolean;
    storesCount: number;

    // UI States
    searchTerm: string;
    setSearchTerm: (term: string) => void;

    // Modal states
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedStore: Store | null;
    isDeleting: boolean;

    // Handlers
    handleCreate: () => void;
    handleEdit: (store: Store) => void;
    handleDelete: (store: Store) => void;
    handleCreateSuccess: () => void;
    handleEditSuccess: () => void;
    confirmDelete: () => void;
    handleCreateWithLimitCheck: () => void;

    // Computed data
    stats: {
        total: number;
        active: number;
        inactive: number;
        totalRegisters: number;
    };

    // Pricing
    userPlan: any;
    checkLimit: (limitKey: keyof PlanLimits, currentValue: number) => boolean;
}

export function useStoresPage(): StoresPageHandlers {
    // React Query hooks
    const { data: stores = [], isLoading } = useStores();
    const createMutation = useCreateStore();
    const updateMutation = useUpdateStore();
    const deleteMutation = useDeleteStore();

    // Pricing limit check
    const { checkLimit, userPlan } = useLimitDialog();
    const storesCount = stores.length;

    // Toast notifications
    const { toast } = useToast();

    // UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter stores based on search
    const filteredStores = useMemo(() => {
        if (!searchTerm) return stores;

        const term = searchTerm.toLowerCase();
        return stores.filter(
            (store) =>
                store.nom.toLowerCase().includes(term) ||
                store.code.toLowerCase().includes(term) ||
                store.ville?.toLowerCase().includes(term) ||
                store.email?.toLowerCase().includes(term)
        );
    }, [stores, searchTerm]);

    // Map to display format
    const displayStores = useMemo(() => {
        return filteredStores.map(mapStoreToDisplay);
    }, [filteredStores]);

    // Compute statistics
    const stats = useMemo(() => {
        const active = stores.filter((s) => s.status === "ACTIVE").length;
        const inactive = stores.filter((s) => s.status === "INACTIVE").length;
        const totalRegisters = stores.reduce(
            (acc, store) => acc + (store.registers?.length || 0),
            0
        );

        return {
            total: stores.length,
            active,
            inactive,
            totalRegisters,
        };
    }, [stores]);

    // Handlers
    const handleCreate = useCallback(() => {
        setSelectedStore(null);
        setCreateDialogOpen(true);
    }, []);

    const handleEdit = useCallback((store: Store) => {
        setSelectedStore(store);
        setEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((store: Store) => {
        setSelectedStore(store);
        setDeleteDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        setCreateDialogOpen(false);
        setSelectedStore(null);
        toast({
            title: "Magasin créé",
            description: "Le magasin a été créé avec succès",
        });
    }, [toast]);

    const handleEditSuccess = useCallback(() => {
        setEditDialogOpen(false);
        setSelectedStore(null);
        toast({
            title: "Magasin mis à jour",
            description: "Les modifications ont été enregistrées",
        });
    }, [toast]);

    const confirmDelete = useCallback(async () => {
        if (!selectedStore) return;

        setIsDeleting(true);
        try {
            await deleteMutation.mutateAsync(selectedStore.id);
            toast({
                title: "Magasin supprimé",
                description: "Le magasin a été supprimé avec succès",
            });
            setDeleteDialogOpen(false);
            setSelectedStore(null);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le magasin",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    }, [selectedStore, deleteMutation, toast]);

    const handleCreateWithLimitCheck = useCallback(() => {
        // Temporarily allow creation - limit checking will be added later
        handleCreate();
    }, [handleCreate]);

    return {
        // Data
        stores,
        displayStores,
        isLoading,
        storesCount,

        // UI States
        searchTerm,
        setSearchTerm,

        // Modal states
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedStore,
        isDeleting,

        // Handlers
        handleCreate,
        handleEdit,
        handleDelete,
        handleCreateSuccess,
        handleEditSuccess,
        confirmDelete,
        handleCreateWithLimitCheck,

        // Computed data
        stats,

        // Pricing
        userPlan,
        checkLimit,
    };
}

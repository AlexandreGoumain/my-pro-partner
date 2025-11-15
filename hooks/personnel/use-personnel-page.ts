/**
 * Hook personnalisé pour gérer la logique de la page personnel
 * Centralise toute la logique métier et la gestion d'état
 */

import { useState, useMemo, useCallback } from "react";
import { usePersonnel, User, CreateUserInput, UpdateUserInput } from "./use-personnel";
import { useLimitDialog } from "@/components/providers";

export interface PersonnelPageHandlers {
    // Data
    users: User[];
    stats: ReturnType<typeof usePersonnel>["stats"];
    loading: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;

    // Filters
    filters: ReturnType<typeof usePersonnel>["filters"];
    setFilters: ReturnType<typeof usePersonnel>["setFilters"];

    // Dialogs
    createDialogOpen: boolean;
    setCreateDialogOpen: (open: boolean) => void;
    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;

    // Handlers
    handleOpenCreateDialog: () => void;
    handleCreate: (data: CreateUserInput) => Promise<boolean>;
    handleEdit: (data: UpdateUserInput) => Promise<boolean>;
    handleDelete: () => Promise<void>;
    handleStatusToggle: (user: User, newStatus: "ACTIVE" | "INACTIVE") => Promise<void>;
    handleOpenEditDialog: (user: User) => void;
    handleOpenDeleteDialog: (user: User) => void;
    handleCloseEditDialog: () => void;
    handleCloseDeleteDialog: () => void;

    // Limit
    usersCount: number;
    userPlan: ReturnType<typeof useLimitDialog>["userPlan"];
}

export function usePersonnelPage(): PersonnelPageHandlers {
    const personnelHook = usePersonnel();
    const { checkLimit, userPlan } = useLimitDialog();
    const usersCount = personnelHook.stats?.total || 0;

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    /**
     * Ouvre le dialog de création après vérification de la limite
     */
    const handleOpenCreateDialog = useCallback(() => {
        if (!checkLimit("maxUsers", usersCount)) {
            return; // Limite atteinte - dialog s'affiche automatiquement
        }
        setCreateDialogOpen(true);
    }, [checkLimit, usersCount]);

    /**
     * Crée un nouvel employé
     */
    const handleCreate = useCallback(
        async (data: CreateUserInput): Promise<boolean> => {
            const success = await personnelHook.createUser(data);
            if (success) {
                setCreateDialogOpen(false);
            }
            return success;
        },
        [personnelHook]
    );

    /**
     * Modifie un employé
     */
    const handleEdit = useCallback(
        async (data: UpdateUserInput): Promise<boolean> => {
            if (!selectedUser) return false;
            const success = await personnelHook.updateUser(selectedUser.id, data);
            if (success) {
                setEditDialogOpen(false);
                setSelectedUser(null);
            }
            return success;
        },
        [selectedUser, personnelHook]
    );

    /**
     * Supprime un employé
     */
    const handleDelete = useCallback(async (): Promise<void> => {
        if (!selectedUser) return;
        const success = await personnelHook.deleteUser(selectedUser.id);
        if (success) {
            setDeleteDialogOpen(false);
            setSelectedUser(null);
        }
    }, [selectedUser, personnelHook]);

    /**
     * Change le statut d'un employé
     */
    const handleStatusToggle = useCallback(
        async (user: User, newStatus: "ACTIVE" | "INACTIVE"): Promise<void> => {
            await personnelHook.toggleStatus(user.id, newStatus);
        },
        [personnelHook]
    );

    /**
     * Ouvre le dialog d'édition
     */
    const handleOpenEditDialog = useCallback((user: User) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    }, []);

    /**
     * Ouvre le dialog de suppression
     */
    const handleOpenDeleteDialog = useCallback((user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    }, []);

    /**
     * Ferme le dialog d'édition
     */
    const handleCloseEditDialog = useCallback(() => {
        setEditDialogOpen(false);
        setSelectedUser(null);
    }, []);

    /**
     * Ferme le dialog de suppression
     */
    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    }, []);

    return {
        // Data
        users: personnelHook.users,
        stats: personnelHook.stats,
        loading: personnelHook.loading,
        creating: personnelHook.creating,
        updating: personnelHook.updating,
        deleting: personnelHook.deleting,

        // Filters
        filters: personnelHook.filters,
        setFilters: personnelHook.setFilters,

        // Dialogs
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedUser,
        setSelectedUser,

        // Handlers
        handleOpenCreateDialog,
        handleCreate,
        handleEdit,
        handleDelete,
        handleStatusToggle,
        handleOpenEditDialog,
        handleOpenDeleteDialog,
        handleCloseEditDialog,
        handleCloseDeleteDialog,

        // Limit
        usersCount,
        userPlan,
    };
}

/**
 * Page de gestion du personnel
 * /dashboard/personnel
 */

"use client";

import {
    PersonnelDialogs,
    PersonnelListItem,
    PersonnelStatsGrid,
} from "@/components/personnel";
import { CardSection } from "@/components/ui/card-section";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { UsageLimitCard } from "@/components/ui/usage-limit-card";
import { UserRole, UserStatus } from "@/hooks/personnel/use-personnel";
import { usePersonnelPage } from "@/hooks/personnel/use-personnel-page";
import { ROLE_LABELS, STATUS_LABELS } from "@/lib/personnel/roles-config";
import { Filter, UserPlus, Users } from "lucide-react";

export default function PersonnelPage() {
    const handlers = usePersonnelPage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Gestion du personnel"
                description="Gérez les employés, leurs rôles et leurs permissions"
            />

            {/* Stats Cards */}
            {handlers.stats && (
                <PersonnelStatsGrid
                    total={handlers.stats.total}
                    active={handlers.stats.active}
                    invited={handlers.stats.invited}
                    inactive={
                        handlers.stats.total -
                        handlers.stats.active -
                        handlers.stats.invited
                    }
                />
            )}

            {/* Indicateur de limite de plan */}
            <UsageLimitCard
                userPlan={handlers.userPlan}
                limitKey="maxUsers"
                currentValue={handlers.usersCount}
                label="Employés"
                icon={Users}
            />

            {/* Search Bar & Filters */}
            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: handlers.filters.search,
                        onChange: (search) =>
                            handlers.setFilters({
                                ...handlers.filters,
                                search,
                            }),
                        placeholder: "Rechercher un employé...",
                        className: "flex-1",
                    },
                    {
                        type: "select",
                        value: handlers.filters.role || "all",
                        onChange: (value) =>
                            handlers.setFilters({
                                ...handlers.filters,
                                role:
                                    value === "all"
                                        ? undefined
                                        : (value as UserRole),
                            }),
                        placeholder: "Filtrer par rôle",
                        options: [
                            { value: "all", label: "Tous les rôles" },
                            ...Object.entries(ROLE_LABELS).map(
                                ([key, label]) => ({
                                    value: key,
                                    label: label,
                                })
                            ),
                        ],
                        icon: Filter,
                        className: "w-full sm:w-[180px]",
                    },
                    {
                        type: "select",
                        value: handlers.filters.status || "all",
                        onChange: (value) =>
                            handlers.setFilters({
                                ...handlers.filters,
                                status:
                                    value === "all"
                                        ? undefined
                                        : (value as UserStatus),
                            }),
                        placeholder: "Filtrer par statut",
                        options: [
                            { value: "all", label: "Tous les statuts" },
                            ...Object.entries(STATUS_LABELS).map(
                                ([key, label]) => ({
                                    value: key,
                                    label: label,
                                })
                            ),
                        ],
                        className: "w-full sm:w-[180px]",
                    },
                    {
                        type: "action",
                        label: "Ajouter un employé",
                        onClick: handlers.handleOpenCreateDialog,
                        icon: UserPlus,
                    },
                ]}
            />

            {/* Users List */}
            <CardSection
                title="Employés"
                description="Liste de tous les employés de l'entreprise"
                count={handlers.users.length}
            >
                {handlers.loading ? (
                    <GridSkeleton
                        itemCount={5}
                        gridColumns={{ default: 1 }}
                        gap={3}
                        itemHeight="h-20"
                    />
                ) : handlers.users.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="Aucun employé"
                        description="Commencez par ajouter votre premier employé"
                        action={{
                            label: "Ajouter un employé",
                            onClick: handlers.handleOpenCreateDialog,
                        }}
                    />
                ) : (
                    <div className="space-y-3">
                        {handlers.users.map((user) => (
                            <PersonnelListItem
                                key={user.id}
                                user={user}
                                onEdit={handlers.handleOpenEditDialog}
                                onDelete={handlers.handleOpenDeleteDialog}
                                onStatusToggle={handlers.handleStatusToggle}
                            />
                        ))}
                    </div>
                )}
            </CardSection>

            {/* Dialogs */}
            <PersonnelDialogs
                createDialogOpen={handlers.createDialogOpen}
                onCreateDialogChange={handlers.setCreateDialogOpen}
                onCreateSubmit={handlers.handleCreate}
                creating={handlers.creating}
                editDialogOpen={handlers.editDialogOpen}
                onEditDialogChange={handlers.setEditDialogOpen}
                onEditSubmit={handlers.handleEdit}
                updating={handlers.updating}
                selectedUser={handlers.selectedUser}
                onEditCancel={handlers.handleCloseEditDialog}
                deleteDialogOpen={handlers.deleteDialogOpen}
                onDeleteDialogChange={handlers.setDeleteDialogOpen}
                onDeleteConfirm={handlers.handleDelete}
                deleting={handlers.deleting}
                onDeleteCancel={handlers.handleCloseDeleteDialog}
            />
        </div>
    );
}

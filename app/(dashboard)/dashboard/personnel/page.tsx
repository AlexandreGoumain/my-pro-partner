/**
 * Page de gestion du personnel
 * /dashboard/personnel
 */

"use client";

import {
    PersonnelDialogs,
    PersonnelEmptyState,
    PersonnelListItem,
    PersonnelSearchBar,
    PersonnelStatsGrid,
} from "@/components/personnel";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { UsageLimitCard } from "@/components/ui/usage-limit-card";
import { usePersonnelPage } from "@/hooks/personnel/use-personnel-page";
import { Users } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";

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
            <PersonnelSearchBar
                search={handlers.filters.search}
                onSearchChange={(search) =>
                    handlers.setFilters({ ...handlers.filters, search })
                }
                role={handlers.filters.role}
                onRoleChange={(role) =>
                    handlers.setFilters({ ...handlers.filters, role })
                }
                status={handlers.filters.status}
                onStatusChange={(status) =>
                    handlers.setFilters({ ...handlers.filters, status })
                }
                onAddClick={handlers.handleOpenCreateDialog}
            />

            {/* Users List */}
            <Card className="border-black/10">
                <CardHeader>
                    <CardTitle className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                        Employés ({handlers.users.length})
                    </CardTitle>
                    <CardDescription className="text-[14px] text-black/60">
                        Liste de tous les employés de l&apos;entreprise
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {handlers.loading ? (
                        <LoadingState spinnerSize={32} minHeight="sm" className="py-12" />
                    ) : handlers.users.length === 0 ? (
                        <PersonnelEmptyState
                            onAddClick={handlers.handleOpenCreateDialog}
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
                </CardContent>
            </Card>

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

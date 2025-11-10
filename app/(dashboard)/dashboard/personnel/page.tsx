/**
 * Page de gestion du personnel
 * /dashboard/personnel
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePersonnel, User } from "@/hooks/personnel/use-personnel";
import { UserForm } from "@/components/personnel/user-form";
import { RoleBadge } from "@/components/personnel/role-badge";
import { StatusBadge } from "@/components/personnel/status-badge";
import { ROLE_LABELS, STATUS_LABELS } from "@/lib/personnel/roles-config";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useLimitDialog } from "@/components/providers";
import { LimitIndicator } from "@/components/paywall";

export default function PersonnelPage() {
  const {
    users,
    stats,
    loading,
    creating,
    updating,
    deleting,
    filters,
    setFilters,
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
  } = usePersonnel();

  // Pricing limit check
  const { checkLimit, userPlan } = useLimitDialog();
  const usersCount = stats?.total || 0;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Wrapper pour vérifier la limite avant d'ouvrir le dialog
  const handleOpenCreateDialog = () => {
    if (!checkLimit("maxUsers", usersCount)) {
      return; // Limite atteinte - dialog s'affiche automatiquement
    }
    setCreateDialogOpen(true);
  };

  const handleCreate = async (data: any) => {
    const success = await createUser(data);
    if (success) {
      setCreateDialogOpen(false);
    }
    return success;
  };

  const handleEdit = async (data: any) => {
    if (!selectedUser) return false;
    const success = await updateUser(selectedUser.id, data);
    if (success) {
      setEditDialogOpen(false);
      setSelectedUser(null);
    }
    return success;
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    const success = await deleteUser(selectedUser.id);
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleStatusToggle = async (user: User, newStatus: "ACTIVE" | "INACTIVE") => {
    await toggleStatus(user.id, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion du personnel</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les employés, leurs rôles et leurs permissions
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total employés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invités</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.invited}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
              <UserX className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total - stats.active - stats.invited}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Indicateur de limite de plan */}
      <Card className="border-black/10">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-black flex items-center gap-2">
            <Users className="w-5 h-5 text-black/60" strokeWidth={2} />
            Utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LimitIndicator
            userPlan={userPlan}
            limitKey="maxUsers"
            currentValue={usersCount}
            label="Employés"
            showProgress
            showUpgradeLink
          />
        </CardContent>
      </Card>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un employé..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>

            {/* Role filter */}
            <Select
              value={filters.role || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, role: value === "all" ? undefined : (value as any) })
              }
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value === "all" ? undefined : (value as any) })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add button */}
            <Button onClick={handleOpenCreateDialog}>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un employé
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employés ({users.length})</CardTitle>
          <CardDescription>Liste de tous les employés de l'entreprise</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun employé</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Commencez par ajouter votre premier employé
              </p>
              <Button onClick={handleOpenCreateDialog}>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un employé
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {(user.prenom?.[0] || user.name?.[0] || user.email[0]).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">
                          {user.prenom} {user.name || user.email}
                        </p>
                        <RoleBadge role={user.role} showIcon={false} />
                        <StatusBadge status={user.status} showIcon={false} />
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{user.email}</span>
                        {user.poste && (
                          <>
                            <span>•</span>
                            <span>{user.poste}</span>
                          </>
                        )}
                        {user.departement && (
                          <>
                            <span>•</span>
                            <span>{user.departement}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Last login */}
                    {user.lastLoginAt && (
                      <div className="hidden md:block text-sm text-muted-foreground">
                        Dernière connexion:{" "}
                        {formatDistanceToNow(new Date(user.lastLoginAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      {user.status === "ACTIVE" ? (
                        <DropdownMenuItem onClick={() => handleStatusToggle(user, "INACTIVE")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Désactiver
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleStatusToggle(user, "ACTIVE")}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Activer
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Renvoyer l'invitation
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un employé</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte employé. Une invitation sera envoyée par email.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={handleCreate}
            onCancel={() => setCreateDialogOpen(false)}
            loading={creating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'employé</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de l'employé
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSubmit={handleEdit}
            onCancel={() => {
              setEditDialogOpen(false);
              setSelectedUser(null);
            }}
            loading={updating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'employé{" "}
              <span className="font-medium text-foreground">
                {selectedUser?.prenom} {selectedUser?.name || selectedUser?.email}
              </span>{" "}
              sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

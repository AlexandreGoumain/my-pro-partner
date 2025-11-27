"use client";

import { EmployeeFilters } from "@/components/personnel/employee-filters";
import {
    EmployeeQuickAdd,
    type QuickAddFormData,
} from "@/components/personnel/employee-quick-add";
import { EmployeeStatsCard } from "@/components/personnel/employee-stats-card";
import { EmployeeTable } from "@/components/personnel/employee-table";
import {
    EmployeeWizard,
    type WizardFormData,
} from "@/components/personnel/employee-wizard";
import {
    TechnicienQuickAdd,
    type TechnicienFormData,
} from "@/components/personnel/technicien-quick-add";
import { TechnicienTable } from "@/components/personnel/technicien-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { useCapabilities } from "@/hooks/use-capabilities";
import {
    useCreateEmployee,
    useDeleteEmployee,
    useEmployees,
    useEmployeesStats,
    useUpdateEmployee,
    type Employee,
} from "@/hooks/use-employees";
import { useFlotte } from "@/hooks/use-flotte";
import { useCreateTechnicien, useTechniciens } from "@/hooks/use-techniciens";
import type { EmployeeSortBy, SortOrder } from "@/lib/types/personnel.types";
import { formatCurrency } from "@/lib/utils/format";
import {
    Calendar,
    TrendingUp,
    UserCheck,
    Users,
    UserX,
    Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function PersonnelPage() {
    // Business type detection
    const { isIntervention, businessType, hasCapability } = useCapabilities();

    // Check if business has access to fleet management (camionnettes)
    const hasFlotteAccess = hasCapability("stock_camionnette");

    // Filters and sorting state
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<EmployeeSortBy>("dateEmbauche");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [statusFilter, setStatusFilter] = useState("all");
    const [contractFilter, setContractFilter] = useState("all");

    // Dialog state
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [technicienAddOpen, setTechnicienAddOpen] = useState(false);
    const [wizardOpen, setWizardOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
        null
    );

    // Hooks
    const { data: employees = [], isLoading: isLoadingEmployees } =
        useEmployees();
    const { data: techniciensData, isLoading: isLoadingTechniciens } =
        useTechniciens();
    const { data: stats, isLoading: isLoadingStats } = useEmployeesStats();
    const createEmployee = useCreateEmployee();
    const updateEmployee = useUpdateEmployee();
    const deleteEmployee = useDeleteEmployee();
    const createTechnicien = useCreateTechnicien();
    const { data: camionnettes = [] } = useFlotte({ enabled: hasFlotteAccess });

    // Get techniciens list from response
    const techniciens = techniciensData?.techniciens ?? [];

    // Get business-specific label for technicians
    const technicienLabel = useMemo(() => {
        switch (businessType) {
            case "PLOMBERIE":
                return "Plombier";
            case "CHAUFFAGE":
                return "Chauffagiste";
            case "ELECTRICITE":
                return "Électricien";
            case "MENUISERIE":
                return "Menuisier";
            case "PEINTURE":
                return "Peintre";
            case "MACONNERIE":
                return "Maçon";
            case "GARAGE":
                return "Mécanicien";
            default:
                return "Technicien";
        }
    }, [businessType]);

    // Filter and sort employees
    const filteredEmployees = useMemo(() => {
        let filtered = [...employees];

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(
                (emp) =>
                    emp.nom.toLowerCase().includes(searchLower) ||
                    emp.prenom.toLowerCase().includes(searchLower) ||
                    emp.email.toLowerCase().includes(searchLower) ||
                    emp.poste.toLowerCase().includes(searchLower) ||
                    emp.departement?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((emp) => emp.statut === statusFilter);
        }

        // Contract filter
        if (contractFilter !== "all") {
            filtered = filtered.filter(
                (emp) => emp.typeContrat === contractFilter
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal: string | number | Date;
            let bVal: string | number | Date;

            switch (sortBy) {
                case "nom":
                    aVal = a.nom;
                    bVal = b.nom;
                    break;
                case "prenom":
                    aVal = a.prenom;
                    bVal = b.prenom;
                    break;
                case "dateEmbauche":
                    aVal = new Date(a.dateEmbauche);
                    bVal = new Date(b.dateEmbauche);
                    break;
                case "poste":
                    aVal = a.poste;
                    bVal = b.poste;
                    break;
                case "departement":
                    aVal = a.departement || "";
                    bVal = b.departement || "";
                    break;
                case "salaireBrut":
                    aVal = Number(a.salaireBrut);
                    bVal = Number(b.salaireBrut);
                    break;
                default:
                    aVal = a.dateEmbauche;
                    bVal = b.dateEmbauche;
            }

            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [employees, search, statusFilter, contractFilter, sortBy, sortOrder]);

    // Handlers
    const handleOpenCreateDialog = () => {
        setSelectedEmployee(null);
        if (isIntervention) {
            setTechnicienAddOpen(true);
        } else {
            setQuickAddOpen(true);
        }
    };

    const handleOpenEditDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setWizardOpen(true);
    };

    const handleOpenDeleteDialog = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleSwitchToAdvanced = () => {
        setQuickAddOpen(false);
        setSelectedEmployee(null);
        setWizardOpen(true);
    };

    const handleTechnicienSubmit = async (data: TechnicienFormData) => {
        try {
            await createTechnicien.mutateAsync(data);
            toast.success(
                `${technicienLabel} ajouté - Invitation envoyée par email`
            );
            setTechnicienAddOpen(false);
        } catch (_error) {
            toast.error(
                `Erreur lors de l'ajout du ${technicienLabel.toLowerCase()}`
            );
        }
    };

    const handleQuickAddSubmit = async (data: QuickAddFormData) => {
        try {
            const formattedData = {
                ...data,
                dateEmbauche: new Date(data.dateEmbauche),
                // Default values for required fields
                statut: "ACTIF" as const,
                salaireBrut: 0,
                pays: "France",
                devise: "EUR",
                heuresHebdo: 35,
                congesRestants: 25,
                congesPris: 0,
            };

            await createEmployee.mutateAsync(formattedData);
            toast.success("Employé créé avec succès");
            setQuickAddOpen(false);
        } catch (_error) {
            toast.error("Erreur lors de la création de l'employé");
        }
    };

    const handleWizardSubmit = async (data: WizardFormData) => {
        try {
            const formattedData = {
                ...data,
                dateEmbauche: new Date(data.dateEmbauche),
                dateNaissance: data.dateNaissance
                    ? new Date(data.dateNaissance)
                    : undefined,
                dateFin: data.dateFin ? new Date(data.dateFin) : undefined,
            };

            if (selectedEmployee) {
                await updateEmployee.mutateAsync({
                    id: selectedEmployee.id,
                    data: formattedData,
                });
                toast.success("Employé modifié avec succès");
            } else {
                await createEmployee.mutateAsync(formattedData);
                toast.success("Employé créé avec succès");
            }
            setWizardOpen(false);
        } catch (_error) {
            toast.error(
                selectedEmployee
                    ? "Erreur lors de la modification de l'employé"
                    : "Erreur lors de la création de l'employé"
            );
        }
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;

        try {
            await deleteEmployee.mutateAsync(employeeToDelete.id);
            toast.success("Employé supprimé avec succès");
            setDeleteDialogOpen(false);
            setEmployeeToDelete(null);
        } catch (_error) {
            toast.error("Erreur lors de la suppression de l'employé");
        }
    };

    const isLoading = isIntervention
        ? isLoadingTechniciens || isLoadingStats
        : isLoadingEmployees || isLoadingStats;

    return (
        <div className="flex flex-col gap-8 p-8">
            <PageHeader
                title={
                    isIntervention ? "Équipe terrain" : "Gestion du Personnel"
                }
                description={
                    isIntervention
                        ? `Gérez vos ${technicienLabel.toLowerCase()}s et leurs affectations`
                        : "Vue d'ensemble et gestion de vos employés"
                }
                actions={
                    <PrimaryActionButton onClick={handleOpenCreateDialog}>
                        {isIntervention ? (
                            <>
                                <Wrench
                                    className="w-4 h-4 mr-2"
                                    strokeWidth={2}
                                />
                                Ajouter un {technicienLabel.toLowerCase()}
                            </>
                        ) : (
                            "Ajouter un employé"
                        )}
                    </PrimaryActionButton>
                }
            />

            {/* Stats Cards */}
            {!isLoadingStats && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <EmployeeStatsCard
                        title="Total employés"
                        value={stats.total}
                        subtitle={`${stats.actifs} actifs`}
                        icon={Users}
                    />
                    <EmployeeStatsCard
                        title="Employés actifs"
                        value={stats.actifs}
                        subtitle={`${((stats.actifs / stats.total) * 100).toFixed(0)}% de l'effectif`}
                        icon={UserCheck}
                    />
                    <EmployeeStatsCard
                        title="En congé"
                        value={stats.enConge}
                        subtitle={`${stats.inactifs} inactifs`}
                        icon={UserX}
                    />
                    <EmployeeStatsCard
                        title="Nouveaux (30j)"
                        value={stats.nouveaux30Jours}
                        subtitle="Derniers 30 jours"
                        icon={Calendar}
                    />
                    <EmployeeStatsCard
                        title="Salaire moyen"
                        value={formatCurrency(stats.salaireMoyen)}
                        subtitle={`Total: ${formatCurrency(stats.salaireTotal)}`}
                        icon={TrendingUp}
                    />
                </div>
            )}

            {/* Filters */}
            <EmployeeFilters
                search={search}
                setSearch={setSearch}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                contractFilter={contractFilter}
                setContractFilter={setContractFilter}
            />

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12 border border-black/[0.08] rounded-lg bg-white">
                    <div className="text-[14px] text-black/40">
                        Chargement...
                    </div>
                </div>
            ) : isIntervention ? (
                <TechnicienTable
                    techniciens={techniciens}
                    onEdit={(t) =>
                        handleOpenEditDialog(t as unknown as Employee)
                    }
                    onDelete={(t) =>
                        handleOpenDeleteDialog(t as unknown as Employee)
                    }
                    businessLabel={technicienLabel}
                    showVehicles={hasFlotteAccess}
                />
            ) : (
                <EmployeeTable
                    employees={filteredEmployees}
                    onEdit={handleOpenEditDialog}
                    onDelete={handleOpenDeleteDialog}
                />
            )}

            {/* Quick Add Dialog (standard employees) */}
            <EmployeeQuickAdd
                open={quickAddOpen}
                onOpenChange={setQuickAddOpen}
                onSubmit={handleQuickAddSubmit}
                onAdvancedMode={handleSwitchToAdvanced}
                isLoading={createEmployee.isPending}
            />

            {/* Technicien Quick Add Dialog (intervention businesses) */}
            <TechnicienQuickAdd
                open={technicienAddOpen}
                onOpenChange={setTechnicienAddOpen}
                onSubmit={handleTechnicienSubmit}
                camionnettes={camionnettes
                    .filter((c) => c.nom && c.immatriculation)
                    .map((c) => ({
                        id: c.id,
                        nom: c.nom!,
                        immatriculation: c.immatriculation,
                    }))}
                isLoading={createTechnicien.isPending}
                businessLabel={technicienLabel}
            />

            {/* Wizard Dialog (Edit or Advanced Create) */}
            <EmployeeWizard
                open={wizardOpen}
                onOpenChange={setWizardOpen}
                employee={selectedEmployee}
                onSubmit={handleWizardSubmit}
                isLoading={createEmployee.isPending || updateEmployee.isPending}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                title="Confirmer la suppression"
                description={`Êtes-vous sûr de vouloir supprimer l'employé ${employeeToDelete?.prenom} ${employeeToDelete?.nom} ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                isLoading={deleteEmployee.isPending}
            />
        </div>
    );
}

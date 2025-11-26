"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { EmployeeStatsCard } from "@/components/personnel/employee-stats-card";
import { EmployeeFilters } from "@/components/personnel/employee-filters";
import { EmployeeTable } from "@/components/personnel/employee-table";
import { TechnicienTable } from "@/components/personnel/technicien-table";
import { EmployeeQuickAdd, type QuickAddFormData } from "@/components/personnel/employee-quick-add";
import { EmployeeWizard, type WizardFormData } from "@/components/personnel/employee-wizard";
import { TechnicienQuickAdd, type TechnicienFormData } from "@/components/personnel/technicien-quick-add";
import {
    useEmployees,
    useEmployeesStats,
    useCreateEmployee,
    useUpdateEmployee,
    useDeleteEmployee,
    type Employee,
} from "@/hooks/use-employees";
import { useTechniciens, useCreateTechnicien } from "@/hooks/use-techniciens";
import { useFlotte } from "@/hooks/use-flotte";
import { useCapabilities } from "@/hooks/use-capabilities";
import { formatCurrency } from "@/lib/utils/format";
import { Users, UserCheck, UserX, Calendar, TrendingUp, Wrench } from "lucide-react";
import type { EmployeeSortBy, SortOrder } from "@/lib/types/personnel.types";
import { toast } from "sonner";
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
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    // Hooks
    const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees();
    const { data: techniciensData, isLoading: isLoadingTechniciens } = useTechniciens();
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
            filtered = filtered.filter((emp) => emp.typeContrat === contractFilter);
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
            toast.success(`${technicienLabel} ajouté - Invitation envoyée par email`);
            setTechnicienAddOpen(false);
        } catch (_error) {
            toast.error(`Erreur lors de l'ajout du ${technicienLabel.toLowerCase()}`);
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
                dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : undefined,
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {isIntervention ? "Équipe terrain" : "Gestion du Personnel"}
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        {isIntervention
                            ? `Gérez vos ${technicienLabel.toLowerCase()}s et leurs affectations`
                            : "Vue d'ensemble et gestion de vos employés"}
                    </p>
                </div>
                <Button
                    onClick={handleOpenCreateDialog}
                    className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                >
                    {isIntervention ? (
                        <>
                            <Wrench className="w-4 h-4 mr-2" strokeWidth={2} />
                            Ajouter un {technicienLabel.toLowerCase()}
                        </>
                    ) : (
                        "Ajouter un employé"
                    )}
                </Button>
            </div>

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
                    <div className="text-[14px] text-black/40">Chargement...</div>
                </div>
            ) : isIntervention ? (
                <TechnicienTable
                    techniciens={techniciens}
                    onEdit={(t) => handleOpenEditDialog(t as unknown as Employee)}
                    onDelete={(t) => handleOpenDeleteDialog(t as unknown as Employee)}
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
                    .filter(c => c.nom && c.immatriculation)
                    .map(c => ({
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
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                            Confirmer la suppression
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[14px] text-black/60">
                            Êtes-vous sûr de vouloir supprimer l&apos;employé{" "}
                            <span className="font-medium text-black">
                                {employeeToDelete?.prenom} {employeeToDelete?.nom}
                            </span>{" "}
                            ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-black/10 hover:bg-black/5">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-black hover:bg-black/90 text-white"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

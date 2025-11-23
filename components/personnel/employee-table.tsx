"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Employee } from "@/hooks/use-employees";
import { Mail, Phone, Pencil, Trash2 } from "lucide-react";
import { STATUT_LABELS, TYPE_CONTRAT_LABELS } from "@/lib/types/personnel.types";

export interface EmployeeTableProps {
    employees: Employee[];
    onEdit?: (employee: Employee) => void;
    onDelete?: (employee: Employee) => void;
}

/**
 * Get full name of employee
 */
function getEmployeeName(employee: Employee): string {
    return `${employee.prenom} ${employee.nom}`;
}

export function EmployeeTable({
    employees,
    onEdit,
    onDelete,
}: EmployeeTableProps) {
    if (employees.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-black/[0.08] rounded-lg bg-white">
                <div className="text-center">
                    <div className="text-[16px] font-medium text-black/70 mb-2">
                        Aucun employé
                    </div>
                    <p className="text-[14px] text-black/40">
                        Commencez par ajouter votre premier employé
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-black/[0.08] rounded-lg overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-black/[0.02] hover:bg-black/[0.02]">
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Nom
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Poste
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Département
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Statut
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Contrat
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Date d&apos;embauche
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70 text-right">
                            Salaire brut
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow
                            key={employee.id}
                            className="hover:bg-black/[0.02] transition-colors"
                        >
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-medium text-black">
                                        {getEmployeeName(employee)}
                                    </span>
                                    <div className="flex items-center gap-3 mt-1">
                                        {employee.email && (
                                            <a
                                                href={`mailto:${employee.email}`}
                                                className="flex items-center gap-1 text-[12px] text-black/40 hover:text-black/70 transition-colors"
                                            >
                                                <Mail className="h-3 w-3" strokeWidth={2} />
                                                {employee.email}
                                            </a>
                                        )}
                                        {employee.telephone && (
                                            <a
                                                href={`tel:${employee.telephone}`}
                                                className="flex items-center gap-1 text-[12px] text-black/40 hover:text-black/70 transition-colors"
                                            >
                                                <Phone className="h-3 w-3" strokeWidth={2} />
                                                {employee.telephone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-[14px] text-black/60">
                                {employee.poste}
                            </TableCell>
                            <TableCell className="text-[14px] text-black/60">
                                {employee.departement || "-"}
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded text-[12px] font-medium bg-black/[0.05] text-black/70">
                                    {STATUT_LABELS[employee.statut]}
                                </span>
                            </TableCell>
                            <TableCell className="text-[14px] text-black/60">
                                {TYPE_CONTRAT_LABELS[employee.typeContrat]}
                            </TableCell>
                            <TableCell className="text-[14px] text-black/60">
                                {formatDate(employee.dateEmbauche)}
                            </TableCell>
                            <TableCell className="text-right">
                                <span className="text-[14px] font-semibold text-black">
                                    {formatCurrency(Number(employee.salaireBrut))}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-black/10 hover:bg-black/5"
                                        onClick={() => onEdit?.(employee)}
                                    >
                                        <Pencil
                                            className="h-3.5 w-3.5"
                                            strokeWidth={2}
                                        />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-black/10 hover:bg-black/5 text-black/60 hover:text-black"
                                        onClick={() => onDelete?.(employee)}
                                    >
                                        <Trash2
                                            className="h-3.5 w-3.5"
                                            strokeWidth={2}
                                        />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

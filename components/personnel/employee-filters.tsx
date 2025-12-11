"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { EmployeeSortBy, SortOrder } from "@/lib/types/personnel.types";
import {
    STATUT_LABELS,
    TYPE_CONTRAT_LABELS,
} from "@/lib/types/personnel.types";
import { Search } from "lucide-react";

export interface EmployeeFiltersProps {
    search: string;
    setSearch: (search: string) => void;
    sortBy: EmployeeSortBy;
    setSortBy: (sort: EmployeeSortBy) => void;
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    contractFilter: string;
    setContractFilter: (contract: string) => void;
}

export function EmployeeFilters({
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    statusFilter,
    setStatusFilter,
    contractFilter,
    setContractFilter,
}: EmployeeFiltersProps) {
    return (
        <div className="group relative overflow-hidden flex flex-wrap items-center gap-4 p-4 border border-black/[0.08] rounded-lg bg-white hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex-1 min-w-[300px]">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
                        strokeWidth={2}
                    />
                    <Input
                        placeholder="Rechercher par nom, email, poste..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-9 border-black/10 bg-white"
                    />
                </div>
            </div>

            <div className="relative flex items-center gap-2">
                <span className="text-[14px] text-black/60 font-medium">
                    Statut:
                </span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] h-9 border-black/10 bg-white">
                        <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        {Object.entries(STATUT_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="relative flex items-center gap-2">
                <span className="text-[14px] text-black/60 font-medium">
                    Contrat:
                </span>
                <Select
                    value={contractFilter}
                    onValueChange={setContractFilter}
                >
                    <SelectTrigger className="w-[160px] h-9 border-black/10 bg-white">
                        <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        {Object.entries(TYPE_CONTRAT_LABELS).map(
                            ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            )
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="relative flex items-center gap-2">
                <span className="text-[14px] text-black/60 font-medium">
                    Trier par:
                </span>
                <Select
                    value={sortBy}
                    onValueChange={(value) =>
                        setSortBy(value as EmployeeSortBy)
                    }
                >
                    <SelectTrigger className="w-[160px] h-9 border-black/10 bg-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="nom">Nom</SelectItem>
                        <SelectItem value="prenom">Prénom</SelectItem>
                        <SelectItem value="dateEmbauche">
                            Date d&apos;embauche
                        </SelectItem>
                        <SelectItem value="poste">Poste</SelectItem>
                        <SelectItem value="departement">Département</SelectItem>
                        <SelectItem value="salaireBrut">Salaire</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative flex items-center gap-2">
                <span className="text-[14px] text-black/60 font-medium">
                    Ordre:
                </span>
                <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as SortOrder)}
                >
                    <SelectTrigger className="w-[140px] h-9 border-black/10 bg-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Croissant</SelectItem>
                        <SelectItem value="desc">Décroissant</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

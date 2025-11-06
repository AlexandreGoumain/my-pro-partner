"use client";

import { Input } from "@/components/ui/input";
import { Search, X, Grid, List } from "lucide-react";
import type { DocumentStatus } from "@/lib/types/document.types";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentFiltersBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: DocumentStatus | "TOUS";
    onStatusFilterChange: (status: DocumentStatus | "TOUS") => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    sortOptions: readonly string[];
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    documentType: "DEVIS" | "FACTURE" | "AVOIR";
    className?: string;
}

const STATUS_LABELS: Record<DocumentStatus, string> = {
    BROUILLON: "Brouillon",
    ENVOYE: "Envoyé",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    PAYE: "Payé",
    ANNULE: "Annulé",
};

const STATUS_COLORS: Record<DocumentStatus, string> = {
    BROUILLON: "bg-gray-100 text-gray-700 border-gray-200",
    ENVOYE: "bg-blue-100 text-blue-700 border-blue-200",
    ACCEPTE: "bg-green-100 text-green-700 border-green-200",
    REFUSE: "bg-red-100 text-red-700 border-red-200",
    PAYE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    ANNULE: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export function DocumentFiltersBar({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    sortBy,
    onSortChange,
    sortOptions,
    viewMode,
    onViewModeChange,
    documentType,
    className,
}: DocumentFiltersBarProps) {
    // Filtrer les statuts selon le type de document
    const availableStatuses: (DocumentStatus | "TOUS")[] =
        documentType === "DEVIS"
            ? ["TOUS", "BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "ANNULE"]
            : documentType === "FACTURE"
            ? ["TOUS", "BROUILLON", "ENVOYE", "PAYE", "ANNULE"]
            : ["TOUS", "BROUILLON", "ENVOYE", "ANNULE"];

    return (
        <div className="space-y-4">
            {/* Search bar + View toggle + Sort */}
            <div
                className={cn(
                    "flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg border",
                    className
                )}
            >
                <div className="flex flex-1 items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" strokeWidth={2} />
                        <Input
                            placeholder={`Rechercher par numéro ou client...`}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-9 h-11 text-[14px] border-black/10"
                        />
                        {searchTerm && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onSearchChange("")}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-black/5"
                            >
                                <X className="h-4 w-4 text-black/40" strokeWidth={2} />
                            </Button>
                        )}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-1 p-1 bg-background rounded-lg border">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("grid")}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("list")}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Sort */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Status filters */}
            <div className="flex flex-wrap gap-2">
                {availableStatuses.map((status) => {
                    const isSelected = statusFilter === status;
                    const label = status === "TOUS" ? "Tous" : STATUS_LABELS[status as DocumentStatus];
                    const colorClass = status === "TOUS"
                        ? "bg-black/5 text-black border-black/10"
                        : STATUS_COLORS[status as DocumentStatus];

                    return (
                        <Badge
                            key={status}
                            variant={isSelected ? "default" : "outline"}
                            className={`cursor-pointer px-3 py-1.5 text-[13px] font-medium transition-all ${
                                isSelected
                                    ? "bg-black text-white border-black shadow-sm"
                                    : `${colorClass} hover:opacity-80`
                            }`}
                            onClick={() => onStatusFilterChange(status)}
                        >
                            {label}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}

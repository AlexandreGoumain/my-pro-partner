"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { UnpaidInvoicesSortBy, SortOrder } from "@/lib/types/analytics";

export interface UnpaidInvoicesFiltersProps {
    sortBy: UnpaidInvoicesSortBy;
    setSortBy: (sort: UnpaidInvoicesSortBy) => void;
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
    overdueOnly: boolean;
    setOverdueOnly: (value: boolean) => void;
}

/**
 * Filters component for unpaid invoices page
 * Handles sorting and filtering options
 */
export function UnpaidInvoicesFilters({
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    overdueOnly,
    setOverdueOnly,
}: UnpaidInvoicesFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 p-4 border border-black/8 rounded-lg bg-white">
            <div className="flex items-center gap-2">
                <span className="text-[14px] text-black/60 font-medium">
                    Trier par:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] h-9 border-black/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dateEcheance">
                            Date d&apos;échéance
                        </SelectItem>
                        <SelectItem value="dateEmission">
                            Date d&apos;émission
                        </SelectItem>
                        <SelectItem value="reste_a_payer">
                            Montant
                        </SelectItem>
                        <SelectItem value="numero">
                            N° de facture
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[14px] text-black/60 font-medium">
                    Ordre:
                </span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[140px] h-9 border-black/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Croissant</SelectItem>
                        <SelectItem value="desc">Décroissant</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant={overdueOnly ? "default" : "outline"}
                    size="sm"
                    className={
                        overdueOnly
                            ? "bg-black hover:bg-black/90 text-white h-9 px-4 text-[13px] font-medium"
                            : "border-black/10 hover:bg-black/5 h-9 px-4 text-[13px] font-medium"
                    }
                    onClick={() => setOverdueOnly(!overdueOnly)}
                >
                    {overdueOnly ? "Toutes" : "En retard uniquement"}
                </Button>
            </div>
        </div>
    );
}

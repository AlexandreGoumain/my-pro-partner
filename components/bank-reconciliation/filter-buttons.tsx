import { Button } from "@/components/ui/button";
import type { FilterType } from "@/lib/types/bank-reconciliation";

export interface FilterButtonsProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export function FilterButtons({
    activeFilter,
    onFilterChange,
}: FilterButtonsProps) {
    return (
        <div className="flex gap-2">
            <Button
                onClick={() => onFilterChange("pending")}
                variant={activeFilter === "pending" ? "default" : "outline"}
                className={
                    activeFilter === "pending"
                        ? "bg-black hover:bg-black/90 h-11 px-6 text-[14px] font-medium"
                        : "border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                }
            >
                En attente
            </Button>
            <Button
                onClick={() => onFilterChange("all")}
                variant={activeFilter === "all" ? "default" : "outline"}
                className={
                    activeFilter === "all"
                        ? "bg-black hover:bg-black/90 h-11 px-6 text-[14px] font-medium"
                        : "border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                }
            >
                Toutes les transactions
            </Button>
        </div>
    );
}

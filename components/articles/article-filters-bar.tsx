import { CategoryFilter } from "@/components/categories/category-filter";
import { FilterBar } from "@/components/ui/filter-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ViewModeToggle } from "./view-mode-toggle";

export interface ArticleFiltersBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedCategoryIds: string[];
    onCategoryChange: (ids: string[]) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    sortOptions: readonly string[];
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    className?: string;
}

export function ArticleFiltersBar({
    searchTerm,
    onSearchChange,
    selectedCategoryIds,
    onCategoryChange,
    sortBy,
    onSortChange,
    sortOptions,
    viewMode,
    onViewModeChange,
    className,
}: ArticleFiltersBarProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden flex flex-col lg:flex-row gap-4 p-4 bg-white rounded-lg border border-black/[0.08] hover:shadow-lg hover:shadow-black/5 transition-all duration-300",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex flex-1 items-center gap-4">
                <FilterBar
                    filters={[
                        {
                            type: "search",
                            value: searchTerm,
                            onChange: onSearchChange,
                            placeholder:
                                "Rechercher par nom, référence ou description...",
                            className: "flex-1",
                        },
                    ]}
                    className="flex-1"
                />
                <ViewModeToggle
                    viewMode={viewMode}
                    onViewModeChange={onViewModeChange}
                />
            </div>
            <div className="relative flex flex-col sm:flex-row gap-2">
                <CategoryFilter
                    selectedCategoryIds={selectedCategoryIds}
                    onSelectionChange={onCategoryChange}
                />
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
    );
}

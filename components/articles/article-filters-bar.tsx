import { CategoryFilter } from "@/components/category-filter";
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
                "flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg border",
                className
            )}
        >
            <div className="flex flex-1 items-center gap-4">
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
            <div className="flex flex-col sm:flex-row gap-2">
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

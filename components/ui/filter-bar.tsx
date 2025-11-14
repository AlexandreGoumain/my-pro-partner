import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { SearchBar } from "./search-bar";

export type FilterConfig =
    | {
          type: "search";
          value: string;
          onChange: (value: string) => void;
          placeholder?: string;
          className?: string;
      }
    | {
          type: "select";
          value: string;
          onChange: (value: string) => void;
          placeholder?: string;
          label?: string;
          options: Array<{ value: string; label: string }>;
          className?: string;
      }
    | {
          type: "view-toggle";
          value: "grid" | "list";
          onChange: (value: "grid" | "list") => void;
          className?: string;
      };

export interface FilterBarProps {
    filters: FilterConfig[];
    className?: string;
}

export function FilterBar({ filters, className }: FilterBarProps) {
    return (
        <div className={cn("flex gap-3 flex-wrap items-center", className)}>
            {filters.map((filter, index) => {
                if (filter.type === "search") {
                    return (
                        <SearchBar
                            key={index}
                            value={filter.value}
                            onChange={filter.onChange}
                            placeholder={filter.placeholder}
                            className={filter.className}
                        />
                    );
                }

                if (filter.type === "select") {
                    return (
                        <Select
                            key={index}
                            value={filter.value}
                            onValueChange={filter.onChange}
                        >
                            <SelectTrigger
                                className={cn(
                                    "w-[200px] h-11 text-[14px] border-black/10 bg-white",
                                    filter.className
                                )}
                            >
                                <SelectValue
                                    placeholder={
                                        filter.placeholder || "Sélectionner"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="text-[14px]"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    );
                }

                if (filter.type === "view-toggle") {
                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center gap-1 border border-black/10 rounded-md p-1 bg-white",
                                filter.className
                            )}
                        >
                            <button
                                onClick={() => filter.onChange("grid")}
                                className={cn(
                                    "p-2 rounded transition-all duration-200",
                                    filter.value === "grid"
                                        ? "bg-black text-white"
                                        : "text-black/40 hover:bg-black/5"
                                )}
                            >
                                <LayoutGrid
                                    className="h-4 w-4"
                                    strokeWidth={2}
                                />
                            </button>
                            <button
                                onClick={() => filter.onChange("list")}
                                className={cn(
                                    "p-2 rounded transition-all duration-200",
                                    filter.value === "list"
                                        ? "bg-black text-white"
                                        : "text-black/40 hover:bg-black/5"
                                )}
                            >
                                <List className="h-4 w-4" strokeWidth={2} />
                            </button>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}

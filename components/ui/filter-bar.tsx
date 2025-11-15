import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { SearchBar } from "./search-bar";

export type FilterConfig =
    | {
          type: "search";
          value: string;
          onChange: (value: string) => void;
          placeholder?: string;
          className?: string;
          showClearButton?: boolean;
      }
    | {
          type: "select";
          value: string;
          onChange: (value: string) => void;
          placeholder?: string;
          label?: string;
          options: Array<{ value: string; label: string }>;
          className?: string;
          icon?: LucideIcon;
      }
    | {
          type: "view-toggle";
          value: "grid" | "list";
          onChange: (value: "grid" | "list") => void;
          className?: string;
      }
    | {
          type: "action";
          label: string;
          onClick: () => void;
          icon?: LucideIcon;
          variant?: "default" | "outline" | "ghost";
          className?: string;
      }
    | {
          type: "custom";
          component: ReactNode;
          className?: string;
      };

export interface FilterBarProps {
    filters: FilterConfig[];
    className?: string;
    /** Variante du wrapper */
    variant?: "none" | "card" | "muted";
    /** Grouper les filtres en début et fin */
    layout?: "default" | "space-between";
}

export function FilterBar({
    filters,
    className,
    variant = "none",
    layout = "default",
}: FilterBarProps) {
    const renderFilter = (filter: FilterConfig, index: number) => {
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
            const Icon = filter.icon;
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
                        {Icon && (
                            <Icon
                                className="h-4 w-4 mr-2 text-black/60"
                                strokeWidth={2}
                            />
                        )}
                        <SelectValue
                            placeholder={filter.placeholder || "Sélectionner"}
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
                        <LayoutGrid className="h-4 w-4" strokeWidth={2} />
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

        if (filter.type === "action") {
            const Icon = filter.icon;
            return (
                <Button
                    key={index}
                    onClick={filter.onClick}
                    variant={filter.variant || "default"}
                    className={cn(
                        "h-11 px-6 text-[14px] font-medium",
                        filter.variant === "default" &&
                            "bg-black hover:bg-black/90 text-white shadow-sm",
                        filter.className
                    )}
                >
                    {Icon && <Icon className="h-4 w-4 mr-2" strokeWidth={2} />}
                    {filter.label}
                </Button>
            );
        }

        if (filter.type === "custom") {
            return (
                <div key={index} className={filter.className}>
                    {filter.component}
                </div>
            );
        }

        return null;
    };

    const content = (
        <div
            className={cn(
                "flex gap-3 flex-wrap items-center",
                layout === "space-between" && "justify-between",
                variant === "muted" &&
                    "p-4 bg-black/2 rounded-lg border border-black/8",
                variant === "card" && "p-4",
                className
            )}
        >
            {filters.map((filter, index) => renderFilter(filter, index))}
        </div>
    );

    if (variant === "card") {
        return (
            <Card className="border-black/10 shadow-sm">
                <CardContent className="pt-6">{content}</CardContent>
            </Card>
        );
    }

    return content;
}

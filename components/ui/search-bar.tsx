import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";
import { Search } from "lucide-react";

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * SearchBar component
 *
 * Reusable search input with icon.
 * Uses Design System constants for consistent styling.
 */
export function SearchBar({
    value,
    onChange,
    placeholder = "Rechercher...",
    className,
}: SearchBarProps) {
    return (
        <div className={cn("relative max-w-md", className)}>
            <Search
                className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 bg-white",
                    DS.size.icon.small,
                    DS.color.text.tertiary
                )}
                strokeWidth={DS.size.icon.strokeWidth}
            />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "pl-10 h-11 bg-white",
                    DS.text.body.base,
                    DS.color.border.medium,
                    "focus-visible:ring-black/20"
                )}
            />
        </div>
    );
}

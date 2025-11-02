import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function ArticleSearchBar({
    searchTerm,
    onSearchChange,
    placeholder = "Rechercher par nom, référence ou description...",
    className,
}: ArticleSearchBarProps) {
    return (
        <div className={cn("flex-1 relative", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
            />
        </div>
    );
}

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface POSSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function POSSearchBar({
    value,
    onChange,
    placeholder = "Rechercher un article...",
}: POSSearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-10 h-11 border-black/10"
            />
        </div>
    );
}

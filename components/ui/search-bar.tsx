import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Rechercher...",
    className,
}: SearchBarProps) {
    return (
        <div className={cn("relative max-w-md", className)}>
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
                strokeWidth={2}
            />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 h-11 text-[14px] border-black/10 focus-visible:ring-black/20"
            />
        </div>
    );
}

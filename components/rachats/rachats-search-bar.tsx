import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface RachatsSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function RachatsSearchBar({ value, onChange }: RachatsSearchBarProps) {
    return (
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="relative p-6">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
                        strokeWidth={2}
                    />
                    <Input
                        placeholder="Rechercher par nom, référence ou numéro de série..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-10 h-11 border-black/10 focus:border-black/20 text-[14px]"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

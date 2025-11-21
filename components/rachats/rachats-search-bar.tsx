import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface RachatsSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function RachatsSearchBar({ value, onChange }: RachatsSearchBarProps) {
    return (
        <Card className="border-black/8 shadow-sm">
            <CardContent className="p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                    <Input
                        placeholder="Rechercher par nom, référence ou numéro de série..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-10 border-black/10 focus:border-black/20"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

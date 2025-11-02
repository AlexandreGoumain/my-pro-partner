import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";

export interface ClientSearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
}

export function ClientSearchBar({
    searchTerm,
    onSearchChange,
    viewMode,
    onViewModeChange,
}: ClientSearchBarProps) {
    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                            strokeWidth={2}
                        />
                        <Input
                            placeholder="Rechercher un client par nom, email ou téléphone..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 h-11 border-black/10 focus-visible:ring-black/20 text-[14px] placeholder:text-black/40"
                        />
                    </div>
                    <div className="flex gap-1 p-1 bg-black/2 rounded-lg border border-black/8">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("grid")}
                            className={
                                viewMode === "grid"
                                    ? "bg-black hover:bg-black/90 text-white h-9"
                                    : "hover:bg-black/5 h-9"
                            }
                        >
                            <Grid className="w-4 h-4" strokeWidth={2} />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => onViewModeChange("list")}
                            className={
                                viewMode === "list"
                                    ? "bg-black hover:bg-black/90 text-white h-9"
                                    : "hover:bg-black/5 h-9"
                            }
                        >
                            <List className="w-4 h-4" strokeWidth={2} />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

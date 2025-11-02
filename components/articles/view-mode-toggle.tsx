import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ViewModeToggleProps {
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
    className?: string;
}

export function ViewModeToggle({
    viewMode,
    onViewModeChange,
    className,
}: ViewModeToggleProps) {
    return (
        <div className={cn("flex gap-1 p-1 bg-background rounded-lg border", className)}>
            <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
            >
                <Grid className="w-4 h-4" />
            </Button>
            <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
            >
                <List className="w-4 h-4" />
            </Button>
        </div>
    );
}

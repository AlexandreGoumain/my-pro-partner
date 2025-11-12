import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Upload } from "lucide-react";

export interface EmptyStateProps {
    onImportClick: () => void;
    className?: string;
}

export function EmptyState({ onImportClick, className }: EmptyStateProps) {
    return (
        <Card className={cn("p-12 text-center border-black/8", className)}>
            <FileText className="h-12 w-12 text-black/20 mx-auto mb-3" />
            <h3 className="text-[18px] font-semibold text-black mb-2">
                Aucune transaction
            </h3>
            <p className="text-[14px] text-black/60 mb-4">
                Importez votre premier relevé bancaire pour commencer
            </p>
            <Button
                onClick={onImportClick}
                className="bg-black hover:bg-black/90 text-white"
            >
                <Upload className="h-4 w-4 mr-2" />
                Importer CSV
            </Button>
        </Card>
    );
}

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

export interface DocumentsEmptyStateProps {
    className?: string;
}

export function DocumentsEmptyState({ className }: DocumentsEmptyStateProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-12 text-center">
                <div className="rounded-full h-16 w-16 bg-black/5 flex items-center justify-center mx-auto mb-4">
                    <FileText
                        className="w-8 h-8 text-black/40"
                        strokeWidth={2}
                    />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                    Aucun document
                </h3>
                <p className="text-[14px] text-black/60">
                    Vos documents apparaîtront ici
                </p>
            </div>
        </Card>
    );
}

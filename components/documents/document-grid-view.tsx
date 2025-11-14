import { DocumentCard } from "./document-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DocumentGridViewProps<T> {
    documents: T[];
    isLoading: boolean;
    type: "DEVIS" | "FACTURE" | "AVOIR";
    onView: (doc: T) => void;
    onEdit: (doc: T) => void;
    onDelete: (doc: T) => void;
    onConvertToInvoice?: (doc: T) => void;
    onCreate: () => void;
    className?: string;
}

export function DocumentGridView<T extends {
    id: string;
    numero: string;
    dateEmission: Date;
    statut: "BROUILLON" | "ENVOYE" | "ACCEPTE" | "REFUSE" | "PAYE" | "ANNULE";
    client: { nom: string; prenom: string | null };
    total_ttc: number;
}>({
    documents,
    isLoading,
    type,
    onView,
    onEdit,
    onDelete,
    onConvertToInvoice,
    onCreate,
    className,
}: DocumentGridViewProps<T>) {
    if (isLoading) {
        return (
            <GridSkeleton
                itemCount={6}
                gridColumns={{ md: 2, lg: 3 }}
                gap={6}
                itemHeight="h-[400px]"
                className={className}
            />
        );
    }

    if (documents.length === 0) {
        return (
            <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-black/40" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-[20px] font-semibold tracking-[-0.01em] mb-2">
                            Aucun {type.toLowerCase()} trouvé
                        </h3>
                        <p className="text-[14px] text-black/60">
                            Commencez par créer votre premier {type.toLowerCase()}
                        </p>
                    </div>
                    <Button onClick={onCreate} className="mt-2">
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Créer un {type.toLowerCase()}
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div
            className={cn(
                "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {documents.map((document) => (
                <DocumentCard
                    key={document.id}
                    document={document}
                    type={type}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onConvertToInvoice={onConvertToInvoice}
                />
            ))}
        </div>
    );
}

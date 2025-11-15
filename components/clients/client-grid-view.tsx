import { ClientCard } from "@/components/client-card";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { GridPagination } from "@/app/(dashboard)/dashboard/clients/_components/grid-pagination";
import { Users } from "lucide-react";
import type { Client } from "@/hooks/use-clients";

export interface ClientGridViewProps {
    clients: Client[];
    isLoading: boolean;
    searchTerm: string;
    pagination: unknown;
    showPagination: boolean;
    onView: (client: Client) => void;
    onEdit: (client: Client) => void;
    onDelete: (client: Client) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onCreate: () => void;
}

export function ClientGridView({
    clients,
    isLoading,
    searchTerm,
    pagination,
    showPagination,
    onView,
    onEdit,
    onDelete,
    onPageChange,
    onPageSizeChange,
    onCreate,
}: ClientGridViewProps) {
    if (isLoading) {
        return (
            <GridSkeleton
                itemCount={8}
                gridColumns={{ md: 2, lg: 3, xl: 4 }}
                gap={4}
                itemSkeleton={<ArticleCardSkeleton />}
            />
        );
    }

    if (clients.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title={
                    searchTerm
                        ? "Aucun client trouvé"
                        : "Commencez votre portefeuille"
                }
                description={
                    searchTerm
                        ? "Aucun client ne correspond à votre recherche. Essayez avec d'autres termes."
                        : "Ajoutez votre premier client pour commencer à gérer votre base clients."
                }
                action={
                    !searchTerm
                        ? {
                              label: "Ajouter mon premier client",
                              onClick: onCreate,
                          }
                        : undefined
                }
                iconSize="lg"
            />
        );
    }

    return (
        <>
            <ResponsiveGrid columns={{ md: 2, lg: 3, xl: 4 }} gap={4}>
                {clients.map((client: Client) => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ResponsiveGrid>
            {showPagination && (
                <GridPagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            )}
        </>
    );
}

import { StoreCard } from "./store-card";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { type StoreDisplay } from "@/lib/types/store";
import { type Store } from "@/hooks/use-stores";

export interface StoresGridProps {
    stores: StoreDisplay[];
    onEdit?: (store: Store) => void;
}

export function StoresGrid({ stores, onEdit }: StoresGridProps) {
    return (
        <ResponsiveGrid columns={{ md: 2, lg: 3 }} gap={5}>
            {stores.map((store) => (
                <StoreCard
                    key={store.id}
                    store={store}
                    onEdit={onEdit ? () => onEdit(store as unknown as Store) : undefined}
                />
            ))}
        </ResponsiveGrid>
    );
}

import { StoreCard } from "./store-card";
import { type StoreDisplay } from "@/lib/types/store";
import { type Store } from "@/hooks/use-stores";

export interface StoresGridProps {
    stores: StoreDisplay[];
    onEdit?: (store: Store) => void;
}

export function StoresGrid({ stores, onEdit }: StoresGridProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
                <StoreCard
                    key={store.id}
                    store={store}
                    onEdit={onEdit ? () => onEdit(store as unknown as Store) : undefined}
                />
            ))}
        </div>
    );
}

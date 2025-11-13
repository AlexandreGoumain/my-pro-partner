/**
 * Skeleton de chargement pour la page clients
 *
 * Affiche un état de chargement pendant que les données sont récupérées.
 */
export function ClientsPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="h-9 w-48 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                </div>
                <div className="flex gap-3">
                    <div className="h-11 w-36 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-11 w-36 bg-black/5 rounded-md animate-pulse" />
                </div>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-24 bg-black/5 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}

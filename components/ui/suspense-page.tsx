import { PageSkeleton, PageSkeletonProps } from "@/components/ui/page-skeleton";
import { ReactNode, Suspense } from "react";

export interface SuspensePageProps {
    /**
     * Le contenu de la page à afficher une fois chargé
     */
    children: ReactNode;

    /**
     * Fallback personnalisé à afficher pendant le chargement
     * Si non fourni, utilise PageSkeleton avec les props skeletonProps
     */
    fallback?: ReactNode;

    /**
     * Props à passer au PageSkeleton par défaut
     * Ignoré si fallback est fourni
     */
    skeletonProps?: PageSkeletonProps;
}

/**
 * Composant réutilisable qui encapsule le pattern Suspense + Skeleton
 * Élimine la duplication du wrapper Suspense dans chaque page
 *
 * @example Utilisation basique avec skeleton par défaut
 * ```tsx
 * export default function ClientsPage() {
 *     return (
 *         <SuspensePage
 *             skeletonProps={{
 *                 layout: "stats",
 *                 headerActionsCount: 2,
 *                 statsCount: 4,
 *                 statsHeight: "h-24"
 *             }}
 *         >
 *             <ClientsPageContent />
 *         </SuspensePage>
 *     );
 * }
 * ```
 *
 * @example Utilisation avec fallback personnalisé
 * ```tsx
 * export default function CustomPage() {
 *     return (
 *         <SuspensePage fallback={<CustomSkeleton />}>
 *             <CustomPageContent />
 *         </SuspensePage>
 *     );
 * }
 * ```
 *
 * @example Utilisation avec layout stats-grid
 * ```tsx
 * export default function StoresPage() {
 *     return (
 *         <SuspensePage
 *             skeletonProps={{
 *                 layout: "stats-grid",
 *                 statsCount: 4,
 *                 gridColumns: 3,
 *                 itemCount: 6,
 *                 statsHeight: "h-[120px]",
 *                 itemHeight: "h-[240px]"
 *             }}
 *         >
 *             <StoresPageContent />
 *         </SuspensePage>
 *     );
 * }
 * ```
 */
export function SuspensePage({
    children,
    fallback,
    skeletonProps = { layout: "grid" },
}: SuspensePageProps) {
    // Si un fallback personnalisé est fourni, l'utiliser
    // Sinon, utiliser PageSkeleton avec les props fournies
    const defaultFallback = fallback || <PageSkeleton {...skeletonProps} />;

    return <Suspense fallback={defaultFallback}>{children}</Suspense>;
}

import { PageSkeleton, PageSkeletonProps } from "@/components/ui/page-skeleton";
import { ReactNode } from "react";

export interface ConditionalSkeletonProps {
    /**
     * État de chargement - affiche le skeleton si true
     */
    isLoading: boolean;

    /**
     * Le contenu à afficher une fois chargé
     */
    children: ReactNode;

    /**
     * Props à passer au PageSkeleton
     */
    skeletonProps: PageSkeletonProps;

    /**
     * Fallback personnalisé optionnel à la place du PageSkeleton
     */
    fallback?: ReactNode;
}

/**
 * Composant wrapper qui affiche un skeleton pendant le chargement
 * Élimine le pattern répétitif "if (isLoading) return <PageSkeleton />"
 *
 * @example Utilisation basique
 * ```tsx
 * function MyPageContent() {
 *     const { data, isLoading } = useMyData();
 *
 *     return (
 *         <ConditionalSkeleton
 *             isLoading={isLoading}
 *             skeletonProps={{
 *                 layout: "stats-grid",
 *                 statsCount: 4,
 *                 gridColumns: 3,
 *                 itemCount: 6
 *             }}
 *         >
 *             <div>Mon contenu chargé...</div>
 *         </ConditionalSkeleton>
 *     );
 * }
 * ```
 *
 * @example Avec fallback personnalisé
 * ```tsx
 * <ConditionalSkeleton
 *     isLoading={isLoading}
 *     skeletonProps={{ layout: "grid" }}
 *     fallback={<CustomLoader />}
 * >
 *     <MyContent />
 * </ConditionalSkeleton>
 * ```
 */
export function ConditionalSkeleton({
    isLoading,
    children,
    skeletonProps,
    fallback,
}: ConditionalSkeletonProps) {
    if (isLoading) {
        return fallback || <PageSkeleton {...skeletonProps} />;
    }

    return <>{children}</>;
}

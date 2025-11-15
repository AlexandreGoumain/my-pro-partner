import { PageHeader, PageHeaderProps } from "@/components/ui/page-header";
import { StatisticsGrid, StatConfig } from "@/components/ui/statistics-grid";
import { ReactNode } from "react";

export interface PageLayoutProps {
    header: PageHeaderProps;
    stats?: StatConfig[];
    statsColumns?: {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    statsGap?: number;
    filters?: ReactNode;
    children: ReactNode;
}

/**
 * Template de page standardisé avec Header + Stats optionnelles + Filtres optionnels + Contenu
 * Unifie le pattern répété dans 15+ pages de l'application
 *
 * @example
 * ```tsx
 * <PageLayout
 *   header={{
 *     title: "Gestion des clients",
 *     description: "Gérez vos clients et leur portefeuille",
 *     actions: <Button>Créer</Button>
 *   }}
 *   stats={[
 *     { icon: Users, label: "Total", value: 150 },
 *     { icon: TrendingUp, label: "Nouveaux", value: 12 }
 *   ]}
 *   statsColumns={{ md: 2, lg: 4 }}
 *   filters={<SearchBar />}
 * >
 *   <ClientGridView />
 * </PageLayout>
 * ```
 */
export function PageLayout({
    header,
    stats,
    statsColumns = { md: 2, lg: 4 },
    statsGap = 5,
    filters,
    children,
}: PageLayoutProps) {
    return (
        <div className="space-y-6">
            <PageHeader {...header} />

            {stats && stats.length > 0 && (
                <StatisticsGrid
                    stats={stats}
                    columns={statsColumns}
                    gap={statsGap}
                />
            )}

            {filters && <div>{filters}</div>}

            {children}
        </div>
    );
}

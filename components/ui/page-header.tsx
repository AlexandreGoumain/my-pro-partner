import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

export interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
    breadcrumbs?: BreadcrumbItem[];
    showHomeBreadcrumb?: boolean;
}

/**
 * PageHeader component
 *
 * Standardized page header with title, optional description, optional actions, and optional breadcrumbs.
 * Uses Design System constants for consistent styling.
 *
 * @example
 * <PageHeader
 *   title="Dashboard Clients"
 *   description="Vue d'ensemble et gestion de votre portefeuille clients"
 *   actions={<Button>Nouveau client</Button>}
 *   breadcrumbs={[
 *     { label: "Clients", href: "/dashboard/clients" },
 *     { label: "John Doe" }
 *   ]}
 * />
 */
export function PageHeader({
    title,
    description,
    actions,
    className,
    breadcrumbs,
    showHomeBreadcrumb = false,
}: PageHeaderProps) {
    return (
        <div className="space-y-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} showHome={showHomeBreadcrumb} />
            )}
            <div className={cn(DS.component.pageHeader.container, className)}>
                <div className={DS.component.pageHeader.titleSection}>
                    <h1 className={DS.component.pageHeader.title}>
                        {title}
                    </h1>
                    {description && (
                        <p className={cn(DS.component.pageHeader.description, "mt-1")}>
                            {description}
                        </p>
                    )}
                </div>
                {actions && <div className={DS.component.pageHeader.actions}>{actions}</div>}
            </div>
        </div>
    );
}

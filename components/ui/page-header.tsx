import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    className?: string;
}

/**
 * PageHeader component
 *
 * Standardized page header with title, optional description, and optional actions.
 * Uses Design System constants for consistent styling.
 *
 * @example
 * <PageHeader
 *   title="Dashboard Clients"
 *   description="Vue d'ensemble et gestion de votre portefeuille clients"
 *   actions={<Button>Nouveau client</Button>}
 * />
 */
export function PageHeader({
    title,
    description,
    actions,
    className,
}: PageHeaderProps) {
    return (
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
    );
}

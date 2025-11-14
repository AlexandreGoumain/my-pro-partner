import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface CardSectionProps {
    /** Titre de la section */
    title?: string;
    /** Description optionnelle sous le titre */
    description?: string;
    /** Nombre à afficher entre parenthèses après le titre (ex: "Employés (5)") */
    count?: number;
    /** Icône à afficher avant le titre */
    icon?: LucideIcon;
    /** Badge à afficher après le titre (peut être un string ou un ReactNode pour customisation) */
    badge?: string | ReactNode;
    /** Action/bouton à afficher à droite du header */
    action?: ReactNode;
    /** Contenu de la carte */
    children: ReactNode;
    /** Classes CSS personnalisées pour la Card */
    className?: string;
    /** Classes CSS personnalisées pour le CardHeader */
    headerClassName?: string;
    /** Classes CSS personnalisées pour le CardContent */
    contentClassName?: string;
    /** Classes CSS personnalisées pour le CardTitle */
    titleClassName?: string;
    /** Classes CSS personnalisées pour le CardDescription */
    descriptionClassName?: string;
}

/**
 * Composant CardSection - Card réutilisable avec header et contenu
 *
 * Unifie le pattern répété de Card avec CardHeader, CardTitle, CardDescription et CardContent.
 * Supporte les patterns complexes : icône, badge, action.
 *
 * @example
 * // Standard : Titre + description + count
 * <CardSection
 *   title="Employés"
 *   description="Liste de tous les employés de l'entreprise"
 *   count={users.length}
 * >
 *   {users.map(user => <UserItem key={user.id} user={user} />)}
 * </CardSection>
 *
 * @example
 * // Avec icône
 * <CardSection title="Utilisation" icon={Users}>
 *   <UsageIndicator />
 * </CardSection>
 *
 * @example
 * // Avec icône + badge
 * <CardSection
 *   title="Votre organisation"
 *   icon={FolderTree}
 *   badge={<Badge variant="secondary">2 niveaux max</Badge>}
 * >
 *   <CategoryTree />
 * </CardSection>
 *
 * @example
 * // Avec action à droite
 * <CardSection
 *   title="Mouvements de stock"
 *   description="Historique complet"
 *   action={
 *     <Button onClick={...}>
 *       <Plus className="h-4 w-4 mr-2" />
 *       Nouveau
 *     </Button>
 *   }
 * >
 *   <StockMovements />
 * </CardSection>
 */
export function CardSection({
    title,
    description,
    count,
    icon: Icon,
    badge,
    action,
    children,
    className,
    headerClassName,
    contentClassName,
    titleClassName,
    descriptionClassName,
}: CardSectionProps) {
    const hasHeader = title || description;
    const displayTitle = count !== undefined ? `${title} (${count})` : title;
    const hasAction = !!action;

    // Render du titre avec icône et/ou badge
    const renderTitle = () => {
        if (!title) return null;

        const titleContent = (
            <>
                {Icon && <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />}
                {displayTitle}
                {badge && (
                    typeof badge === "string" ? (
                        <Badge variant="secondary" className="text-xs font-normal">
                            {badge}
                        </Badge>
                    ) : (
                        badge
                    )
                )}
            </>
        );

        return (
            <CardTitle
                className={cn(
                    "text-[18px] font-semibold tracking-[-0.01em] text-black",
                    (Icon || badge) && "flex items-center gap-2",
                    titleClassName
                )}
            >
                {titleContent}
            </CardTitle>
        );
    };

    return (
        <Card className={cn("border-black/10", className)}>
            {hasHeader && (
                <CardHeader className={headerClassName}>
                    {hasAction ? (
                        // Layout avec action : flex justify-between
                        <div className="flex items-center justify-between">
                            <div>
                                {renderTitle()}
                                {description && (
                                    <CardDescription
                                        className={cn(
                                            "text-[14px] text-black/60",
                                            descriptionClassName
                                        )}
                                    >
                                        {description}
                                    </CardDescription>
                                )}
                            </div>
                            {action}
                        </div>
                    ) : (
                        // Layout standard : titre + description
                        <>
                            {renderTitle()}
                            {description && (
                                <CardDescription
                                    className={cn(
                                        "text-[14px] text-black/60",
                                        descriptionClassName
                                    )}
                                >
                                    {description}
                                </CardDescription>
                            )}
                        </>
                    )}
                </CardHeader>
            )}
            <CardContent className={contentClassName}>{children}</CardContent>
        </Card>
    );
}

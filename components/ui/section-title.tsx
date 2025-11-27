import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SectionTitleProps {
    /** Titre de la section */
    title: string;
    /** Description optionnelle */
    description?: string;
    /** Icône optionnelle */
    icon?: LucideIcon;
    /** Classe CSS pour la couleur de l'icône */
    iconClassName?: string;
    /** Actions à droite du titre */
    action?: React.ReactNode;
    /** Variante de taille */
    size?: "sm" | "md" | "lg";
    /** Classes CSS personnalisées */
    className?: string;
}

const sizeStyles = {
    sm: {
        title: "text-[16px]",
        description: "text-[12px]",
        icon: "w-4 h-4",
    },
    md: {
        title: "text-[18px]",
        description: "text-[13px]",
        icon: "w-4 h-4",
    },
    lg: {
        title: "text-[20px]",
        description: "text-[14px]",
        icon: "w-5 h-5",
    },
};

/**
 * SectionTitle - Composant pour les titres de sections
 *
 * Unifie le pattern répété de h2/h3 avec styling consistant.
 *
 * @example
 * // Simple
 * <SectionTitle title="Détails du client" />
 *
 * @example
 * // Avec icône
 * <SectionTitle title="En retard" icon={AlertTriangle} iconClassName="text-red-500" />
 *
 * @example
 * // Avec description
 * <SectionTitle title="Impayés" description="Liste des factures en retard" />
 *
 * @example
 * // Avec action
 * <SectionTitle
 *   title="Documents"
 *   action={<Button size="sm">Ajouter</Button>}
 * />
 */
export function SectionTitle({
    title,
    description,
    icon: Icon,
    iconClassName,
    action,
    size = "md",
    className,
}: SectionTitleProps) {
    const styles = sizeStyles[size];

    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="flex items-center gap-2">
                {Icon && (
                    <Icon
                        className={cn(
                            styles.icon,
                            iconClassName || "text-black/40"
                        )}
                        strokeWidth={2}
                    />
                )}
                <div>
                    <h2
                        className={cn(
                            "font-semibold tracking-[-0.01em] text-black",
                            styles.title
                        )}
                    >
                        {title}
                    </h2>
                    {description && (
                        <p
                            className={cn(
                                "text-black/40 mt-0.5",
                                styles.description
                            )}
                        >
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

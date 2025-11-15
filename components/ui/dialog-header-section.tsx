import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface DialogHeaderSectionProps {
    /**
     * Titre du dialogue
     */
    title: string;

    /**
     * Description optionnelle du dialogue
     */
    description?: string;

    /**
     * Classes CSS personnalisées pour le header
     */
    className?: string;

    /**
     * Classes CSS personnalisées pour le titre
     */
    titleClassName?: string;

    /**
     * Classes CSS personnalisées pour la description
     */
    descriptionClassName?: string;
}

/**
 * Composant réutilisable pour les headers de dialogues
 * Simplifie le pattern DialogHeader + DialogTitle + DialogDescription répété dans 28+ dialogues
 *
 * @example Utilisation basique
 * ```tsx
 * <DialogHeaderSection
 *     title="Créer un client"
 *     description="Ajoutez un nouveau client à votre base de données"
 * />
 * ```
 *
 * @example Sans description
 * ```tsx
 * <DialogHeaderSection title="Confirmer la suppression" />
 * ```
 *
 * @example Avec classes personnalisées
 * ```tsx
 * <DialogHeaderSection
 *     title="Titre important"
 *     description="Description détaillée"
 *     titleClassName="text-[18px]"
 *     descriptionClassName="text-black/50"
 * />
 * ```
 */
export function DialogHeaderSection({
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
}: DialogHeaderSectionProps) {
    return (
        <DialogHeader className={className}>
            <DialogTitle className={titleClassName}>{title}</DialogTitle>
            {description && (
                <DialogDescription className={descriptionClassName}>
                    {description}
                </DialogDescription>
            )}
        </DialogHeader>
    );
}

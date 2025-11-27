import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface MetadataFieldProps {
    /** Label text */
    label: string;
    /** Value to display (string or ReactNode for links) */
    value: ReactNode;
    /** Optional icon next to label */
    icon?: LucideIcon;
    /** Optional href to make value a link */
    href?: string;
    /** Link type for href (mailto, tel, or regular link) */
    linkType?: "mailto" | "tel" | "link";
    /** Additional className for container */
    className?: string;
    /** Whether to preserve whitespace in value */
    preserveWhitespace?: boolean;
}

/**
 * MetadataField - Displays a label above a value with consistent typography
 *
 * @example
 * // Simple usage
 * <MetadataField label="Nom" value="Jean Dupont" />
 *
 * @example
 * // With icon
 * <MetadataField label="Email" value="email@example.com" icon={Mail} />
 *
 * @example
 * // With link
 * <MetadataField
 *   label="Email"
 *   value="email@example.com"
 *   href="email@example.com"
 *   linkType="mailto"
 *   icon={Mail}
 * />
 */
export function MetadataField({
    label,
    value,
    icon: Icon,
    href,
    linkType,
    className,
    preserveWhitespace,
}: MetadataFieldProps) {
    const getLinkHref = () => {
        if (!href) return undefined;
        switch (linkType) {
            case "mailto":
                return `mailto:${href}`;
            case "tel":
                return `tel:${href}`;
            default:
                return href;
        }
    };

    const linkHref = getLinkHref();

    return (
        <div className={className}>
            <div className="text-[13px] font-medium text-black/40 mb-1 flex items-center gap-1">
                {Icon && <Icon className="h-3 w-3" />}
                {label}
            </div>
            {linkHref ? (
                <a
                    href={linkHref}
                    className="text-[14px] text-black hover:underline"
                >
                    {value}
                </a>
            ) : (
                <div
                    className={cn(
                        "text-[14px] text-black",
                        preserveWhitespace && "whitespace-pre-wrap"
                    )}
                >
                    {value}
                </div>
            )}
        </div>
    );
}

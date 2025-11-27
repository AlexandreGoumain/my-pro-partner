import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ContactInfoRowProps {
    /** Lucide icon component */
    icon: LucideIcon;
    /** Value to display */
    value: ReactNode;
    /** Optional href for clickable value */
    href?: string;
    /** Whether value should truncate */
    truncate?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * ContactInfoRow - Displays contact info with icon in a small box
 *
 * @example
 * <ContactInfoRow icon={Mail} value="email@example.com" />
 *
 * @example
 * // With link
 * <ContactInfoRow
 *   icon={Phone}
 *   value="06 12 34 56 78"
 *   href="tel:0612345678"
 * />
 */
export function ContactInfoRow({
    icon: Icon,
    value,
    href,
    truncate = false,
    className,
}: ContactInfoRowProps) {
    const content = href ? (
        <a
            href={href}
            className={cn(
                "text-[13px] text-black/70 hover:underline",
                truncate && "truncate flex-1"
            )}
        >
            {value}
        </a>
    ) : (
        <p
            className={cn(
                "text-[13px] text-black/70",
                truncate && "truncate flex-1"
            )}
        >
            {value}
        </p>
    );

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="flex items-center justify-center h-7 w-7 rounded-md bg-black/5 flex-shrink-0">
                <Icon className="h-3.5 w-3.5 text-black/60" strokeWidth={2} />
            </div>
            {content}
        </div>
    );
}

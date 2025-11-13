import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BackLinkProps {
    href: string;
    label?: string;
    className?: string;
}

/**
 * Back link component with ArrowLeft icon
 * Reusable component for navigation back links
 */
export function BackLink({
    href,
    label = "Retour",
    className,
}: BackLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center gap-2 text-[13px] text-black/60 hover:text-black transition-colors",
                className
            )}
        >
            <ArrowLeft className="w-4 h-4" />
            {label}
        </Link>
    );
}

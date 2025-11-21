import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
}

/**
 * Breadcrumbs component for navigation hierarchy
 *
 * @example
 * <Breadcrumbs
 *   items={[
 *     { label: "Clients", href: "/dashboard/clients" },
 *     { label: "John Doe" }
 *   ]}
 * />
 *
 * @example
 * // With home icon
 * <Breadcrumbs
 *   showHome
 *   items={[
 *     { label: "Analytics", href: "/dashboard/analytics" },
 *     { label: "Rentabilité" }
 *   ]}
 * />
 */
export function Breadcrumbs({
    items,
    className,
    showHome = false
}: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center gap-2 text-[13px]", className)}
        >
            {showHome && (
                <>
                    <Link
                        href="/dashboard"
                        className="text-black/40 hover:text-black transition-colors"
                    >
                        <Home className="h-4 w-4" strokeWidth={2} />
                    </Link>
                    <ChevronRight className="h-3 w-3 text-black/20" strokeWidth={2} />
                </>
            )}

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <Fragment key={index}>
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-black/60 hover:text-black transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={cn(
                                isLast
                                    ? "text-black font-medium"
                                    : "text-black/60"
                            )}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <ChevronRight
                                className="h-3 w-3 text-black/20"
                                strokeWidth={2}
                            />
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}

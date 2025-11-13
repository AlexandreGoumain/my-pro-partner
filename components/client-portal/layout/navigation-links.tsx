"use client";

import type { NavigationItem } from "@/lib/types/welcome";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationLinksProps {
    items: NavigationItem[];
    className?: string;
}

/**
 * Navigation links for client portal sidebar
 * Highlights active link based on current pathname
 */
export function NavigationLinks({ items, className }: NavigationLinksProps) {
    const pathname = usePathname();

    return (
        <nav className={`flex-1 p-4 space-y-1 ${className || ""}`}>
            {items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                            isActive
                                ? "bg-black text-white"
                                : "text-black/60 hover:bg-black/5 hover:text-black"
                        }`}
                    >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}

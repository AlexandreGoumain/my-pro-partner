"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { ResolvedNavigation } from "@/lib/navigation/core/types";

/**
 * Custom hook to get the current page title based on pathname and navigation
 */
export function usePageTitle(navigation: ResolvedNavigation | null): string {
  const pathname = usePathname();

  return useMemo(() => {
    if (!navigation) return "Tableau de bord";

    const currentItem = navigation.items.find(
      (item) =>
        item.href === pathname ||
        (item.items && item.items.some((subItem) => subItem.href === pathname))
    );

    if (!currentItem) return "Tableau de bord";

    // If it's a sub-item, try to find the sub-item label
    if (currentItem.items) {
      const subItem = currentItem.items.find((sub) => sub.href === pathname);
      if (subItem) return subItem.label;
    }

    return currentItem.label;
  }, [navigation, pathname]);
}

/**
 * Reusable hook for fetching categories
 * Eliminates 50+ lines of duplication across all dialog components
 */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface Category {
  id: string;
  nom: string;
  description?: string | null;
  parentId?: string | null;
}

export function useFetchCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>(ENDPOINTS.CATEGORIES),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

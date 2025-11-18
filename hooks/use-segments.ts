import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Segment,
  SegmentDisplay,
  CreateSegmentForm,
  UpdateSegmentForm,
  Client,
} from "@/lib/types";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

const API_BASE = "/api/segments";

// Create base hooks using factory
const segmentHooks = createResourceHooks<Segment>({
  resourceName: "segments",
  endpoint: "/api/segments",
});

// Export query keys
export const segmentKeys = segmentHooks.keys;

// Export base hooks from factory with custom wrapper for useSegments to support params
export function useSegments(params?: { type?: string; actif?: boolean }) {
  // Note: factory useList doesn't support custom params yet, so we keep custom implementation
  return useQuery({
    queryKey: ["segments", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.type) searchParams.set("type", params.type);
      if (params?.actif !== undefined) searchParams.set("actif", params.actif.toString());

      const response = await fetch(`${API_BASE}?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch segments");
      }
      return response.json();
    },
  });
}

export const useSegment = segmentHooks.useDetail;
export const useCreateSegment = () => segmentHooks.useCreate<CreateSegmentForm>();
export const useDeleteSegment = segmentHooks.useDelete;

// Custom update hook using PATCH instead of PUT
export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSegmentForm }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update segment");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      queryClient.invalidateQueries({ queryKey: ["segments", variables.id] });
    },
  });
}

// ============================================
// CUSTOM HOOKS SPECIFIC TO SEGMENTS
// ============================================

async function fetchSegmentClients(
  id: string,
  page = 1,
  limit = 50
): Promise<{ data: Client[]; total: number }> {
  const response = await fetch(
    `${API_BASE}/${id}/clients?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch segment clients");
  }

  return response.json();
}

async function seedSegments(): Promise<{
  created: number;
  skipped: number;
}> {
  const response = await fetch(`${API_BASE}/seed`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to seed segments");
  }

  return response.json();
}

async function exportSegment(
  id: string,
  format: "csv" | "json" = "csv"
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/${id}/export?format=${format}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to export segment");
  }

  return response.blob();
}

export function useSegmentClients(id: string, page = 1, limit = 50) {
  return useQuery({
    queryKey: ["segments", id, "clients", page, limit],
    queryFn: () => fetchSegmentClients(id, page, limit),
    enabled: !!id,
  });
}

export function useSeedSegments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seedSegments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
}

export function useExportSegment() {
  return useMutation({
    mutationFn: ({
      id,
      format,
    }: {
      id: string;
      format: "csv" | "json";
    }) => exportSegment(id, format),
    onSuccess: (blob, variables) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `segment-export-${new Date().toISOString().split("T")[0]}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}

// ============================================
// ANALYTICS & COMPARISON TYPES
// ============================================

interface SegmentComparisonResult {
  segments: Array<{ id: string; nom: string; count: number }>;
  overlap?: number;
  overlapPercentage?: number;
  uniqueToFirst?: number;
  uniqueToSecond?: number;
  overlapClientIds?: string[];
  uniqueToFirstIds?: string[];
  uniqueToSecondIds?: string[];
  pairwiseOverlaps?: Array<{
    segment1: string;
    segment2: string;
    overlap: number;
    overlapPercentage: number;
  }>;
  inAllSegments?: number;
  totalUniqueClients?: number;
}

interface SegmentAnalytics {
  segment: {
    id: string;
    nom: string;
    description: string | null;
    type: string;
  };
  summary: {
    totalClients: number;
    percentageOfBase: number;
    growth: number;
    newLast30Days: number;
  };
  demographics: {
    withEmail: number;
    withPhone: number;
    withAddress: number;
    withLoyaltyPoints: number;
    completionRate: number;
  };
  distribution: {
    topCities: Array<{ city: string; count: number }>;
    loyaltyBuckets: Array<{ range: string; count: number }>;
  };
  timeline: {
    monthly: Array<{ month: string; count: number }>;
    cumulative: Array<{ month: string; total: number }>;
  };
}

// ============================================
// ANALYTICS & COMPARISON
// ============================================

async function compareSegments(segmentIds: string[]): Promise<SegmentComparisonResult> {
  const response = await fetch("/api/segments/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ segmentIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to compare segments");
  }

  return response.json();
}

async function getSegmentAnalytics(id: string): Promise<SegmentAnalytics> {
  const response = await fetch(`/api/segments/${id}/analytics`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch analytics");
  }

  return response.json();
}

export function useCompareSegments() {
  return useMutation({
    mutationFn: compareSegments,
  });
}

export function useSegmentAnalytics(id: string) {
  return useQuery({
    queryKey: ["segments", id, "analytics"],
    queryFn: () => getSegmentAnalytics(id),
    enabled: !!id,
  });
}

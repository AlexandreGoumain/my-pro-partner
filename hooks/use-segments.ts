import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Segment,
  SegmentDisplay,
  CreateSegmentForm,
  UpdateSegmentForm,
} from "@/lib/types";

const API_BASE = "/api/segments";

// ============================================
// FETCH FUNCTIONS
// ============================================

async function fetchSegments(params?: {
  type?: string;
  actif?: boolean;
}): Promise<{ data: Segment[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);
  if (params?.actif !== undefined)
    searchParams.set("actif", params.actif.toString());

  const response = await fetch(`${API_BASE}?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch segments");
  }

  return response.json();
}

async function fetchSegmentById(id: string): Promise<Segment> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch segment");
  }

  return response.json();
}

async function fetchSegmentClients(
  id: string,
  page = 1,
  limit = 50
): Promise<{ data: any[]; total: number }> {
  const response = await fetch(
    `${API_BASE}/${id}/clients?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch segment clients");
  }

  return response.json();
}

async function createSegment(data: CreateSegmentForm): Promise<Segment> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create segment");
  }

  return response.json();
}

async function updateSegment(
  id: string,
  data: UpdateSegmentForm
): Promise<Segment> {
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
}

async function deleteSegment(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete segment");
  }
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

// ============================================
// REACT QUERY HOOKS
// ============================================

export function useSegments(params?: { type?: string; actif?: boolean }) {
  return useQuery({
    queryKey: ["segments", params],
    queryFn: () => fetchSegments(params),
  });
}

export function useSegment(id: string) {
  return useQuery({
    queryKey: ["segments", id],
    queryFn: () => fetchSegmentById(id),
    enabled: !!id,
  });
}

export function useSegmentClients(id: string, page = 1, limit = 50) {
  return useQuery({
    queryKey: ["segments", id, "clients", page, limit],
    queryFn: () => fetchSegmentClients(id, page, limit),
    enabled: !!id,
  });
}

export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
  });
}

export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSegmentForm }) =>
      updateSegment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      queryClient.invalidateQueries({ queryKey: ["segments", variables.id] });
    },
  });
}

export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segments"] });
    },
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
// ANALYTICS & COMPARISON
// ============================================

async function compareSegments(segmentIds: string[]): Promise<any> {
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

async function getSegmentAnalytics(id: string): Promise<any> {
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

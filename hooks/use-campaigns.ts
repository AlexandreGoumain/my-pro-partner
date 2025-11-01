import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/campaigns";

// ============================================
// TYPES
// ============================================

export interface Campaign {
  id: string;
  nom: string;
  description?: string;
  type: "EMAIL" | "SMS" | "NOTIFICATION";
  statut: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED";
  segmentId?: string;
  subject?: string;
  body?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  recipientsCount: number;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCampaignData {
  nom: string;
  description?: string;
  type?: "EMAIL" | "SMS" | "NOTIFICATION";
  segmentId?: string;
  subject?: string;
  body?: string;
  scheduledAt?: Date;
}

// ============================================
// FETCH FUNCTIONS
// ============================================

async function fetchCampaigns(): Promise<{ data: Campaign[]; total: number }> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch campaigns");
  }
  return response.json();
}

async function fetchCampaign(id: string): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch campaign");
  }
  return response.json();
}

async function createCampaign(data: CreateCampaignData): Promise<Campaign> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create campaign");
  }
  return response.json();
}

async function updateCampaign(
  id: string,
  data: Partial<CreateCampaignData>
): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update campaign");
  }
  return response.json();
}

async function deleteCampaign(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete campaign");
  }
}

async function scheduleCampaign(id: string, scheduledAt: Date): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/${id}/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scheduledAt }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to schedule campaign");
  }
  return response.json();
}

async function sendCampaign(id: string): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/${id}/send`, {
    method: "POST",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send campaign");
  }
  return response.json();
}

async function cancelCampaign(id: string): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/${id}/cancel`, {
    method: "POST",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to cancel campaign");
  }
  return response.json();
}

// ============================================
// HOOKS
// ============================================

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => fetchCampaign(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCampaignData> }) =>
      updateCampaign(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", variables.id] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useScheduleCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: Date }) =>
      scheduleCampaign(id, scheduledAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useSendCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useCancelCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

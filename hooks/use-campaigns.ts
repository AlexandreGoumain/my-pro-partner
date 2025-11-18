import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

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

// Create base hooks using factory
const campaignHooks = createResourceHooks<Campaign>({
  resourceName: "campaigns",
  endpoint: "/api/campaigns",
});

// Export query keys
export const campaignKeys = campaignHooks.keys;

// Export base hooks from factory
export const useCampaigns = campaignHooks.useList;
export const useCampaign = campaignHooks.useDetail;
export const useCreateCampaign = () => campaignHooks.useCreate<CreateCampaignData>();
export const useDeleteCampaign = campaignHooks.useDelete;

// Custom update hook using PATCH instead of PUT
export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCampaignData> }) => {
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
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", variables.id] });
    },
  });
}

// ============================================
// CUSTOM HOOKS SPECIFIC TO CAMPAIGNS
// ============================================

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

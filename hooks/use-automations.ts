import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

const API_BASE = "/api/automations";

// ============================================
// TYPES
// ============================================

// Configuration for automation triggers and actions
export interface TriggerConfig {
  // For EVENT_OCCURRED triggers
  event?: string;
  // For DATE_CONDITION triggers
  dateField?: string;
  operator?: string;
  value?: number | string;
  // For CLIENT_SEGMENT triggers
  segmentId?: string;
  // For LOYALTY_POINTS triggers
  threshold?: number;
  // Additional dynamic fields
  [key: string]: unknown;
}

export interface ActionConfig {
  // For SEND_EMAIL actions
  templateId?: string;
  subject?: string;
  body?: string;
  // For ADD_TO_SEGMENT actions
  segmentId?: string;
  // For UPDATE_FIELD actions
  field?: string;
  value?: string | number;
  // For SEND_NOTIFICATION actions
  title?: string;
  message?: string;
  // Additional dynamic fields
  [key: string]: unknown;
}

export interface Automation {
  id: string;
  nom: string;
  description?: string;
  actif: boolean;
  triggerType: string;
  triggerConfig: TriggerConfig;
  actionType: string;
  actionConfig: ActionConfig;
  derniereExecution?: Date;
  nombreExecutions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAutomationData {
  nom: string;
  description?: string;
  triggerType: string;
  triggerConfig: TriggerConfig;
  actionType: string;
  actionConfig: ActionConfig;
  actif?: boolean;
}

// Create base hooks using factory
const automationHooks = createResourceHooks<Automation>({
  resourceName: "automations",
  endpoint: "/api/automations",
});

// Export query keys
export const automationKeys = automationHooks.keys;

// Export base hooks from factory
export const useAutomations = automationHooks.useList;
export const useAutomation = automationHooks.useDetail;
export const useCreateAutomation = () => automationHooks.useCreate<CreateAutomationData>();
export const useDeleteAutomation = automationHooks.useDelete;

// Custom update hook using PATCH instead of PUT
export function useUpdateAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAutomationData> }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update automation");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      queryClient.invalidateQueries({ queryKey: ["automations", variables.id] });
    },
  });
}

// ============================================
// CUSTOM HOOKS SPECIFIC TO AUTOMATIONS
// ============================================

async function updateAutomation(
  id: string,
  data: Partial<CreateAutomationData>
): Promise<Automation> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update automation");
  }
  return response.json();
}

async function toggleAutomation(id: string, actif: boolean): Promise<Automation> {
  return updateAutomation(id, { actif });
}

export function useToggleAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actif }: { id: string; actif: boolean }) =>
      toggleAutomation(id, actif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
  });
}

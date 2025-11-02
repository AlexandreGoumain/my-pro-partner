import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// ============================================
// FETCH FUNCTIONS
// ============================================

async function fetchAutomations(): Promise<{ data: Automation[]; total: number }> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch automations");
  }
  return response.json();
}

async function fetchAutomation(id: string): Promise<Automation> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch automation");
  }
  return response.json();
}

async function createAutomation(data: CreateAutomationData): Promise<Automation> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create automation");
  }
  return response.json();
}

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

async function deleteAutomation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete automation");
  }
}

async function toggleAutomation(id: string, actif: boolean): Promise<Automation> {
  return updateAutomation(id, { actif });
}

// ============================================
// HOOKS
// ============================================

export function useAutomations() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: fetchAutomations,
  });
}

export function useAutomation(id: string) {
  return useQuery({
    queryKey: ["automations", id],
    queryFn: () => fetchAutomation(id),
    enabled: !!id,
  });
}

export function useCreateAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
  });
}

export function useUpdateAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAutomationData> }) =>
      updateAutomation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
      queryClient.invalidateQueries({ queryKey: ["automations", variables.id] });
    },
  });
}

export function useDeleteAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAutomation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations"] });
    },
  });
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

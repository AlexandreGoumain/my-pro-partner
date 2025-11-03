import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { CompanySettings } from "@/lib/types/settings";

// Query Keys
export const companySettingsKeys = {
    all: ["company-settings"] as const,
};

// Hook pour récupérer les paramètres de l'entreprise
export function useCompanySettings() {
    return useQuery({
        queryKey: companySettingsKeys.all,
        queryFn: async () => {
            const result = await api.get<{ settings: CompanySettings }>("/api/settings/company");
            return result.settings;
        },
    });
}

// Hook pour mettre à jour les paramètres de l'entreprise
export function useUpdateCompanySettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: CompanySettings) =>
            api.put<{ settings: CompanySettings }>("/api/settings/company", settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: companySettingsKeys.all });
        },
    });
}

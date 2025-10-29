"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Avec ces options, les données sont mises en cache et réutilisées
                        staleTime: 60 * 1000, // Les données sont considérées comme fraîches pendant 1 minute
                        gcTime: 5 * 60 * 1000, // Les données inactives sont gardées en cache 5 minutes
                        refetchOnWindowFocus: false, // Ne pas refetch automatiquement au focus
                        retry: 1, // Réessayer 1 fois en cas d'erreur
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

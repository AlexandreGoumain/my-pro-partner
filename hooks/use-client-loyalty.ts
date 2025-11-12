import type { ClientLoyaltyData } from "@/lib/types/loyalty";
import { useEffect, useState } from "react";

interface UseClientLoyaltyReturn {
    data: ClientLoyaltyData | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useClientLoyalty(): UseClientLoyaltyReturn {
    const [data, setData] = useState<ClientLoyaltyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchLoyaltyData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem("clientToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const res = await fetch("/api/client/loyalty", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch loyalty data: ${res.status}`);
            }

            const loyaltyData = await res.json();
            setData(loyaltyData);
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error("Failed to fetch loyalty data");
            setError(error);
            console.error("Failed to fetch loyalty data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLoyaltyData();
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch: fetchLoyaltyData,
    };
}

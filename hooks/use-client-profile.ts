import type { ClientProfile, ClientProfileUpdate } from "@/lib/types/profile";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseClientProfileReturn {
    profile: ClientProfile | null;
    isLoading: boolean;
    isSaving: boolean;
    error: Error | null;
    updateProfile: (data: ClientProfileUpdate) => Promise<void>;
    refetch: () => Promise<void>;
}

export function useClientProfile(): UseClientProfileReturn {
    const [profile, setProfile] = useState<ClientProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem("clientToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const res = await fetch("/api/client/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch profile: ${res.status}`);
            }

            const data = await res.json();
            setProfile(data.client);
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error("Failed to fetch profile");
            setError(error);
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (data: ClientProfileUpdate) => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const res = await fetch("/api/client/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error(`Failed to update profile: ${res.status}`);
            }

            toast.success("Profil mis à jour avec succès");
            await fetchProfile(); // Refresh profile data
        } catch (err) {
            toast.error("Erreur lors de la mise à jour");
            console.error("Failed to update profile:", err);
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        isLoading,
        isSaving,
        error,
        updateProfile,
        refetch: fetchProfile,
    };
}

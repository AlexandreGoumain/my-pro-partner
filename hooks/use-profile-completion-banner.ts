import { CLIENT_STORAGE_KEYS } from "@/lib/constants/client-storage";
import { DashboardClient } from "@/lib/types/dashboard";
import { useCallback, useEffect, useState } from "react";

interface UseProfileCompletionBannerReturn {
    showBanner: boolean;
    dismissBanner: () => void;
}

export function useProfileCompletionBanner(
    client: DashboardClient | undefined
): UseProfileCompletionBannerReturn {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (!client) {
            setShowBanner(false);
            return;
        }

        const hasIncompleteProfile = !client.telephone || !client.adresse;
        const hasSeenBanner = localStorage.getItem(
            CLIENT_STORAGE_KEYS.PROFILE_BANNER_DISMISSED
        );

        setShowBanner(hasIncompleteProfile && !hasSeenBanner);
    }, [client]);

    const dismissBanner = useCallback(() => {
        localStorage.setItem(
            CLIENT_STORAGE_KEYS.PROFILE_BANNER_DISMISSED,
            "true"
        );
        setShowBanner(false);
    }, []);

    return {
        showBanner,
        dismissBanner,
    };
}

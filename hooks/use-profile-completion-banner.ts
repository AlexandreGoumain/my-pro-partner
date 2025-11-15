import { CLIENT_STORAGE_KEYS } from "@/lib/constants/client-storage";
import { DashboardClient } from "@/lib/types/dashboard";
import { useCallback, useMemo, useState } from "react";

interface UseProfileCompletionBannerReturn {
    showBanner: boolean;
    dismissBanner: () => void;
}

export function useProfileCompletionBanner(
    client: DashboardClient | undefined
): UseProfileCompletionBannerReturn {
    const [isDismissed, setIsDismissed] = useState(false);

    // Calculate showBanner directly with useMemo instead of useEffect
    const showBanner = useMemo(() => {
        if (!client || isDismissed) return false;

        const hasIncompleteProfile = !client.telephone || !client.adresse;
        const hasSeenBanner = localStorage.getItem(
            CLIENT_STORAGE_KEYS.PROFILE_BANNER_DISMISSED
        );

        return hasIncompleteProfile && !hasSeenBanner;
    }, [client, isDismissed]);

    const dismissBanner = useCallback(() => {
        localStorage.setItem(
            CLIENT_STORAGE_KEYS.PROFILE_BANNER_DISMISSED,
            "true"
        );
        setIsDismissed(true);
    }, []);

    return {
        showBanner,
        dismissBanner,
    };
}

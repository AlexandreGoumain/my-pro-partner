import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useConfetti } from "./use-confetti";

export interface UseSubscriptionSuccessReturn {
    verified: boolean;
    sessionId: string | null;
    handleVerified: () => Promise<void>;
}

/**
 * Custom hook for managing subscription success page logic
 * Handles session verification, confetti animation, and NextAuth session update
 *
 * @returns Subscription success state and handlers
 */
export function useSubscriptionSuccess(): UseSubscriptionSuccessReturn {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { update: updateSession } = useSession();
    const [verified, setVerified] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Configure confetti animations
    useConfetti(verified, [
        {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            delay: 300,
        },
        {
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#000000", "#333333", "#666666"],
            delay: 600,
        },
        {
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#000000", "#333333", "#666666"],
            delay: 900,
        },
    ]);

    // Extract session_id from URL on mount
    useEffect(() => {
        const session_id = searchParams.get("session_id");

        if (session_id) {
            setSessionId(session_id);
        } else {
            // No session_id, redirect to pricing after delay
            const timer = setTimeout(() => {
                router.push("/pricing");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [searchParams, router]);

    // Handle verification complete
    const handleVerified = useCallback(async () => {
        // Refresh NextAuth session to get updated subscription data
        await updateSession();
        setVerified(true);
    }, [updateSession]);

    return {
        verified,
        sessionId,
        handleVerified,
    };
}

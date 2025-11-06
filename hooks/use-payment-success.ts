import { useEffect, useState } from "react";

interface UsePaymentSuccessReturn {
    isLoading: boolean;
}

/**
 * Custom hook for payment success page
 * Manages loading state with delay to allow webhook processing
 *
 * @param delay Delay in milliseconds before showing success (default: 2000ms)
 * @returns Loading state
 */
export function usePaymentSuccess(delay: number = 2000): UsePaymentSuccessReturn {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Small delay to allow webhook to process the payment
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return {
        isLoading,
    };
}

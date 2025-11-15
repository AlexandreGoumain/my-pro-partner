import { useEffect, useState } from "react";

/**
 * Custom hook to track scroll position
 * @param threshold - The scroll position threshold to trigger the scrolled state (default: 20)
 * @returns boolean indicating if user has scrolled past the threshold
 */
export function useScroll(threshold: number = 20): boolean {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > threshold);
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrolled;
}

import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { ConfettiConfig } from "@/lib/types/subscription";

/**
 * Custom hook for triggering confetti animations
 * Handles cleanup of timers on unmount
 *
 * @param trigger - Boolean to trigger the confetti effect
 * @param configs - Array of confetti configurations with optional delays
 */
export function useConfetti(
    trigger: boolean,
    configs: Array<ConfettiConfig & { delay?: number }> = []
) {
    useEffect(() => {
        if (!trigger) return;

        const timers: NodeJS.Timeout[] = [];

        configs.forEach((config) => {
            const timer = setTimeout(() => {
                confetti({
                    particleCount: config.particleCount,
                    spread: config.spread,
                    angle: config.angle,
                    origin: config.origin,
                    colors: config.colors || ["#000000", "#333333", "#666666", "#999999"],
                });
            }, config.delay || 0);

            timers.push(timer);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [trigger, configs]);
}

import { LucideIcon } from "lucide-react";

/**
 * Types for subscription success page
 */

export interface TimelineStepProps {
    number: number;
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
}

export interface BenefitItemProps {
    icon: LucideIcon;
    text: string;
}

export interface ConfettiConfig {
    particleCount: number;
    spread: number;
    angle?: number;
    origin?: {
        x?: number;
        y?: number;
    };
    colors?: string[];
}

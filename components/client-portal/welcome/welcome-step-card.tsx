import { Card } from "@/components/ui/card";
import type { WelcomeStep } from "@/lib/types/welcome";

interface WelcomeStepCardProps {
    step: WelcomeStep;
    className?: string;
}

/**
 * Card component displaying a single welcome/onboarding step
 * Shows icon, title, description and detailed information
 */
export function WelcomeStepCard({ step, className }: WelcomeStepCardProps) {
    const Icon = step.icon;

    return (
        <Card className={`border-black/8 shadow-sm ${className || ""}`}>
            <div className="p-8 sm:p-12">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div className="h-20 w-20 rounded-2xl bg-black/5 flex items-center justify-center">
                        <Icon
                            className="h-10 w-10 text-black/80"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                    <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-black">
                        {step.title}
                    </h1>
                    <p className="text-[17px] sm:text-[19px] text-black/80 leading-relaxed">
                        {step.description}
                    </p>
                    <p className="text-[15px] text-black/50 leading-relaxed max-w-md mx-auto">
                        {step.detail}
                    </p>
                </div>
            </div>
        </Card>
    );
}

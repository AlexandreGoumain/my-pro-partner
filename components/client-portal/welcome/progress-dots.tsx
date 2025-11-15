interface ProgressDotsProps {
    totalSteps: number;
    currentStep: number;
    className?: string;
}

/**
 * Progress dots indicator for multi-step flows
 * Shows current step with visual feedback
 */
export function ProgressDots({
    totalSteps,
    currentStep,
    className,
}: ProgressDotsProps) {
    return (
        <div className={`flex justify-center gap-2 ${className || ""}`}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                            ? "w-8 bg-black"
                            : index < currentStep
                              ? "w-2 bg-black/40"
                              : "w-2 bg-black/10"
                    }`}
                />
            ))}
        </div>
    );
}

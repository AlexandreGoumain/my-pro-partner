import { cn } from "@/lib/utils";
import { CheckCircle2, LucideIcon } from "lucide-react";

export interface StepConfig {
    /** Step ID (number) */
    id: number;
    /** Step name/label */
    name: string;
    /** Step icon */
    icon: LucideIcon;
}

export interface StepperIndicatorProps {
    /** Array of step configurations */
    steps: StepConfig[];
    /** Current active step ID */
    currentStep: number;
    /** Additional className */
    className?: string;
}

/**
 * StepperIndicator - Multi-step progress indicator for wizards
 *
 * @example
 * const steps = [
 *   { id: 1, name: "Client", icon: User },
 *   { id: 2, name: "Détails", icon: FileText },
 *   { id: 3, name: "Confirmation", icon: Check },
 * ];
 *
 * <StepperIndicator steps={steps} currentStep={2} />
 */
export function StepperIndicator({
    steps,
    currentStep,
    className,
}: StepperIndicatorProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-2 py-4",
                className
            )}
        >
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const Icon = step.icon;

                return (
                    <div key={step.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                    isCompleted || isActive
                                        ? "bg-black text-white"
                                        : "bg-black/5 text-black/40"
                                )}
                            >
                                {isCompleted ? (
                                    <CheckCircle2
                                        className="w-5 h-5"
                                        strokeWidth={2}
                                    />
                                ) : (
                                    <Icon className="w-5 h-5" strokeWidth={2} />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-[12px] font-medium",
                                    isActive || isCompleted
                                        ? "text-black"
                                        : "text-black/40"
                                )}
                            >
                                {step.name}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-[2px] mx-4 mt-[-20px]",
                                    isCompleted ? "bg-black" : "bg-black/10"
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

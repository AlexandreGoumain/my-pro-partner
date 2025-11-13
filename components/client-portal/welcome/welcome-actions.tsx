import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeActionsProps {
    isLastStep: boolean;
    onNext: () => void;
    onSkip: () => void;
    className?: string;
}

/**
 * Action buttons for welcome flow navigation
 * Includes Continue/Finish button and Skip option
 */
export function WelcomeActions({
    isLastStep,
    onNext,
    onSkip,
    className,
}: WelcomeActionsProps) {
    return (
        <div className={`space-y-3 ${className || ""}`}>
            <Button
                onClick={onNext}
                className="w-full h-12 text-[15px] font-medium bg-black hover:bg-black/90 text-white rounded-lg shadow-sm"
            >
                {isLastStep ? (
                    <>
                        Accéder à mon espace
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                ) : (
                    <>
                        Continuer
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>

            {!isLastStep && (
                <button
                    onClick={onSkip}
                    className="w-full h-11 text-[14px] text-black/50 hover:text-black/80 transition-colors"
                >
                    Passer l&apos;introduction
                </button>
            )}
        </div>
    );
}

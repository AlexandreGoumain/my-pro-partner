import { Button } from "@/components/ui/button";

export interface GuideActionsProps {
    isLastTip: boolean;
    onDismiss: () => void;
    onNext: () => void;
}

/**
 * Action buttons for navigating through the guide
 */
export function GuideActions({
    isLastTip,
    onDismiss,
    onNext,
}: GuideActionsProps) {
    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={onDismiss}
                className="flex-1 h-11 text-[14px] font-medium border-black/10 hover:bg-black/5"
            >
                Passer
            </Button>
            <Button
                onClick={onNext}
                className="flex-1 h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
            >
                {isLastTip ? "Compris !" : "Suivant"}
            </Button>
        </div>
    );
}

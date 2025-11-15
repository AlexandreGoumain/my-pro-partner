import { Lightbulb, X } from "lucide-react";

export interface GuideHeaderProps {
    currentTip: number;
    totalTips: number;
    onDismiss: () => void;
}

/**
 * Header section of the guide with tip counter and close button
 */
export function GuideHeader({
    currentTip,
    totalTips,
    onDismiss,
}: GuideHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                    <Lightbulb
                        className="h-5 w-5 text-black/60"
                        strokeWidth={2}
                    />
                </div>
                <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                        Conseil {currentTip + 1}/{totalTips}
                    </h3>
                    <p className="text-[13px] text-black/50">
                        Pour bien démarrer
                    </p>
                </div>
            </div>
            <button
                onClick={onDismiss}
                className="p-1 rounded-md hover:bg-black/5 transition-colors"
                aria-label="Fermer"
            >
                <X className="h-4 w-4 text-black/40" />
            </button>
        </div>
    );
}

"use client";

import { Card } from "@/components/ui/card";
import { useFirstTimeGuide } from "@/hooks/use-first-time-guide";
import { GuideActions } from "./guide-actions";
import { GuideContent } from "./guide-content";
import { GuideHeader } from "./guide-header";
import { GuideOverlay } from "./guide-overlay";
import { GuideProgress } from "./guide-progress";

export interface FirstTimeGuideProps {
    userName?: string;
}

/**
 * First-time user guide overlay
 * Shows helpful tips for new users after onboarding
 * Can be dismissed permanently
 */
export function FirstTimeGuide({ userName }: FirstTimeGuideProps) {
    const {
        isVisible,
        currentTip,
        tips,
        isLastTip,
        handleDismiss,
        handleNext,
    } = useFirstTimeGuide();

    if (!isVisible) return null;

    const tip = tips[currentTip];

    return (
        <GuideOverlay>
            <Card className="w-full max-w-md border-black/10 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8">
                    <GuideHeader
                        currentTip={currentTip}
                        totalTips={tips.length}
                        onDismiss={handleDismiss}
                    />

                    <GuideContent tip={tip} />

                    <GuideProgress
                        currentTip={currentTip}
                        totalTips={tips.length}
                    />

                    <GuideActions
                        isLastTip={isLastTip}
                        onDismiss={handleDismiss}
                        onNext={handleNext}
                    />
                </div>
            </Card>
        </GuideOverlay>
    );
}

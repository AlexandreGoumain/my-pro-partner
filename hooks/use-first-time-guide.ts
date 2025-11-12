import { CLIENT_STORAGE_KEYS } from "@/lib/constants/client-storage";
import { useCallback, useEffect, useState } from "react";

export interface GuideTip {
    title: string;
    description: string;
}

interface UseFirstTimeGuideReturn {
    isVisible: boolean;
    currentTip: number;
    tips: GuideTip[];
    isLastTip: boolean;
    handleDismiss: () => void;
    handleNext: () => void;
}

const GUIDE_TIPS: GuideTip[] = [
    {
        title: "Consultez vos documents",
        description:
            "Tous vos devis, factures et avoirs sont accessibles dans la section Documents. Vous pouvez les télécharger et les partager.",
    },
    {
        title: "Suivez votre fidélité",
        description:
            "Accumulez des points à chaque achat et débloquez des avantages exclusifs dans la section Fidélité.",
    },
    {
        title: "Gardez votre profil à jour",
        description:
            "Assurez-vous que vos informations de contact sont à jour dans votre profil pour recevoir vos documents par email.",
    },
];

export function useFirstTimeGuide(): UseFirstTimeGuideReturn {
    const [isVisible, setIsVisible] = useState(false);
    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        // Check if user has seen the guide
        const hasSeenGuide = localStorage.getItem(
            CLIENT_STORAGE_KEYS.GUIDE_COMPLETE
        );
        const hasCompletedOnboarding = localStorage.getItem(
            CLIENT_STORAGE_KEYS.ONBOARDING_COMPLETE
        );

        if (hasCompletedOnboarding && !hasSeenGuide) {
            // Show guide after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = useCallback(() => {
        localStorage.setItem(CLIENT_STORAGE_KEYS.GUIDE_COMPLETE, "true");
        setIsVisible(false);
    }, []);

    const handleNext = useCallback(() => {
        if (currentTip < GUIDE_TIPS.length - 1) {
            setCurrentTip((prev) => prev + 1);
        } else {
            handleDismiss();
        }
    }, [currentTip, handleDismiss]);

    return {
        isVisible,
        currentTip,
        tips: GUIDE_TIPS,
        isLastTip: currentTip >= GUIDE_TIPS.length - 1,
        handleDismiss,
        handleNext,
    };
}

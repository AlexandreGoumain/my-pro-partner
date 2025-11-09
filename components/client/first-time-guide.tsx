"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Lightbulb } from "lucide-react";

interface FirstTimeGuideProps {
  userName?: string;
}

/**
 * First-time user guide overlay
 * Shows helpful tips for new users after onboarding
 * Can be dismissed permanently
 */
export function FirstTimeGuide({ userName }: FirstTimeGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    // Check if user has seen the guide
    const hasSeenGuide = localStorage.getItem("clientGuideComplete");
    const hasCompletedOnboarding = localStorage.getItem("clientOnboardingComplete");

    if (hasCompletedOnboarding && !hasSeenGuide) {
      // Show guide after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const tips = [
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

  const handleDismiss = () => {
    localStorage.setItem("clientGuideComplete", "true");
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  const tip = tips[currentTip];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-black/10 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-black/60" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                  Conseil {currentTip + 1}/{tips.length}
                </h3>
                <p className="text-[13px] text-black/50">Pour bien démarrer</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-md hover:bg-black/5 transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4 text-black/40" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3 mb-6">
            <h4 className="text-[16px] font-medium text-black">{tip.title}</h4>
            <p className="text-[14px] text-black/60 leading-relaxed">
              {tip.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentTip
                    ? "w-6 bg-black"
                    : index < currentTip
                    ? "w-1.5 bg-black/30"
                    : "w-1.5 bg-black/10"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1 h-11 text-[14px] font-medium border-black/10 hover:bg-black/5"
            >
              Passer
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
            >
              {currentTip < tips.length - 1 ? "Suivant" : "Compris !"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

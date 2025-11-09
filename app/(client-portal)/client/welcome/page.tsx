"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Award,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/**
 * Welcome page shown to users after first registration
 * Goal: Show immediate value and guide them through features
 * Inspired by Apple's onboarding: simple, visual, one thing at a time
 */
export default function ClientWelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [entrepriseName, setEntrepriseName] = useState("");

  useEffect(() => {
    // Get token to verify user is authenticated
    const token = localStorage.getItem("clientToken");
    if (!token) {
      router.push("/client/login");
      return;
    }

    // Fetch user's entreprise name
    fetchEntrepriseName(token);
  }, [router]);

  const fetchEntrepriseName = async (token: string) => {
    try {
      const res = await fetch("/api/client/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setEntrepriseName(data.entreprise?.nom || "");
      }
    } catch (error) {
      console.error("Failed to fetch entreprise name:", error);
    }
  };

  const steps = [
    {
      icon: Sparkles,
      title: "Bienvenue !",
      description: `Votre espace client ${entrepriseName ? `chez ${entrepriseName}` : ""} est prêt.`,
      detail:
        "En quelques secondes, vous allez découvrir tout ce que vous pouvez faire ici.",
    },
    {
      icon: FileText,
      title: "Vos documents en un clic",
      description:
        "Accédez à tous vos devis, factures et avoirs à tout moment.",
      detail:
        "Téléchargez-les, consultez leur statut, et suivez vos paiements en temps réel.",
    },
    {
      icon: Award,
      title: "Programme de fidélité",
      description:
        "Gagnez des points à chaque achat et profitez de réductions exclusives.",
      detail:
        "Plus vous êtes fidèle, plus vous bénéficiez d'avantages et de remises importantes.",
    },
    {
      icon: CheckCircle2,
      title: "Tout est prêt !",
      description: "Vous pouvez maintenant explorer votre espace client.",
      detail: "Commencez par consulter vos documents ou votre programme de fidélité.",
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Mark onboarding as complete and redirect
      localStorage.setItem("clientOnboardingComplete", "true");
      router.push("/client/dashboard");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("clientOnboardingComplete", "true");
    router.push("/client/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === step
                  ? "w-8 bg-black"
                  : index < step
                  ? "w-2 bg-black/40"
                  : "w-2 bg-black/10"
              }`}
            />
          ))}
        </div>

        {/* Main card */}
        <Card className="border-black/8 shadow-sm">
          <div className="p-8 sm:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-black/5 flex items-center justify-center">
                <Icon className="h-10 w-10 text-black/80" strokeWidth={1.5} />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-black">
                {currentStep.title}
              </h1>
              <p className="text-[17px] sm:text-[19px] text-black/80 leading-relaxed">
                {currentStep.description}
              </p>
              <p className="text-[15px] text-black/50 leading-relaxed max-w-md mx-auto">
                {currentStep.detail}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleNext}
                className="w-full h-12 text-[15px] font-medium bg-black hover:bg-black/90 text-white rounded-lg shadow-sm"
              >
                {step < steps.length - 1 ? (
                  <>
                    Continuer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Accéder à mon espace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {step < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="w-full h-11 text-[14px] text-black/50 hover:text-black/80 transition-colors"
                >
                  Passer l&apos;introduction
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-[13px] text-black/40 mt-6">
          Vous pouvez modifier vos informations à tout moment dans votre profil
        </p>
      </div>
    </div>
  );
}

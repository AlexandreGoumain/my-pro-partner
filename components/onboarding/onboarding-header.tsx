import { Sparkles } from "lucide-react";

export interface OnboardingHeaderProps {
  className?: string;
}

export function OnboardingHeader({ className }: OnboardingHeaderProps) {
  return (
    <div className={className}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white text-2xl font-bold mb-4 shadow-sm">
        <Sparkles className="h-8 w-8" />
      </div>
      <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
        Bienvenue sur MyProPartner
      </h1>
      <p className="text-[14px] text-black/40 mt-1">
        Configurons votre espace en quelques étapes
      </p>
    </div>
  );
}

import { cn } from "@/lib/utils";

export interface PlanHeroSectionProps {
    className?: string;
}

export function PlanHeroSection({ className }: PlanHeroSectionProps) {
    return (
        <div className={cn("text-center", className)}>
            <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-black leading-tight">
                Commencez gratuitement.
                <br />
                Évoluez sans limites.
            </h2>
            <p className="mt-3 text-[16px] text-black/50">
                Rejoignez 2,500+ professionnels qui gèrent leur activité avec
                MyProPartner
            </p>
        </div>
    );
}

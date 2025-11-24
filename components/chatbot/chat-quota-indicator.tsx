import { cn } from "@/lib/utils";

export interface ChatQuotaIndicatorProps {
  current: number;
  max: number;
  className?: string;
}

export function ChatQuotaIndicator({
  current,
  max,
  className,
}: ChatQuotaIndicatorProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const remaining = Math.max(max - current, 0);

  // Couleur basée sur le pourcentage d'utilisation
  const getColor = () => {
    if (percentage >= 90) return "bg-red-600";
    if (percentage >= 75) return "bg-orange-600";
    return "bg-black";
  };

  const getTextColor = () => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    return "text-black/60";
  };

  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-black/10 bg-black/2",
        className
      )}
    >
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="text-black/40">
          {remaining === 0
            ? "Quota atteint ce mois"
            : `${remaining} question${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""} ce mois`}
        </span>
        <span className={cn("font-medium", getTextColor())}>
          {current}/{max}
        </span>
      </div>
      <div className="h-1 bg-black/10 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            getColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

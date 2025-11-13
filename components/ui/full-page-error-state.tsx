import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FullPageErrorStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  className?: string;
}

/**
 * Full-page error state component
 * Used for displaying errors in full-page layouts (error.tsx, not-found.tsx, etc.)
 * Follows Apple design guidelines with minimalist black/white/gray color palette
 */
export function FullPageErrorState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: FullPageErrorStateProps) {
  return (
    <div className={cn("flex min-h-screen flex-col items-center justify-center bg-white", className)}>
      <div className="mx-auto max-w-md space-y-6 text-center px-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-black/5 p-4 flex items-center justify-center h-20 w-20">
            <Icon className="h-10 w-10 text-black/40" strokeWidth={2} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
            {title}
          </h1>
          <p className="text-[14px] text-black/60 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <a href={secondaryAction.href} className="flex-shrink-0">
              <Button
                variant="outline"
                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
              >
                {secondaryAction.label}
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

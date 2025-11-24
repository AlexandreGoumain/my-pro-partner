import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatErrorMessageProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export function ChatErrorMessage({
  error,
  onRetry,
  className,
}: ChatErrorMessageProps) {
  return (
    <div
      className={cn(
        "mx-4 my-2 p-3 bg-red-50 border border-red-100 rounded-md",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <AlertCircle
          className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
          strokeWidth={2}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-red-900">
            Une erreur s'est produite
          </p>
          <p className="text-[12px] text-red-700 mt-1 break-words">
            {error.message || "Une erreur inconnue s'est produite"}
          </p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-3 flex items-center gap-2">
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="h-8 text-[12px] border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
          >
            <RefreshCw className="w-3 h-3 mr-1.5" strokeWidth={2} />
            Réessayer
          </Button>
        </div>
      )}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatSuggestion {
  icon: LucideIcon;
  label: string;
  query: string;
}

export interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSelect: (query: string) => void;
  className?: string;
}

export function ChatSuggestions({
  suggestions,
  onSelect,
  className,
}: ChatSuggestionsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.label}
          onClick={() => onSelect(suggestion.query)}
          className="flex items-center gap-2 p-3 text-left
                     bg-black/5 hover:bg-black/10
                     rounded-md border border-black/10
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-black/20"
        >
          <suggestion.icon
            className="w-4 h-4 text-black/40 flex-shrink-0"
            strokeWidth={2}
          />
          <span className="text-[13px] text-black/60 font-medium">
            {suggestion.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// CHAT ERROR MESSAGE COMPONENT
// ============================================

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    AlertTriangle,
    HelpCircle,
    RefreshCw,
    ShieldAlert,
} from "lucide-react";

// Types d'erreurs spécifiques
type ErrorType = "off-topic" | "injection" | "rate-limit" | "generic";

interface ParsedError {
    type: ErrorType;
    title: string;
    message: string;
    suggestions?: string[];
}

function parseError(error: Error): ParsedError {
    const message = error.message.toLowerCase();

    // Question hors contexte
    if (message.includes("hors contexte") || message.includes("off-topic")) {
        return {
            type: "off-topic",
            title: "Question hors sujet",
            message:
                "Je suis votre assistant ERP. Je ne peux répondre qu'aux questions liées à la gestion de votre entreprise.",
            suggestions: [
                "Mes stats du jour",
                "Clients inactifs",
                "Articles en rupture",
                "Mon CA ce mois",
            ],
        };
    }

    // Tentative d'injection
    if (
        message.includes("suspecte") ||
        message.includes("injection") ||
        message.includes("bloqué")
    ) {
        return {
            type: "injection",
            title: "Requête non autorisée",
            message:
                "Votre message contient des instructions qui ne sont pas autorisées. Reformulez votre demande simplement.",
            suggestions: undefined,
        };
    }

    // Rate limit
    if (message.includes("rate") || message.includes("limite")) {
        return {
            type: "rate-limit",
            title: "Trop de messages",
            message:
                "Vous avez atteint la limite de messages. Attendez un moment avant de réessayer.",
            suggestions: undefined,
        };
    }

    // Erreur générique
    return {
        type: "generic",
        title: "Une erreur s'est produite",
        message: error.message || "Une erreur inconnue s'est produite",
        suggestions: undefined,
    };
}

export interface ChatErrorMessageProps {
    error: Error;
    onRetry?: () => void;
    onSuggestionClick?: (suggestion: string) => void;
    className?: string;
}

export function ChatErrorMessage({
    error,
    onRetry,
    onSuggestionClick,
    className,
}: ChatErrorMessageProps) {
    const parsed = parseError(error);

    const iconMap = {
        "off-topic": HelpCircle,
        injection: ShieldAlert,
        "rate-limit": AlertTriangle,
        generic: AlertCircle,
    };

    const colorMap = {
        "off-topic": {
            bg: "bg-amber-50",
            border: "border-amber-100",
            icon: "text-amber-600",
            title: "text-amber-900",
            text: "text-amber-700",
            button: "border-amber-200 text-amber-700 hover:bg-amber-100",
        },
        injection: {
            bg: "bg-red-50",
            border: "border-red-100",
            icon: "text-red-600",
            title: "text-red-900",
            text: "text-red-700",
            button: "border-red-200 text-red-700 hover:bg-red-100",
        },
        "rate-limit": {
            bg: "bg-orange-50",
            border: "border-orange-100",
            icon: "text-orange-600",
            title: "text-orange-900",
            text: "text-orange-700",
            button: "border-orange-200 text-orange-700 hover:bg-orange-100",
        },
        generic: {
            bg: "bg-red-50",
            border: "border-red-100",
            icon: "text-red-600",
            title: "text-red-900",
            text: "text-red-700",
            button: "border-red-200 text-red-700 hover:bg-red-100",
        },
    };

    const Icon = iconMap[parsed.type];
    const colors = colorMap[parsed.type];

    return (
        <div
            className={cn(
                "mx-0 my-2 p-3 rounded-lg border",
                colors.bg,
                colors.border,
                className
            )}
        >
            <div className="flex items-start gap-2">
                <Icon
                    className={cn("w-4 h-4 mt-0.5 flex-shrink-0", colors.icon)}
                    strokeWidth={2}
                />
                <div className="flex-1 min-w-0">
                    <p className={cn("text-[13px] font-medium", colors.title)}>
                        {parsed.title}
                    </p>
                    <p
                        className={cn(
                            "text-[12px] mt-1 break-words",
                            colors.text
                        )}
                    >
                        {parsed.message}
                    </p>
                </div>
            </div>

            {/* Suggestions pour les questions hors sujet */}
            {parsed.suggestions && onSuggestionClick && (
                <div className="mt-3">
                    <p className="text-[11px] text-black/40 mb-2">
                        Essayez plutôt :
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {parsed.suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => onSuggestionClick(suggestion)}
                                className="px-2 py-1 text-[11px] bg-white border border-black/10 rounded-md hover:bg-black/5 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bouton retry pour les erreurs génériques */}
            {onRetry && parsed.type === "generic" && (
                <div className="mt-3">
                    <Button
                        onClick={onRetry}
                        size="sm"
                        variant="outline"
                        className={cn("h-8 text-[12px]", colors.button)}
                    >
                        <RefreshCw className="w-3 h-3 mr-1.5" strokeWidth={2} />
                        Réessayer
                    </Button>
                </div>
            )}
        </div>
    );
}

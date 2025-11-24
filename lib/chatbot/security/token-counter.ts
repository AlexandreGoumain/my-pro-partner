// ============================================
// TOKEN COUNTER - Comptage précis avec tiktoken
// ============================================

import { encoding_for_model } from "tiktoken";
import type { TiktokenModel } from "tiktoken";

/**
 * Modèles OpenAI supportés
 */
type OpenAIModel = "gpt-4o" | "gpt-4o-mini" | "gpt-4" | "gpt-3.5-turbo";

/**
 * Cache pour les encoders (évite de les recréer à chaque fois)
 */
const encoderCache = new Map<string, ReturnType<typeof encoding_for_model>>();

/**
 * Obtenir l'encoder pour un modèle
 */
function getEncoder(model: OpenAIModel) {
    if (!encoderCache.has(model)) {
        try {
            const encoder = encoding_for_model(model as TiktokenModel);
            encoderCache.set(model, encoder);
        } catch (error) {
            // Si le modèle n'est pas supporté, utiliser gpt-4o par défaut
            const encoder = encoding_for_model("gpt-4o" as TiktokenModel);
            encoderCache.set(model, encoder);
        }
    }
    return encoderCache.get(model)!;
}

/**
 * Compter le nombre de tokens dans un texte
 * @param text Texte à analyser
 * @param model Modèle OpenAI (pour l'encoding correct)
 * @returns Nombre de tokens
 */
export function countTokens(
    text: string,
    model: OpenAIModel = "gpt-4o-mini"
): number {
    if (!text) return 0;

    try {
        const encoder = getEncoder(model);
        const tokens = encoder.encode(text);
        return tokens.length;
    } catch (error) {
        // Fallback sur l'estimation simple si tiktoken échoue
        return Math.ceil(text.length / 4);
    }
}

/**
 * Compter les tokens dans un tableau de messages
 * @param messages Messages à analyser
 * @param model Modèle OpenAI
 * @returns Nombre total de tokens
 */
export function countMessagesTokens(
    messages: Array<{ role: string; content: string; name?: string }>,
    model: OpenAIModel = "gpt-4o-mini"
): number {
    let totalTokens = 0;

    for (const message of messages) {
        // Chaque message a un overhead de 3 tokens
        totalTokens += 3;

        // Compter les tokens du rôle
        totalTokens += countTokens(message.role, model);

        // Compter les tokens du contenu
        totalTokens += countTokens(message.content, model);

        // Si le message a un nom, compter aussi
        if (message.name) {
            totalTokens += countTokens(message.name, model);
            totalTokens += 1; // overhead pour le nom
        }
    }

    // Overhead global de la conversation
    totalTokens += 3;

    return totalTokens;
}

/**
 * Vérifier si un texte dépasse une limite de tokens
 * @param text Texte à vérifier
 * @param limit Limite de tokens
 * @param model Modèle OpenAI
 * @returns true si la limite est dépassée
 */
export function exceedsTokenLimit(
    text: string,
    limit: number,
    model: OpenAIModel = "gpt-4o-mini"
): boolean {
    const tokens = countTokens(text, model);
    return tokens > limit;
}

/**
 * Tronquer un texte pour respecter une limite de tokens
 * @param text Texte à tronquer
 * @param maxTokens Nombre maximum de tokens
 * @param model Modèle OpenAI
 * @param ellipsis Texte à ajouter à la fin (défaut: "...")
 * @returns Texte tronqué
 */
export function truncateToTokenLimit(
    text: string,
    maxTokens: number,
    model: OpenAIModel = "gpt-4o-mini",
    ellipsis = "..."
): string {
    if (!text) return text;

    try {
        const encoder = getEncoder(model);
        const tokens = encoder.encode(text);

        if (tokens.length <= maxTokens) {
            return text;
        }

        // Réserver des tokens pour l'ellipse
        const ellipsisTokens = encoder.encode(ellipsis).length;
        const targetTokens = maxTokens - ellipsisTokens;

        if (targetTokens <= 0) {
            return ellipsis;
        }

        // Tronquer les tokens et décoder
        const truncatedTokens = tokens.slice(0, targetTokens);
        const truncatedText = new TextDecoder().decode(
            encoder.decode(truncatedTokens)
        );

        return truncatedText + ellipsis;
    } catch (error) {
        // Fallback sur troncature simple
        const estimatedChars = maxTokens * 4;
        if (text.length <= estimatedChars) {
            return text;
        }
        return text.substring(0, estimatedChars - ellipsis.length) + ellipsis;
    }
}

/**
 * Estimer le coût en tokens d'un appel à l'API
 * (input tokens + estimated output tokens)
 */
export function estimateApiCost(
    inputTokens: number,
    estimatedOutputTokens: number,
    model: OpenAIModel = "gpt-4o-mini"
): {
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    model: string;
} {
    return {
        totalTokens: inputTokens + estimatedOutputTokens,
        inputTokens,
        outputTokens: estimatedOutputTokens,
        model,
    };
}

/**
 * Obtenir des statistiques détaillées sur un texte
 */
export function getTokenStatistics(
    text: string,
    model: OpenAIModel = "gpt-4o-mini"
): {
    tokens: number;
    characters: number;
    words: number;
    lines: number;
    tokensPerWord: number;
    charactersPerToken: number;
} {
    const tokens = countTokens(text, model);
    const characters = text.length;
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const lines = text.split("\n").length;

    return {
        tokens,
        characters,
        words,
        lines,
        tokensPerWord: words > 0 ? tokens / words : 0,
        charactersPerToken: tokens > 0 ? characters / tokens : 0,
    };
}

/**
 * Libérer les ressources (encoders)
 * À appeler lors du shutdown de l'application
 */
export function cleanup(): void {
    encoderCache.forEach((encoder) => {
        encoder.free();
    });
    encoderCache.clear();
}

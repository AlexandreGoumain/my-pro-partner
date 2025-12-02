// ============================================
// RATE LIMITING - Upstash Redis
// ============================================

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PlanAbonnement } from "@/lib/generated/prisma";

/**
 * Configuration Redis pour Upstash
 * Variables d'environnement requises :
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Rate limiters pour les messages chatbot - PAR PLAN
 * Les limites sont adaptées au plan de l'utilisateur pour optimiser l'expérience
 */

/**
 * FREE: Pas d'accès au chatbot (bloqué au niveau feature)
 * Limite technique : 0/minute (sera bloqué avant d'atteindre le rate limit)
 */
export const chatbotMessageRateLimitFree = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(0, "1 m"),
  analytics: true,
  prefix: "ratelimit:chatbot:message:free",
});

/**
 * STARTER: Usage modéré (29€/mois, 50 messages/mois)
 * Limite : 5 messages/minute
 * Justification : Évite d'épuiser le quota mensuel trop rapidement
 */
export const chatbotMessageRateLimitStarter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:chatbot:message:starter",
});

/**
 * PRO: Usage intensif (79€/mois, messages illimités)
 * Limite : 20 messages/minute
 * Justification : Permet une utilisation fluide sans abus
 */
export const chatbotMessageRateLimitPro = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ratelimit:chatbot:message:pro",
});

/**
 * ENTERPRISE: Usage très intensif (prix premium, messages illimités)
 * Limite : 50 messages/minute
 * Justification : Service premium pour usage très intensif
 */
export const chatbotMessageRateLimitEnterprise = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
  analytics: true,
  prefix: "ratelimit:chatbot:message:enterprise",
});

/**
 * Rate limiter par défaut (fallback)
 * Utilisé si le plan n'est pas reconnu
 * @deprecated Use plan-specific limiters instead
 */
export const chatbotMessageRateLimit = chatbotMessageRateLimitStarter;

/**
 * Rate limiter pour les actions critiques
 * Limite : 5 actions critiques par heure par utilisateur
 */
export const criticalActionRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:chatbot:critical",
});

/**
 * Rate limiter pour les tentatives d'injection
 * Limite : 3 tentatives suspectes par heure par utilisateur
 * Après 3 tentatives, blocage pendant 1 heure
 */
export const injectionAttemptRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:chatbot:injection",
});

/**
 * Rate limiter pour la création de conversations
 * Limite : 10 nouvelles conversations par jour par utilisateur
 */
export const conversationCreationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 d"),
  analytics: true,
  prefix: "ratelimit:chatbot:conversation",
});

/**
 * Vérifier le rate limit pour un utilisateur
 * @param identifier Identifiant de l'utilisateur (userId ou entrepriseId)
 * @param limiter Le rate limiter à utiliser
 * @returns Résultat du rate limit
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Sélectionne le rate limiter approprié selon le plan
 * @param plan Plan d'abonnement de l'entreprise
 * @returns Le rate limiter correspondant au plan
 */
export function getRateLimiterForPlan(plan: PlanAbonnement): Ratelimit {
  switch (plan) {
    case "FREE":
      return chatbotMessageRateLimitFree;
    case "STARTER":
      return chatbotMessageRateLimitStarter;
    case "PRO":
      return chatbotMessageRateLimitPro;
    case "ENTERPRISE":
      return chatbotMessageRateLimitEnterprise;
    default:
      // Fallback sur STARTER pour sécurité
      return chatbotMessageRateLimitStarter;
  }
}

/**
 * Obtient la limite par minute pour un plan donné
 * @param plan Plan d'abonnement
 * @returns Nombre de messages autorisés par minute
 */
export function getRateLimitForPlan(plan: PlanAbonnement): number {
  switch (plan) {
    case "FREE":
      return 0;
    case "STARTER":
      return 5;
    case "PRO":
      return 20;
    case "ENTERPRISE":
      return 50;
    default:
      return 5; // Fallback sécurisé
  }
}

/**
 * Helper pour vérifier le rate limit des messages (avec plan)
 * @param userId ID de l'utilisateur
 * @param plan Plan d'abonnement de l'entreprise
 * @returns Résultat du rate limit avec limites spécifiques au plan
 */
export async function checkMessageRateLimitForPlan(
  userId: string,
  plan: PlanAbonnement
) {
  const limiter = getRateLimiterForPlan(plan);
  return checkRateLimit(userId, limiter);
}

/**
 * Helper pour vérifier le rate limit des messages (legacy - sans plan)
 * @deprecated Use checkMessageRateLimitForPlan instead with the user's plan
 */
export async function checkMessageRateLimit(userId: string) {
  return checkRateLimit(userId, chatbotMessageRateLimit);
}

/**
 * Helper pour vérifier le rate limit des actions critiques
 */
export async function checkCriticalActionRateLimit(userId: string) {
  return checkRateLimit(userId, criticalActionRateLimit);
}

/**
 * Helper pour enregistrer une tentative d'injection
 */
export async function recordInjectionAttempt(userId: string) {
  return checkRateLimit(userId, injectionAttemptRateLimit);
}

/**
 * Helper pour vérifier le rate limit de création de conversations
 */
export async function checkConversationCreationRateLimit(userId: string) {
  return checkRateLimit(userId, conversationCreationRateLimit);
}

/**
 * Vérifier si Redis est disponible
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    return false;
  }
}

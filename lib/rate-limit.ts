import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiter pour les formulaires publics (waitlist, contact)
// 3 requêtes par minute par IP
export const publicFormLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/public-form",
});

// Rate limiter plus strict pour prévenir les abus
// 10 requêtes par heure par IP
export const strictLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "@upstash/ratelimit/strict",
});

/**
 * Récupère l'IP du client depuis les headers
 */
export function getClientIp(request: Request): string {
  // Essayer d'obtenir l'IP depuis les headers standard
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback (ne devrait pas arriver en production)
  return "unknown";
}

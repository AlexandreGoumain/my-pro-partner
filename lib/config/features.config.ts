/**
 * @deprecated Ce fichier est déprécié
 * Utilisez le nouveau système dans lib/config/plans.config.ts
 *
 * Migration:
 * - FEATURE_FLAGS → GLOBAL_FEATURE_FLAGS (dans plans.config.ts)
 * - isFeatureEnabled() → isGlobalFeatureEnabled() (depuis plans.config.ts)
 */

import { GLOBAL_FEATURE_FLAGS, isGlobalFeatureEnabled } from "./plans.config";

/**
 * @deprecated Utilisez GLOBAL_FEATURE_FLAGS depuis plans.config.ts
 */
export const FEATURE_FLAGS = GLOBAL_FEATURE_FLAGS;

/**
 * @deprecated Utilisez isGlobalFeatureEnabled() depuis plans.config.ts
 */
export function isFeatureEnabled(
  featureKey: keyof typeof GLOBAL_FEATURE_FLAGS
): boolean {
  return isGlobalFeatureEnabled(featureKey);
}

/**
 * Client portal localStorage keys
 * Centralized storage keys for better maintainability
 */

export const CLIENT_STORAGE_KEYS = {
    /** Authentication token for client portal */
    AUTH_TOKEN: "clientToken",

    /** Flag indicating if client has completed onboarding */
    ONBOARDING_COMPLETE: "clientOnboardingComplete",

    /** Flag indicating if client has seen the first-time guide */
    GUIDE_COMPLETE: "clientGuideComplete",

    /** Flag indicating if profile completion banner was dismissed */
    PROFILE_BANNER_DISMISSED: "clientProfileBannerDismissed",
} as const;

export type ClientStorageKey =
    (typeof CLIENT_STORAGE_KEYS)[keyof typeof CLIENT_STORAGE_KEYS];

import { z } from "zod";

/**
 * Environment Variable Validation
 *
 * Validates all environment variables at startup to fail fast
 * if required variables are missing or invalid.
 *
 * Usage:
 * ```ts
 * import { env } from "@/lib/env";
 * console.log(env.DATABASE_URL);
 * ```
 */

// ============================================================================
// SCHEMA DEFINITIONS
// ============================================================================

/**
 * Server-side environment variables (secrets, API keys)
 * These are NOT exposed to the browser
 */
const serverSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // NextAuth
    NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
    NEXTAUTH_URL: z.string().url().optional(),

    // OpenAI (optional - for chatbot)
    OPENAI_API_KEY: z.string().optional(),

    // Redis (optional - for rate limiting)
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // Encryption
    CONVERSATION_ENCRYPTION_KEY: z.string().optional(),

    // Email (Resend)
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM_EMAIL: z.string().email().optional(),
    RESEND_FROM_NAME: z.string().optional(),

    // Client Portal JWT
    CLIENT_JWT_SECRET: z.string().optional(),

    // Stripe
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Stripe Price IDs (subscriptions)
    STRIPE_PRICE_STARTER_MONTHLY: z.string().optional(),
    STRIPE_PRICE_STARTER_ANNUAL: z.string().optional(),
    STRIPE_PRICE_PRO_MONTHLY: z.string().optional(),
    STRIPE_PRICE_PRO_ANNUAL: z.string().optional(),
    STRIPE_PRICE_ENTERPRISE_MONTHLY: z.string().optional(),
    STRIPE_PRICE_ENTERPRISE_ANNUAL: z.string().optional(),

    // Stripe Product IDs
    STRIPE_PRODUCT_STARTER: z.string().optional(),
    STRIPE_PRODUCT_PRO: z.string().optional(),
    STRIPE_PRODUCT_ENTERPRISE: z.string().optional(),

    // Node environment
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
});

/**
 * Client-side environment variables (NEXT_PUBLIC_*)
 * These ARE exposed to the browser - no secrets!
 */
const clientSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// ============================================================================
// VALIDATION
// ============================================================================

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

/**
 * Validates server environment variables
 * Throws a detailed error if validation fails
 */
function validateServerEnv(): ServerEnv {
    const parsed = serverSchema.safeParse(process.env);

    if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        const errorMessages = Object.entries(errors)
            .map(([key, messages]) => `  - ${key}: ${messages?.join(", ")}`)
            .join("\n");

        console.error(
            "\n===============================================\n" +
                " ENVIRONMENT VALIDATION ERROR\n" +
                "===============================================\n" +
                "Missing or invalid environment variables:\n" +
                errorMessages +
                "\n\n" +
                "Check your .env file or environment configuration.\n" +
                "See .env.example for required variables.\n" +
                "===============================================\n"
        );

        throw new Error(`Environment validation failed:\n${errorMessages}`);
    }

    return parsed.data;
}

/**
 * Validates client environment variables
 */
function validateClientEnv(): ClientEnv {
    const clientEnv = {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    };

    const parsed = clientSchema.safeParse(clientEnv);

    if (!parsed.success) {
        console.error(
            "Client environment validation failed:",
            parsed.error.flatten().fieldErrors
        );
        throw new Error("Client environment validation failed");
    }

    return parsed.data;
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Validated server environment variables
 * Access with: `env.DATABASE_URL`, `env.STRIPE_SECRET_KEY`, etc.
 */
export const env: ServerEnv =
    typeof window === "undefined" ? validateServerEnv() : ({} as ServerEnv); // Client-side: empty object (no access to server vars)

/**
 * Validated client environment variables
 * These are safe to use in browser code
 */
export const clientEnv: ClientEnv = validateClientEnv();

/**
 * Helper to check if a feature is enabled based on env vars
 */
export const features = {
    /** Email sending enabled (Resend configured) */
    email: Boolean(env.RESEND_API_KEY),

    /** AI chatbot enabled (OpenAI configured) */
    chatbot: Boolean(env.OPENAI_API_KEY),

    /** Rate limiting enabled (Redis configured) */
    rateLimit: Boolean(
        env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ),

    /** Stripe payments enabled */
    stripe: Boolean(env.STRIPE_SECRET_KEY),

    /** Stripe subscriptions enabled (all price IDs configured) */
    subscriptions: Boolean(
        env.STRIPE_PRICE_STARTER_MONTHLY && env.STRIPE_PRICE_PRO_MONTHLY
    ),

    /** Message encryption enabled */
    encryption: Boolean(env.CONVERSATION_ENCRYPTION_KEY),
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { ClientEnv, ServerEnv };

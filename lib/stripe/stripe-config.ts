import Stripe from "stripe";
import { STRIPE_CONFIG, STRIPE_ERRORS } from "./stripe-constants";

/**
 * Validate Stripe environment variables
 */
function validateStripeConfig(): void {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error(STRIPE_ERRORS.NO_SECRET_KEY);
    }

    if (process.env.NODE_ENV === "production" && !process.env.STRIPE_WEBHOOK_SECRET) {
        console.warn("Warning: STRIPE_WEBHOOK_SECRET is not set in production environment");
    }
}

// Validate configuration on module load
validateStripeConfig();

/**
 * Stripe client instance
 * Configured with TypeScript support and API versioning
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: STRIPE_CONFIG.API_VERSION,
    typescript: true,
    appInfo: {
        name: "MyProPartner ERP",
        version: "1.0.0",
    },
});

/**
 * Webhook secret for signature verification
 */
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Check if Stripe is properly configured
 */
export function isStripeConfigured(): boolean {
    return !!process.env.STRIPE_SECRET_KEY;
}

/**
 * Check if webhook secret is configured
 */
export function isWebhookConfigured(): boolean {
    return !!process.env.STRIPE_WEBHOOK_SECRET;
}

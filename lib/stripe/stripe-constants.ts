/**
 * Stripe configuration constants
 */

export const STRIPE_CONFIG = {
    API_VERSION: "2024-12-18.acacia" as const,
    CURRENCY: "eur" as const,
    PAYMENT_METHODS: ["card"] as const,
    SESSION_EXPIRATION_MINUTES: 30,
} as const;

export const STRIPE_URLS = {
    success: (documentId: string) =>
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&document_id=${documentId}`,
    cancel: (documentId: string) =>
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?document_id=${documentId}`,
    paymentPage: (documentId: string) =>
        `${process.env.NEXT_PUBLIC_APP_URL}/pay/${documentId}`,
} as const;

export const STRIPE_ERRORS = {
    NO_SECRET_KEY: "STRIPE_SECRET_KEY is not defined in environment variables",
    NO_WEBHOOK_SECRET: "STRIPE_WEBHOOK_SECRET is not defined in environment variables",
    SESSION_CREATION_FAILED: "Failed to create Stripe checkout session",
    WEBHOOK_VERIFICATION_FAILED: "Webhook signature verification failed",
    PAYMENT_PROCESSING_FAILED: "Payment processing failed",
} as const;

export const STRIPE_EVENTS = {
    CHECKOUT_SESSION_COMPLETED: "checkout.session.completed",
    PAYMENT_INTENT_SUCCEEDED: "payment_intent.succeeded",
    PAYMENT_INTENT_FAILED: "payment_intent.payment_failed",
} as const;

/**
 * Test card numbers for Stripe
 */
export const STRIPE_TEST_CARDS = {
    SUCCESS: "4242 4242 4242 4242",
    DECLINE: "4000 0000 0000 0002",
    REQUIRES_3D_SECURE: "4000 0027 6000 3184",
    INSUFFICIENT_FUNDS: "4000 0000 0000 9995",
} as const;

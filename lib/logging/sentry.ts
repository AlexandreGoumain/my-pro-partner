/**
 * Sentry Integration Helper
 *
 * To enable Sentry error tracking:
 * 1. Install: npm install @sentry/nextjs
 * 2. Create sentry.client.config.ts and sentry.server.config.ts at project root
 * 3. Set NEXT_PUBLIC_SENTRY_DSN and SENTRY_AUTH_TOKEN in environment variables
 * 4. Set SENTRY_ENABLED to true below
 *
 * This file provides helper utilities for Sentry integration without
 * requiring the package to be installed (graceful fallback to logging).
 */

import { logger } from "./logger";

/**
 * Capture an exception and send to Sentry (if available)
 * Falls back to structured logging if Sentry is not installed
 */
export function captureException(
    error: Error | unknown,
    context?: Record<string, unknown>
): void {
    // TODO: When Sentry is installed, add:
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.captureException(error, { extra: context });

    // Always log locally
    logger.error("Exception captured", error, context);
}

/**
 * Capture a message and send to Sentry (if available)
 */
export function captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "info",
    context?: Record<string, unknown>
): void {
    // TODO: When Sentry is installed, add:
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.captureMessage(message, { level, extra: context });

    // Log locally
    const logMethod =
        level === "error"
            ? logger.error
            : level === "warning"
              ? logger.warn
              : logger.info;
    logMethod.call(logger, message, context);
}

/**
 * Set user context for Sentry (if available)
 */
export function setUser(
    user: {
        id?: string;
        email?: string;
        username?: string;
        entrepriseId?: string;
    } | null
): void {
    // TODO: When Sentry is installed, add:
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.setUser(user);

    if (user) {
        logger.debug("User context set", {
            userId: user.id,
            entrepriseId: user.entrepriseId,
        });
    }
}

/**
 * Add breadcrumb for debugging (if Sentry is available)
 */
export function addBreadcrumb(breadcrumb: {
    category?: string;
    message: string;
    level?: "debug" | "info" | "warning" | "error";
    data?: Record<string, unknown>;
}): void {
    // TODO: When Sentry is installed, add:
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.addBreadcrumb(breadcrumb);

    logger.debug(`Breadcrumb: ${breadcrumb.message}`, {
        category: breadcrumb.category,
        ...breadcrumb.data,
    });
}

/**
 * Start a performance transaction (if Sentry is available)
 */
export function startTransaction(
    name: string,
    op: string
): { finish: () => void } | null {
    // TODO: When Sentry is installed, add:
    // import * as Sentry from '@sentry/nextjs';
    // return Sentry.startInactiveSpan({ name, op });

    const start = performance.now();
    return {
        finish: () => {
            const duration = Math.round(performance.now() - start);
            logger.debug(`Transaction: ${name}`, { op, duration });
        },
    };
}

/**
 * Check if Sentry is configured and available
 */
export function isSentryAvailable(): boolean {
    // Returns false until Sentry is installed and configured
    return false;
}

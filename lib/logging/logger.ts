/**
 * Structured logging utility for the application
 *
 * Features:
 * - Structured JSON logging for production
 * - Pretty printing for development
 * - Log levels (debug, info, warn, error)
 * - Context enrichment (userId, entrepriseId, correlationId)
 * - Performance timing utilities
 *
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logging/logger';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to process payment', { error, orderId: '456' });
 * ```
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
    userId?: string;
    entrepriseId?: string;
    correlationId?: string;
    requestId?: string;
    operation?: string;
    resourceName?: string;
    resourceId?: string;
    duration?: number;
    [key: string]: unknown;
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string;
    };
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

class Logger {
    private minLevel: LogLevel;
    private isProduction: boolean;

    constructor() {
        this.isProduction = process.env.NODE_ENV === "production";
        this.minLevel =
            (process.env.LOG_LEVEL as LogLevel) ||
            (this.isProduction ? "info" : "debug");
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
    }

    private formatError(error: unknown): LogEntry["error"] | undefined {
        if (!error) return undefined;

        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: this.isProduction ? undefined : error.stack,
                code: (error as Error & { code?: string }).code,
            };
        }

        return {
            name: "Unknown",
            message: String(error),
        };
    }

    private log(
        level: LogLevel,
        message: string,
        context?: LogContext,
        error?: unknown
    ): void {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            error: this.formatError(error),
        };

        if (this.isProduction) {
            // JSON format for production (easy to parse by log aggregators)
            const logMethod =
                level === "error"
                    ? console.error
                    : level === "warn"
                      ? console.warn
                      : console.log;
            logMethod(JSON.stringify(entry));
        } else {
            // Pretty format for development
            const colors = {
                debug: "\x1b[36m", // cyan
                info: "\x1b[32m", // green
                warn: "\x1b[33m", // yellow
                error: "\x1b[31m", // red
            };
            const reset = "\x1b[0m";

            console.log(
                `${colors[level]}[${level.toUpperCase()}]${reset} ${message}`
            );
            if (context && Object.keys(context).length > 0) {
                console.log("  Context:", context);
            }
            if (error) {
                console.log("  Error:", this.formatError(error));
            }
        }
    }

    debug(message: string, context?: LogContext): void {
        this.log("debug", message, context);
    }

    info(message: string, context?: LogContext): void {
        this.log("info", message, context);
    }

    warn(message: string, context?: LogContext): void {
        this.log("warn", message, context);
    }

    error(message: string, error?: unknown, context?: LogContext): void {
        this.log("error", message, context, error);
    }

    /**
     * Create a child logger with preset context
     */
    child(defaultContext: LogContext): ChildLogger {
        return new ChildLogger(this, defaultContext);
    }

    /**
     * Measure and log the duration of an async operation
     */
    async time<T>(
        operation: string,
        fn: () => Promise<T>,
        context?: LogContext
    ): Promise<T> {
        const start = performance.now();
        try {
            const result = await fn();
            const duration = Math.round(performance.now() - start);
            this.info(`${operation} completed`, {
                ...context,
                duration,
                operation,
            });
            return result;
        } catch (error) {
            const duration = Math.round(performance.now() - start);
            this.error(`${operation} failed`, error, {
                ...context,
                duration,
                operation,
            });
            throw error;
        }
    }
}

class ChildLogger {
    constructor(
        private parent: Logger,
        private defaultContext: LogContext
    ) {}

    private mergeContext(context?: LogContext): LogContext {
        return { ...this.defaultContext, ...context };
    }

    debug(message: string, context?: LogContext): void {
        this.parent.debug(message, this.mergeContext(context));
    }

    info(message: string, context?: LogContext): void {
        this.parent.info(message, this.mergeContext(context));
    }

    warn(message: string, context?: LogContext): void {
        this.parent.warn(message, this.mergeContext(context));
    }

    error(message: string, error?: unknown, context?: LogContext): void {
        this.parent.error(message, error, this.mergeContext(context));
    }
}

// Export singleton instance
export const logger = new Logger();

// Export types for external use
export type { ChildLogger, Logger };

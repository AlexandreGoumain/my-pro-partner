import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors/custom-errors";
import { TenantError } from "@/lib/middleware/tenant-isolation";
import { isPrismaError, handlePrismaError } from "@/lib/errors/prisma";
import { randomUUID } from "crypto";

/**
 * Error response interface
 */
interface ErrorResponse {
  message: string;
  code?: string;
  correlationId: string;
  errors?: Record<string, string[]>;
  retryAfter?: number;
}

/**
 * Context for error handling
 */
export interface ErrorContext {
  resourceName?: string;
  operation?: string;
  userId?: string;
  entrepriseId?: string;
}

/**
 * Generate a unique correlation ID for error tracking
 */
function generateCorrelationId(): string {
  return randomUUID();
}

/**
 * Log error with structured data
 */
function logError(
  error: unknown,
  correlationId: string,
  context?: ErrorContext
): void {
  const errorData = {
    correlationId,
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
  };

  // In production, this should send to a logging service (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === "production") {
    console.error("[API Error]", JSON.stringify(errorData));
  } else {
    console.error("[API Error]", errorData);
  }
}

/**
 * Main error handler wrapper
 * Wraps route handlers to provide consistent error handling
 *
 * @param handler - The async route handler function
 * @param context - Optional context for logging and error messages
 * @returns Promise<NextResponse>
 *
 * @example
 * export async function GET(req: NextRequest) {
 *   return withErrorHandling(async () => {
 *     const data = await fetchData();
 *     return NextResponse.json(data);
 *   }, { resourceName: 'Client', operation: 'list' });
 * }
 */
export async function withErrorHandling(
  handler: () => Promise<NextResponse>,
  context?: ErrorContext
): Promise<NextResponse> {
  const correlationId = generateCorrelationId();

  try {
    return await handler();
  } catch (error) {
    // Log the error with correlation ID
    logError(error, correlationId, context);

    // Handle TenantError (backwards compatibility)
    if (error instanceof TenantError) {
      return NextResponse.json<ErrorResponse>(
        {
          message: error.message,
          code: "TENANT_ERROR",
          correlationId,
        },
        { status: error.statusCode }
      );
    }

    // Handle custom AppError
    if (error instanceof AppError) {
      const response: ErrorResponse = {
        message: error.message,
        code: error.code,
        correlationId,
      };

      // Add validation errors if present
      if ("errors" in error && error.errors) {
        response.errors = error.errors as Record<string, string[]>;
      }

      // Add retry-after header for rate limit errors
      if ("retryAfter" in error && error.retryAfter) {
        response.retryAfter = error.retryAfter as number;
      }

      return NextResponse.json<ErrorResponse>(
        response,
        {
          status: error.statusCode,
          headers: error instanceof AppError && "retryAfter" in error && error.retryAfter
            ? { "Retry-After": String(error.retryAfter) }
            : undefined
        }
      );
    }

    // Handle Prisma errors
    if (isPrismaError(error)) {
      const { message, status } = handlePrismaError(error);
      return NextResponse.json<ErrorResponse>(
        {
          message,
          code: "DATABASE_ERROR",
          correlationId,
        },
        { status }
      );
    }

    // Handle Zod validation errors
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ path: string[]; message: string }> };
      const errors: Record<string, string[]> = {};

      zodError.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });

      return NextResponse.json<ErrorResponse>(
        {
          message: "Erreur de validation",
          code: "VALIDATION_ERROR",
          correlationId,
          errors,
        },
        { status: 400 }
      );
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        {
          message: process.env.NODE_ENV === "production"
            ? "Erreur interne du serveur"
            : error.message,
          code: "INTERNAL_ERROR",
          correlationId,
        },
        { status: 500 }
      );
    }

    // Unknown error type
    return NextResponse.json<ErrorResponse>(
      {
        message: "Erreur interne du serveur",
        code: "UNKNOWN_ERROR",
        correlationId,
      },
      { status: 500 }
    );
  }
}

/**
 * Async error handler for use in try/catch blocks
 * Useful when you need to handle errors inline rather than wrapping the entire handler
 *
 * @param error - The error to handle
 * @param context - Optional context for logging
 * @returns NextResponse with error details
 *
 * @example
 * try {
 *   await someOperation();
 * } catch (error) {
 *   return handleError(error, { resourceName: 'Client' });
 * }
 */
export function handleError(
  error: unknown,
  context?: ErrorContext
): NextResponse {
  const correlationId = generateCorrelationId();
  logError(error, correlationId, context);

  if (error instanceof AppError || error instanceof TenantError) {
    return NextResponse.json<ErrorResponse>(
      {
        message: error.message,
        code: error instanceof AppError ? error.code : "TENANT_ERROR",
        correlationId,
      },
      { status: error.statusCode }
    );
  }

  if (isPrismaError(error)) {
    const { message, status } = handlePrismaError(error);
    return NextResponse.json<ErrorResponse>(
      {
        message,
        code: "DATABASE_ERROR",
        correlationId,
      },
      { status }
    );
  }

  return NextResponse.json<ErrorResponse>(
    {
      message: error instanceof Error ? error.message : "Erreur interne du serveur",
      code: "INTERNAL_ERROR",
      correlationId,
    },
    { status: 500 }
  );
}

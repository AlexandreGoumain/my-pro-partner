/**
 * Custom error classes for the application
 * Provides structured error handling with proper HTTP status codes
 */

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error - for request validation failures
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly errors?: Record<string, string[]>
  ) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

/**
 * Not found error - for missing resources
 */
export class NotFoundError extends AppError {
  constructor(
    public readonly resource: string,
    public readonly id?: string
  ) {
    const message = id
      ? `${resource} avec l'ID ${id} non trouvé`
      : `${resource} non trouvé`;
    super(message, 404, "NOT_FOUND");
  }
}

/**
 * Unauthorized error - for authentication failures
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Non autorisé") {
    super(message, 401, "UNAUTHORIZED");
  }
}

/**
 * Forbidden error - for authorization failures
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Accès refusé") {
    super(message, 403, "FORBIDDEN");
  }
}

/**
 * Conflict error - for duplicate resources or constraint violations
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

/**
 * Business logic error - for domain/business rule violations
 */
export class BusinessError extends AppError {
  constructor(message: string) {
    super(message, 422, "BUSINESS_ERROR");
  }
}

/**
 * Rate limit error - for too many requests
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = "Trop de requêtes, veuillez réessayer plus tard",
    public readonly retryAfter?: number
  ) {
    super(message, 429, "RATE_LIMIT");
  }
}

/**
 * Service unavailable error - for temporary service outages
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service temporairement indisponible") {
    super(message, 503, "SERVICE_UNAVAILABLE");
  }
}

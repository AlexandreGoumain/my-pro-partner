/**
 * Centralized error exports
 * Import all error classes and utilities from this file
 */

// Custom error classes
export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  BusinessError,
  RateLimitError,
  ServiceUnavailableError,
} from "./custom-errors";

// Prisma error handling
export {
  PrismaErrorCode,
  type PrismaError,
  isPrismaError,
  isPrismaErrorCode,
  getPrismaErrorMessage,
  handlePrismaError,
} from "./prisma";

// Error handling middleware
export {
  withErrorHandling,
  handleError,
  type ErrorContext,
} from "../middleware/error-handler";

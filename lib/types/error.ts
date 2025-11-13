/**
 * Error-related types for Next.js error handling
 */

/**
 * Error object structure for Next.js error.tsx
 */
export interface NextJsError extends Error {
  digest?: string;
}

/**
 * Props for error page component
 */
export interface ErrorPageProps {
  error: NextJsError;
  reset: () => void;
}

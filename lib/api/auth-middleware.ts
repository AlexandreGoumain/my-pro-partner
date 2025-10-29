/**
 * Authentication middleware for API routes
 * Eliminates 6-line duplication in every API handler
 */

import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Checks if user is authenticated and returns session
 * Returns NextResponse with 401 if not authenticated
 *
 * Usage in API route:
 * ```ts
 * export async function GET(req: NextRequest) {
 *   const sessionOrError = await requireAuth();
 *   if (sessionOrError instanceof NextResponse) return sessionOrError;
 *   const session = sessionOrError;
 *   // ... rest of handler
 * }
 * ```
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  return session;
}

/**
 * Higher-order function that wraps an API handler with authentication
 * Usage:
 * ```ts
 * export const GET = withAuth(async (req, session) => {
 *   // session is guaranteed to exist here
 *   return NextResponse.json({ ... });
 * });
 * ```
 */
export function withAuth<T extends unknown[]>(
  handler: (
    req: NextRequest,
    session: Awaited<ReturnType<typeof getServerSession>>,
    ...args: T
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T) => {
    const sessionOrError = await requireAuth();
    if (sessionOrError instanceof NextResponse) {
      return sessionOrError;
    }
    return handler(req, sessionOrError, ...args);
  };
}

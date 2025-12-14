/**
 * CSRF Protection Middleware
 *
 * Protects against Cross-Site Request Forgery attacks by:
 * 1. Generating a signed CSRF token stored in a cookie
 * 2. Validating the token on state-changing requests (POST, PUT, DELETE, PATCH)
 *
 * Usage:
 * ```ts
 * // In API route
 * import { validateCsrf, getCsrfToken } from '@/lib/middleware/csrf';
 *
 * export async function POST(req: NextRequest) {
 *   const csrfError = await validateCsrf(req);
 *   if (csrfError) return csrfError;
 *   // ... handle request
 * }
 *
 * // Generate token for client
 * export async function GET(req: NextRequest) {
 *   return NextResponse.json({ csrfToken: getCsrfToken(req) });
 * }
 * ```
 *
 * Client-side:
 * ```ts
 * // Include in request headers
 * fetch('/api/data', {
 *   method: 'POST',
 *   headers: {
 *     'X-CSRF-Token': csrfToken,
 *   },
 * });
 * ```
 */

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE_NAME = "__Host-csrf";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_SECRET =
    process.env.CSRF_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "fallback-csrf-secret-change-me";
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

interface TokenData {
    token: string;
    timestamp: number;
}

/**
 * Generate a cryptographically secure CSRF token
 */
function generateToken(): string {
    return randomBytes(TOKEN_LENGTH).toString("hex");
}

/**
 * Sign a token with the secret
 */
function signToken(token: string, timestamp: number): string {
    const data = `${token}:${timestamp}`;
    const signature = createHmac("sha256", CSRF_SECRET)
        .update(data)
        .digest("hex");
    return `${data}:${signature}`;
}

/**
 * Verify a signed token
 */
function verifyToken(signedToken: string): TokenData | null {
    try {
        const parts = signedToken.split(":");
        if (parts.length !== 3) return null;

        const [token, timestampStr, signature] = parts;
        const timestamp = parseInt(timestampStr, 10);

        // Check expiry
        if (Date.now() - timestamp > TOKEN_EXPIRY) {
            return null;
        }

        // Verify signature
        const expectedSignature = createHmac("sha256", CSRF_SECRET)
            .update(`${token}:${timestamp}`)
            .digest("hex");

        const signatureBuffer = Buffer.from(signature, "hex");
        const expectedBuffer = Buffer.from(expectedSignature, "hex");

        if (signatureBuffer.length !== expectedBuffer.length) return null;
        if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

        return { token, timestamp };
    } catch {
        return null;
    }
}

/**
 * Get or create a CSRF token for the current request
 * Sets a cookie if one doesn't exist
 */
export function getCsrfToken(req: NextRequest): string {
    // Check for existing token in cookie
    const existingCookie = req.cookies.get(CSRF_COOKIE_NAME);
    if (existingCookie) {
        const tokenData = verifyToken(existingCookie.value);
        if (tokenData) {
            return tokenData.token;
        }
    }

    // Generate new token
    const token = generateToken();
    return token;
}

/**
 * Create a response with CSRF token cookie
 */
export function withCsrfToken(
    response: NextResponse,
    token: string
): NextResponse {
    const signedToken = signToken(token, Date.now());

    response.cookies.set(CSRF_COOKIE_NAME, signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: TOKEN_EXPIRY / 1000,
    });

    return response;
}

/**
 * Validate CSRF token on a request
 * Returns null if valid, or an error response if invalid
 */
export async function validateCsrf(
    req: NextRequest
): Promise<NextResponse | null> {
    // Skip validation for safe methods
    const method = req.method.toUpperCase();
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
        return null;
    }

    // Get token from header
    const headerToken = req.headers.get(CSRF_HEADER_NAME);
    if (!headerToken) {
        return NextResponse.json(
            { message: "CSRF token missing", code: "CSRF_MISSING" },
            { status: 403 }
        );
    }

    // Get token from cookie
    const cookieToken = req.cookies.get(CSRF_COOKIE_NAME);
    if (!cookieToken) {
        return NextResponse.json(
            { message: "CSRF cookie missing", code: "CSRF_COOKIE_MISSING" },
            { status: 403 }
        );
    }

    // Verify cookie token
    const tokenData = verifyToken(cookieToken.value);
    if (!tokenData) {
        return NextResponse.json(
            { message: "CSRF token expired or invalid", code: "CSRF_INVALID" },
            { status: 403 }
        );
    }

    // Compare tokens (timing-safe)
    const headerBuffer = Buffer.from(headerToken);
    const cookieBuffer = Buffer.from(tokenData.token);

    if (
        headerBuffer.length !== cookieBuffer.length ||
        !timingSafeEqual(headerBuffer, cookieBuffer)
    ) {
        return NextResponse.json(
            { message: "CSRF token mismatch", code: "CSRF_MISMATCH" },
            { status: 403 }
        );
    }

    return null; // Valid
}

/**
 * Higher-order function to wrap a route handler with CSRF protection
 */
export function withCsrfProtection<T>(
    handler: (req: NextRequest) => Promise<NextResponse<T>>
): (
    req: NextRequest
) => Promise<NextResponse<T | { message: string; code: string }>> {
    return async (req: NextRequest) => {
        const csrfError = await validateCsrf(req);
        if (csrfError)
            return csrfError as NextResponse<{ message: string; code: string }>;
        return handler(req);
    };
}

/**
 * API endpoint to get a fresh CSRF token
 * Use this to get a token before making state-changing requests
 */
export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies();
    const existingCookie = cookieStore.get(CSRF_COOKIE_NAME);

    let token: string;
    if (existingCookie) {
        const tokenData = verifyToken(existingCookie.value);
        if (tokenData) {
            token = tokenData.token;
        } else {
            token = generateToken();
        }
    } else {
        token = generateToken();
    }

    const response = NextResponse.json({ csrfToken: token });
    return withCsrfToken(response, token);
}

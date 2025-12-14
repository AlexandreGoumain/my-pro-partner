/**
 * CSRF Token Endpoint
 *
 * GET /api/csrf - Get a fresh CSRF token
 *
 * Usage:
 * 1. Call this endpoint to get a CSRF token
 * 2. Include the token in the 'X-CSRF-Token' header for POST/PUT/DELETE requests
 *
 * Example:
 * ```ts
 * const { csrfToken } = await fetch('/api/csrf').then(r => r.json());
 *
 * await fetch('/api/clients', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'X-CSRF-Token': csrfToken,
 *   },
 *   body: JSON.stringify(data),
 * });
 * ```
 */

import { GET } from "@/lib/middleware/csrf";

export { GET };

import { NextResponse } from "next/server";

/**
 * POST /api/client/auth/logout
 * Client portal logout - clears the HttpOnly auth cookie
 */
export async function POST() {
    const response = NextResponse.json({ message: "Déconnexion réussie" });

    // Clear the auth cookie by setting it to expire immediately
    response.cookies.set("clientToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // Expire immediately
    });

    return response;
}

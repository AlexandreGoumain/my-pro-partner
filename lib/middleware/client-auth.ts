import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const CLIENT_JWT_SECRET = process.env.CLIENT_JWT_SECRET || process.env.NEXTAUTH_SECRET;

/**
 * Verify client authentication from JWT token
 * Returns client info if authenticated, throws error otherwise
 */
export async function requireClientAuth(req: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            throw new Error("No authentication token provided");
        }

        // Verify JWT token (using next-auth's getToken for consistency)
        const decoded = await getToken({
            req,
            secret: CLIENT_JWT_SECRET,
            secureCookie: process.env.NODE_ENV === "production",
        });

        if (!decoded || !decoded.clientId) {
            throw new Error("Invalid or expired token");
        }

        // Fetch client from database
        const client = await prisma.client.findUnique({
            where: { id: decoded.clientId as string },
            include: {
                niveauFidelite: true,
                entreprise: true,
            },
        });

        if (!client) {
            throw new Error("Client not found");
        }

        if (!client.clientPortalEnabled) {
            throw new Error("Client portal access is disabled");
        }

        return {
            client,
            entrepriseId: client.entrepriseId,
        };
    } catch (error) {
        throw error;
    }
}

/**
 * Handle client authentication errors
 */
export function handleClientAuthError(error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication failed";

    if (message.includes("No authentication token") || message.includes("Invalid or expired token")) {
        return NextResponse.json(
            { message: "Non autorisé. Veuillez vous connecter." },
            { status: 401 }
        );
    }

    if (message.includes("Client portal access is disabled")) {
        return NextResponse.json(
            { message: "Accès au portail client désactivé. Contactez l'entreprise." },
            { status: 403 }
        );
    }

    return NextResponse.json(
        { message: "Erreur d'authentification" },
        { status: 401 }
    );
}

/**
 * Ensure client can only access their own data
 */
export function ensureClientOwnership(clientId: string, resourceClientId: string) {
    if (clientId !== resourceClientId) {
        throw new Error("Access denied: you can only access your own data");
    }
}
